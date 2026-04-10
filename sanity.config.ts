import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { importExportPlugin } from './sanity/plugins/import-export'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name: 'verza',
  title: 'Verza CMS',
  projectId,
  dataset,
  basePath: '/studio',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Articles')
              .child(
                S.documentTypeList('blog')
                  .title('Blog Articles')
                  .filter('_type == "blog"')
              ),
            S.listItem()
              .title('Categories')
              .child(
                S.documentTypeList('category')
                  .title('Categories')
                  .filter('_type == "category"')
              ),
            S.listItem()
              .title('Tools')
              .child(
                S.documentTypeList('tool')
                  .title('Tools')
                  .filter('_type == "tool"')
              ),
            S.listItem()
              .title('Authors')
              .child(
                S.documentTypeList('author')
                  .title('Authors')
                  .filter('_type == "author"')
              ),
            S.divider(),
            S.listItem()
              .title('Reviews')
              .child(
                S.documentTypeList('review')
                  .title('Reviews')
                  .filter('_type == "review"')
              ),
            S.listItem()
              .title('Comparisons')
              .child(
                S.documentTypeList('comparison')
                  .title('Comparisons')
                  .filter('_type == "comparison"')
              ),
            S.listItem()
              .title('FAQs')
              .child(
                S.documentTypeList('faq')
                  .title('FAQs')
                  .filter('_type == "faq"')
              ),
          ]),
    }),
    importExportPlugin(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
