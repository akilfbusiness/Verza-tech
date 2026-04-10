'use client'

import { useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { Card, Stack, Text, Button, Select, Flex, Badge, Spinner, TextArea, Heading, Box } from '@sanity/ui'
import { DownloadIcon, UploadIcon, CheckmarkIcon, ErrorOutlineIcon } from '@sanity/icons'
import { DOCUMENT_TYPES, templates } from './templates'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ImportExportTool() {
  const client = useClient({ apiVersion: '2024-01-01' })

  const [selectedType, setSelectedType] = useState('blog')
  const [importJson, setImportJson] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [createdId, setCreatedId] = useState('')

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

  // ─── IMPORT JSON ────────────────────────────────────────────────────────────
  const handleImport = useCallback(async () => {
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

    // Strip _instructions fields recursively
    const strip = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map(strip)
      if (obj && typeof obj === 'object') {
        const cleaned: any = {}
        for (const key of Object.keys(obj)) {
          if (key === '_instructions') continue
          cleaned[key] = strip(obj[key])
        }
        return cleaned
      }
      return obj
    }

    const cleaned = strip(parsed)

    if (!cleaned._type) {
      setStatus('error')
      setMessage('JSON is missing the "_type" field. Make sure you did not remove it.')
      return
    }

    setStatus('loading')
    setMessage('')
    setCreatedId('')

    try {
      const result = await client.create(cleaned)
      setStatus('success')
      setCreatedId(result._id)
      setMessage(`Document created successfully! ID: ${result._id}`)
      setImportJson('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message || 'Failed to create document. Check your JSON fields match the schema.')
    }
  }, [importJson, client])

  const handleClearImport = () => {
    setImportJson('')
    setStatus('idle')
    setMessage('')
    setCreatedId('')
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

        {/* Import Section */}
        <Card padding={4} radius={3} shadow={1}>
          <Stack space={4}>
            <Flex align="center" gap={3}>
              <UploadIcon style={{ width: 20, height: 20 }} />
              <Text weight="semibold" size={2}>Step 3 — Import Filled JSON</Text>
            </Flex>
            <Text muted size={1}>
              Paste the completed JSON from your AI below, then click Import. The document will be instantly created in Sanity — ready to review and publish.
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
                text="Import Document"
                tone="positive"
                mode="default"
                onClick={handleImport}
                disabled={status === 'loading'}
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

        {/* Status Messages */}
        {status === 'loading' && (
          <Card padding={4} radius={3} tone="primary">
            <Flex align="center" gap={3}>
              <Spinner />
              <Text size={2}>Creating document in Sanity...</Text>
            </Flex>
          </Card>
        )}

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
              </Text>
              {createdId && (
                <Badge tone="positive" mode="outline" fontSize={1}>
                  ID: {createdId}
                </Badge>
              )}
            </Stack>
          </Card>
        )}

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

      </Stack>
    </Box>
  )
}
