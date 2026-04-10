import { definePlugin } from 'sanity'
import { ImportExportTool } from './ImportExportTool'

export const importExportPlugin = definePlugin({
  name: 'import-export',
  tools: [
    {
      name: 'import-export',
      title: 'Import / Export',
      component: ImportExportTool,
    },
  ],
})
