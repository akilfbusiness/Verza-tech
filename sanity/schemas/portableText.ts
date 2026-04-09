/**
 * Portable Text Configuration
 * 
 * Defines custom block content styles and decorators for rich text editing.
 * These configurations apply to all content fields using Portable Text.
 */

export const portableTextStyles = [
  { title: 'Normal', value: 'normal' },
  { title: 'H1', value: 'h1' },
  { title: 'H2', value: 'h2' },
  { title: 'H3', value: 'h3' },
  { title: 'H4', value: 'h4' },
  { title: 'Quote', value: 'blockquote' },
]

export const portableTextDecorators = [
  { title: 'Strong', value: 'strong' },
  { title: 'Emphasis', value: 'em' },
  { title: 'Code', value: 'code' },
  { title: 'Underline', value: 'underline' },
  { title: 'Strike', value: 'strike-through' },
]

export const portableTextLists = [
  { title: 'Bullet', value: 'bullet' },
  { title: 'Numbered', value: 'number' },
]

export const portableTextAnnotations = [
  {
    name: 'link',
    type: 'object',
    title: 'External Link',
    fields: [
      {
        name: 'href',
        type: 'url',
        title: 'URL',
        validation: (Rule: any) =>
          Rule.uri({
            scheme: ['http', 'https', 'mailto', 'tel'],
          }),
      },
      {
        name: 'blank',
        type: 'boolean',
        title: 'Open in new tab',
        description: 'Open link in a new browser tab',
        initialValue: true,
      },
    ],
  },
  {
    name: 'internalLink',
    type: 'object',
    title: 'Internal Link',
    fields: [
      {
        name: 'reference',
        type: 'reference',
        title: 'Reference',
        to: [
          { type: 'tool' },
          { type: 'review' },
          { type: 'comparison' },
          { type: 'category' },
        ],
      },
    ],
  },
]

/**
 * Custom Block Types for Rich Content
 */
export const customBlockTypes = [
  {
    type: 'image',
    name: 'image',
    title: 'Image',
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alternative text',
        description: 'Important for SEO and accessibility',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'caption',
        type: 'string',
        title: 'Caption',
      },
    ],
    options: {
      hotspot: true,
    },
  },
  {
    type: 'object',
    name: 'callout',
    title: 'Callout',
    fields: [
      {
        name: 'type',
        type: 'string',
        title: 'Type',
        options: {
          list: [
            { title: 'Info', value: 'info' },
            { title: 'Warning', value: 'warning' },
            { title: 'Success', value: 'success' },
            { title: 'Error', value: 'error' },
          ],
        },
        initialValue: 'info',
      },
      {
        name: 'text',
        type: 'text',
        title: 'Text',
        rows: 3,
      },
    ],
    preview: {
      select: {
        type: 'type',
        text: 'text',
      },
      prepare({ type, text }: { type: string; text: string }) {
        return {
          title: `${type.toUpperCase()}: ${text?.substring(0, 50)}...`,
        }
      },
    },
  },
  {
    type: 'object',
    name: 'codeBlock',
    title: 'Code Block',
    fields: [
      {
        name: 'language',
        type: 'string',
        title: 'Language',
        options: {
          list: [
            { title: 'JavaScript', value: 'javascript' },
            { title: 'TypeScript', value: 'typescript' },
            { title: 'Python', value: 'python' },
            { title: 'HTML', value: 'html' },
            { title: 'CSS', value: 'css' },
            { title: 'JSON', value: 'json' },
            { title: 'Bash', value: 'bash' },
          ],
        },
      },
      {
        name: 'code',
        type: 'text',
        title: 'Code',
        rows: 10,
      },
      {
        name: 'filename',
        type: 'string',
        title: 'Filename',
        description: 'Optional filename to display',
      },
    ],
  },
]

/**
 * Standard Portable Text Block Configuration
 * Use this for most rich text fields
 */
export const standardBlockContent = {
  type: 'array',
  of: [
    {
      type: 'block',
      styles: portableTextStyles,
      lists: portableTextLists,
      marks: {
        decorators: portableTextDecorators,
        annotations: portableTextAnnotations,
      },
    },
    ...customBlockTypes,
  ],
}
