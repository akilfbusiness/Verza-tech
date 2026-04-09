# Sanity CMS Setup Guide for Verza

This guide will help you set up Sanity CMS as your content backend.

## Quick Start

### 1. Create a Sanity Project

```bash
# Install Sanity CLI globally (if not already installed)
npm install -g @sanity/cli

# Create a new Sanity Studio project
npx sanity init

# Follow the prompts:
# - Create new project
# - Project name: Verza
# - Dataset: production
# - Output path: ./studio (or your preferred location)
# - Template: Clean project with no predefined schemas
```

### 2. Copy Schemas to Your Studio

Copy all files from `/sanity/schemas/` to your studio's schema directory:

```bash
cp -r sanity/schemas/* studio/schemas/
```

### 3. Configure Your Studio

In your `studio/sanity.config.ts`, import and use the schemas:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'verza',
  title: 'Verza',
  projectId: 'YOUR_PROJECT_ID', // Get this from sanity.io
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

### 4. Get Your Credentials

1. Go to https://www.sanity.io/manage
2. Select your project
3. Copy your **Project ID**
4. Go to API settings and create a token with **Read** permissions (or **Read+Write** if you need mutations)

### 5. Add Environment Variables

Create a `.env.local` file in your Next.js project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Update with your actual Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6. Deploy Your Studio (Optional)

Deploy your Sanity Studio to manage content online:

```bash
cd studio
npx sanity deploy
```

This creates a hosted studio at `your-project.sanity.studio`

## Content Structure

Your Sanity Studio will have these content types:

### 📦 Tool
The main content type for SaaS/AI tools
- Name, slug, description
- Logo and screenshots
- Pricing tiers
- Categories and features
- Ratings and reviews
- Affiliate links

### 🏷️ Category
Organize tools by category
- Name, slug, description
- Icon name (Lucide icons)

### ✍️ Author
Content creators for E-E-A-T signals
- Name, bio, expertise
- Profile image
- Social links

### 📝 Review
In-depth tool reviews
- Title and content (Portable Text)
- Associated tool and author
- Rating, pros, cons
- Publish dates

### ❓ FAQ
Frequently asked questions
- Question and answer
- Associated with tools or categories
- Critical for AEO optimization

### 🔄 Comparison
Side-by-side tool comparisons
- Multiple tools
- Comparison table
- Verdict

## Next Steps

1. **Create your first content:**
   - Add a few categories (e.g., "AI Writing", "Productivity")
   - Create an author profile
   - Add your first tool
   - Write a review

2. **Test the connection:**
   - Start your Next.js dev server: `npm run dev`
   - Visit http://localhost:3000
   - Content should populate from Sanity

3. **Set up content workflow:**
   - Add team members in Sanity dashboard
   - Configure roles and permissions
   - Set up publish workflows

## Troubleshooting

**Connection errors:**
- Verify environment variables are correct
- Ensure `.env.local` is in your project root
- Restart your dev server after adding env vars

**No content showing:**
- Check your Sanity dataset has content
- Verify your API token has read permissions
- Check browser console for errors

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Clear Next.js cache: `rm -rf .next`

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/nextjs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
