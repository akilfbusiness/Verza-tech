# Phase 2 Testing Checklist

## Content Model Validation

### Tool Schema Testing
- [ ] Create a new tool document in Sanity Studio
- [ ] Verify all required fields are enforced
- [ ] Test slug auto-generation from tool name
- [ ] Upload and verify image/logo rendering
- [ ] Add pricing information (test all pricing models: free, freemium, paid, enterprise)
- [ ] Add features list (test array validation)
- [ ] Add pros and cons (test array validation)
- [ ] Test rating field (0-5 scale with 0.5 increments)
- [ ] Verify affiliate link validation
- [ ] Test category reference (must link to existing category)
- [ ] Test alternatives reference (must link to other tools)
- [ ] Verify publish/draft status toggle
- [ ] Test verification badge toggle
- [ ] Test featured tool toggle

### Category Schema Testing
- [ ] Create multiple categories
- [ ] Verify slug uniqueness
- [ ] Test icon field (emoji or image)
- [ ] Add description with rich text
- [ ] Verify category appears in tool schema dropdown

### Author Schema Testing
- [ ] Create author profile
- [ ] Add bio with portable text (test formatting)
- [ ] Add profile photo
- [ ] Test social links validation (Twitter, LinkedIn, GitHub)
- [ ] Verify email format validation
- [ ] Test expertise tags array
- [ ] Verify author appears in review/comparison dropdowns

### Review Schema Testing
- [ ] Create a review document
- [ ] Link to an existing tool
- [ ] Link to an author
- [ ] Add rich content with portable text
- [ ] Test verdict section
- [ ] Add score (should match tool rating)
- [ ] Verify publish date validation
- [ ] Test related tools references

### FAQ Schema Testing
- [ ] Create FAQ entries
- [ ] Test question/answer portable text
- [ ] Assign to categories
- [ ] Toggle published status
- [ ] Verify FAQ appears correctly

### Comparison Schema Testing
- [ ] Create a comparison document
- [ ] Add 2-4 tools to compare
- [ ] Test winner selection (must be one of the compared tools)
- [ ] Add comparison criteria
- [ ] Verify slug generation

## Portable Text Testing
- [ ] Test all heading styles (H1-H4)
- [ ] Test text formatting (bold, italic, code, underline, strikethrough)
- [ ] Test bulleted lists
- [ ] Test numbered lists
- [ ] Add external links (verify opens in new tab option)
- [ ] Add internal links (verify reference to other documents)
- [ ] Insert images with alt text and captions
- [ ] Add callout blocks (info, warning, success, error)
- [ ] Add code blocks with syntax highlighting

## Slug Validation Testing
- [ ] Create document with simple title → verify clean slug
- [ ] Create title with special characters → verify sanitization
- [ ] Create title with spaces → verify hyphenation
- [ ] Try creating duplicate slug → verify error/warning
- [ ] Test slug max length (200 characters)

## Data Relationships Testing
- [ ] Verify tool → category reference works
- [ ] Verify tool → alternatives reference works
- [ ] Verify review → tool reference works
- [ ] Verify review → author reference works
- [ ] Verify comparison → tools reference works
- [ ] Delete a category → check tools using it show warning
- [ ] Delete a tool → check reviews/comparisons using it

## Studio UI/UX Testing
- [ ] Navigate all sections in sidebar
- [ ] Use Vision plugin to test GROQ queries
- [ ] Test search functionality
- [ ] Test filtering by document type
- [ ] Verify preview pane works
- [ ] Test publishing workflow
- [ ] Test draft/published status
- [ ] Verify document history/revisions

## Seed Data Import
- [ ] Run seed data import script
- [ ] Verify all categories imported correctly
- [ ] Verify all authors imported correctly
- [ ] Verify sample tools imported correctly
- [ ] Verify FAQs imported correctly
- [ ] Check for any import errors in console

## API Integration Testing
- [ ] Verify Sanity client connection (read)
- [ ] Test GROQ queries from frontend
- [ ] Verify image URLs generate correctly
- [ ] Test data fetching with ISR
- [ ] Verify environment variables are set

## Validation Rules Testing
- [ ] Test required field validation
- [ ] Test URL format validation
- [ ] Test email format validation
- [ ] Test rating range validation (0-5)
- [ ] Test price validation (non-negative)
- [ ] Test array min/max validation
- [ ] Test slug format validation

## Performance Testing
- [ ] Test Studio load time
- [ ] Test large document editing
- [ ] Test image upload speed
- [ ] Verify portable text editor responsiveness
- [ ] Test with multiple browser tabs open

## Pass Criteria

Phase 2 is complete when:
- ✅ All schemas are functional in Sanity Studio
- ✅ Seed data successfully imported
- ✅ All validation rules working correctly
- ✅ Portable text editor working with all features
- ✅ Relationships between documents work correctly
- ✅ Images upload and render properly
- ✅ GROQ queries return expected data
- ✅ No console errors in Studio
- ✅ Documentation is clear and complete

## Notes

**Common Issues:**
- If Studio doesn't load → check environment variables
- If schemas don't appear → verify schema export in index.ts
- If images don't load → check CORS settings and project ID
- If queries fail → test in Vision plugin first
- If validation doesn't work → check Rule syntax

**Next Steps After Phase 2:**
Once all tests pass, you're ready for Phase 3: Building dynamic pages and SSR implementation.
