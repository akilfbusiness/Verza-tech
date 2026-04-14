'use client'

import { useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { Card, Stack, Text, Button, Select, Flex, Badge, Spinner, TextArea, Heading, Box, Checkbox, Label } from '@sanity/ui'
import { DownloadIcon, UploadIcon, CheckmarkIcon, ErrorOutlineIcon, WarningOutlineIcon } from '@sanity/icons'
import { DOCUMENT_TYPES, templates } from './templates'

type Status = 'idle' | 'previewing' | 'loading' | 'success' | 'error'

interface PlaceholderWarning {
  field: string
  value: string
}

// Detects placeholder strings — any all-caps token like AUTHOR_ID_HERE, TOOL_SERANKING_ID, etc.
const PLACEHOLDER_PATTERN = /^[A-Z][A-Z0-9_]*(?:_ID|_HERE|_REF|_ID_HERE).*$/

function isPlaceholder(value: string): boolean {
  return typeof value === 'string' && PLACEHOLDER_PATTERN.test(value.trim())
}

// Walk the entire JSON tree and collect every placeholder found, with its field path
function collectPlaceholders(obj: any, path = ''): PlaceholderWarning[] {
  const warnings: PlaceholderWarning[] = []
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => warnings.push(...collectPlaceholders(item, `${path}[${i}]`)))
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      const currentPath = path ? `${path}.${key}` : key
      if (typeof val === 'string' && isPlaceholder(val)) {
        warnings.push({ field: currentPath, value: val })
      } else {
        warnings.push(...collectPlaceholders(val, currentPath))
      }
    }
  }
  return warnings
}

// Prepare document for import:
// - Removes _instructions fields (template guidance, not real data)
// - Marks any reference with a placeholder _ref as _weak: true
//   so Sanity accepts the import even if the referenced document doesn't exist yet.
//   Weak refs show as "broken link" in Studio — you click and swap in the real document later.
function prepareForImport(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(prepareForImport)
  }
  if (obj && typeof obj === 'object') {
    // Reference with a placeholder _ref — mark as weak so Sanity doesn't reject it
    if (obj._type === 'reference' && obj._ref && isPlaceholder(obj._ref)) {
      return { ...obj, _weak: true }
    }
    const cleaned: any = {}
    for (const key of Object.keys(obj)) {
      if (key === '_instructions') continue
      cleaned[key] = prepareForImport(obj[key])
    }
    return cleaned
  }
  return obj
}

export function ImportExportTool() {
  const client = useClient({ apiVersion: '2024-01-01' })

  const [selectedType, setSelectedType] = useState('blog')
  const [importJson, setImportJson] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [createdId, setCreatedId] = useState('')
  const [warnings, setWarnings] = useState<PlaceholderWarning[]>([])
  const [previewData, setPreviewData] = useState<any>(null)
  const [understood, setUnderstood] = useState(false)

  // ─── EXPORT TEMPLATE ────────────────────────────────────────────────────────
  const handleExportTemplate = useCallback(() => {
    const template = templates[selectedType]
    if (!template) return
    const json = JSON.stringify(template, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `verza-${selectedType}-template.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [selectedType])

  // ─── STEP 1: VALIDATE + PREVIEW ─────────────────────────────────────────────
  const handlePreview = useCallback(() => {
    if (!importJson.trim()) {
      setStatus('error')
      setMessage('Please paste your filled JSON before importing.')
      return
    }

    let parsed: any
    try {
      parsed = JSON.parse(importJson)
    } catch {
      setStatus('error')
      setMessage('Invalid JSON. Please check your JSON is correctly formatted and try again.')
      return
    }

    if (!parsed._type) {
      setStatus('error')
      setMessage('JSON is missing the "_type" field. Make sure you did not remove it.')
      return
    }

    const found = collectPlaceholders(parsed)
    const prepared = prepareForImport(parsed)

    setWarnings(found)
    setPreviewData(prepared)
    setUnderstood(false)
    setStatus('previewing')
    setMessage('')
  }, [importJson])

  // ─── STEP 2: CONFIRM + IMPORT ───────────────────────────────────────────────
  const handleConfirmImport = useCallback(async () => {
    if (!previewData) return

    setStatus('loading')
    setMessage('')
    setCreatedId('')

    try {
      const result = await client.create(previewData)
      setStatus('success')
      setCreatedId(result._id)
      setMessage(`Document created successfully! ID: ${result._id}`)
      setImportJson('')
      setPreviewData(null)
      setWarnings([])
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message || 'Failed to create document. Check your JSON fields match the schema.')
    }
  }, [previewData, client])

  const handleClearImport = () => {
    setImportJson('')
    setStatus('idle')
    setMessage('')
    setCreatedId('')
    setWarnings([])
    setPreviewData(null)
    setUnderstood(false)
  }

  const handleBackToEdit = () => {
    setStatus('idle')
    setWarnings([])
    setPreviewData(null)
    setUnderstood(false)
  }

  return (
    <Box padding={5} style={{ maxWidth: 900, margin: '0 auto' }}>
      <Stack space={6}>

        {/* Header */}
        <Stack space={3}>
          <Heading size={3}>JSON Import / Export</Heading>
          <Text muted size={2}>
            Export a blank template for any document type, fill it in using AI, then import the completed JSON to instantly create the document in Sanity — no manual typing required.
          </Text>
        </Stack>

        {/* Document Type Selector */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Text weight="semibold" size={2}>Document Type</Text>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType((e.target as HTMLSelectElement).value)}
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </Select>
          </Stack>
        </Card>

        {/* Export Section */}
        <Card padding={4} radius={3} shadow={1} tone="primary">
          <Stack space={4}>
            <Flex align="center" gap={3}>
              <DownloadIcon style={{ width: 20, height: 20 }} />
              <Text weight="semibold" size={2}>Step 1 — Export Blank Template</Text>
            </Flex>
            <Text muted size={1}>
              Download a blank JSON template with field descriptions. Give this template + your article notes to Claude or ChatGPT and ask it to fill out every field.
            </Text>
            <Button
              icon={DownloadIcon}
              text={`Download ${DOCUMENT_TYPES.find(d => d.value === selectedType)?.label} Template`}
              tone="primary"
              mode="default"
              onClick={handleExportTemplate}
            />
          </Stack>
        </Card>

        {/* AI Instructions */}
        <Card padding={4} radius={3} shadow={1} tone="caution">
          <Stack space={3}>
            <Text weight="semibold" size={2}>Step 2 — Fill with AI</Text>
            <Text muted size={1}>
              Paste this prompt into Claude or ChatGPT along with the template and your content:
            </Text>
            <Card padding={3} radius={2} tone="default">
              <Text size={1} style={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
                {`"Here is a Sanity CMS JSON template and my article content below. Please fill in every field in the JSON template using my content. Follow the field descriptions exactly. For any field marked [REQUIRED], make sure it has a real value. Remove all _instructions fields from the output. Return only the completed, valid JSON — nothing else."`}
              </Text>
            </Card>
          </Stack>
        </Card>

        {/* Import Section — only show when not in preview/loading/success */}
        {(status === 'idle' || status === 'error') && (
          <Card padding={4} radius={3} shadow={1}>
            <Stack space={4}>
              <Flex align="center" gap={3}>
                <UploadIcon style={{ width: 20, height: 20 }} />
                <Text weight="semibold" size={2}>Step 3 — Import Filled JSON</Text>
              </Flex>
              <Text muted size={1}>
                Paste the completed JSON from your AI below, then click Review & Import.
                Any unfilled placeholder references (e.g. unlinked authors, tools, categories) will be
                imported as-is and shown as broken links inside Sanity — you can swap them for real
                documents later without losing any of your content.
              </Text>
              <TextArea
                value={importJson}
                onChange={(e) => setImportJson((e.target as HTMLTextAreaElement).value)}
                placeholder={`Paste your filled ${DOCUMENT_TYPES.find(d => d.value === selectedType)?.label} JSON here...`}
                rows={14}
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
              <Flex gap={3}>
                <Button
                  icon={UploadIcon}
                  text="Review & Import"
                  tone="positive"
                  mode="default"
                  onClick={handlePreview}
                />
                {importJson && (
                  <Button
                    text="Clear"
                    mode="ghost"
                    tone="critical"
                    onClick={handleClearImport}
                  />
                )}
              </Flex>
            </Stack>
          </Card>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <Card padding={4} radius={3} tone="critical">
            <Flex align="center" gap={3}>
              <ErrorOutlineIcon style={{ width: 20, height: 20 }} />
              <Stack space={2}>
                <Text weight="semibold" size={2}>Import failed</Text>
                <Text size={1} muted>{message}</Text>
              </Stack>
            </Flex>
          </Card>
        )}

        {/* ── STEP 2: CONFIRMATION PANEL ─────────────────────────────────────── */}
        {status === 'previewing' && previewData && (
          <Card padding={5} radius={3} shadow={2} tone="default">
            <Stack space={5}>

              <Stack space={2}>
                <Heading size={2}>Confirm Import</Heading>
                <Text muted size={2}>
                  Review what will be created before confirming. This document will be saved as a
                  draft — you can review and publish it from the sidebar.
                </Text>
              </Stack>

              {/* What will be created */}
              <Card padding={4} radius={2} tone="positive">
                <Stack space={3}>
                  <Flex align="center" gap={2}>
                    <CheckmarkIcon style={{ width: 16, height: 16 }} />
                    <Text weight="semibold" size={2}>Will be created</Text>
                  </Flex>
                  <Stack space={2}>
                    <Flex gap={2} align="center">
                      <Text size={1} muted>Document type:</Text>
                      <Badge tone="positive" mode="outline" fontSize={1}>{previewData._type}</Badge>
                    </Flex>
                    {previewData.title && (
                      <Flex gap={2} align="center">
                        <Text size={1} muted>Title:</Text>
                        <Text size={1} weight="semibold">{previewData.title}</Text>
                      </Flex>
                    )}
                    {previewData.slug?.current && (
                      <Flex gap={2} align="center">
                        <Text size={1} muted>Slug:</Text>
                        <Text size={1} style={{ fontFamily: 'monospace' }}>{previewData.slug.current}</Text>
                      </Flex>
                    )}
                  </Stack>
                </Stack>
              </Card>

              {/* Placeholder warnings */}
              {warnings.length > 0 && (
                <Card padding={4} radius={2} tone="caution">
                  <Stack space={3}>
                  <Flex align="center" gap={2}>
                    <WarningOutlineIcon style={{ width: 16, height: 16 }} />
                    <Text weight="semibold" size={2}>
                      {warnings.length} unfilled placeholder{warnings.length > 1 ? 's' : ''} detected — these will import as broken links
                    </Text>
                  </Flex>
                  <Text muted size={1}>
                    These are references to documents that do not exist yet (authors, tools, categories, etc.).
                    They will be imported with your placeholder text intact and shown as broken links inside
                    Sanity Studio. Once you create the real document (e.g. an Author or Tool), open this
                    draft, click the broken link field, and swap it in. Nothing is lost or removed.
                  </Text>
                    <Stack space={2}>
                      {warnings.map((w, i) => (
                        <Card key={i} padding={3} radius={2} tone="caution">
                          <Flex gap={3} align="center">
                            <Text size={1} style={{ fontFamily: 'monospace', opacity: 0.7, minWidth: 200 }}>
                              {w.field}
                            </Text>
                            <Badge tone="caution" mode="outline" fontSize={0}>{w.value}</Badge>
                          </Flex>
                        </Card>
                      ))}
                    </Stack>

                    {/* Acknowledgement checkbox */}
                    <Flex align="center" gap={3} style={{ paddingTop: 8 }}>
                      <Checkbox
                        id="understood"
                        checked={understood}
                        onChange={(e) => setUnderstood((e.target as HTMLInputElement).checked)}
                      />
                      <Label htmlFor="understood" size={2}>
                        I understand these references are placeholders — I will replace them with real documents inside Sanity later
                      </Label>
                    </Flex>
                  </Stack>
                </Card>
              )}

              {/* Action buttons */}
              <Flex gap={3}>
                <Button
                  icon={UploadIcon}
                  text="Confirm & Import"
                  tone="positive"
                  mode="default"
                  onClick={handleConfirmImport}
                  disabled={warnings.length > 0 && !understood}
                />
                <Button
                  text="Go Back & Edit"
                  mode="ghost"
                  tone="default"
                  onClick={handleBackToEdit}
                />
              </Flex>

            </Stack>
          </Card>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <Card padding={4} radius={3} tone="primary">
            <Flex align="center" gap={3}>
              <Spinner />
              <Text size={2}>Creating document in Sanity...</Text>
            </Flex>
          </Card>
        )}

        {/* Success */}
        {status === 'success' && (
          <Card padding={4} radius={3} tone="positive">
            <Stack space={3}>
              <Flex align="center" gap={3}>
                <CheckmarkIcon style={{ width: 20, height: 20 }} />
                <Text weight="semibold" size={2}>Document created successfully!</Text>
              </Flex>
              <Text size={1} muted>
                Go to the{' '}
                <strong>{DOCUMENT_TYPES.find(d => d.value === selectedType)?.label}</strong>{' '}
                tab in the sidebar to find your new document, review all fields, and publish it.
                Any blank reference fields can be filled in there.
              </Text>
              {createdId && (
                <Badge tone="positive" mode="outline" fontSize={1}>
                  ID: {createdId}
                </Badge>
              )}
              <Box>
                <Button
                  text="Import Another Document"
                  mode="ghost"
                  tone="default"
                  onClick={handleClearImport}
                />
              </Box>
            </Stack>
          </Card>
        )}

      </Stack>
    </Box>
  )
}
