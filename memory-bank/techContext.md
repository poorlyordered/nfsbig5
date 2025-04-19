# Tech Context

## Technologies Used
- **Frontend:** Next.js (React, TypeScript)
- **Backend:** Next.js API routes (Node.js), Netlify Edge Functions (TypeScript/Deno)
- **Database:** MongoDB Atlas (accessed via MongoDB Data API for Edge Functions, official Node.js driver for Next.js API routes)
- **Styling:** Tailwind CSS, global CSS, custom fonts
- **Monorepo:** Multiple packages for questions, results, and scoring logic

## Development Setup
- Node.js and npm/pnpm/yarn for package management
- Environment variables for DB connection and site config
- Modular codebase for easy maintenance and extension

## Technical Constraints
- MongoDB must be accessible from the deployment environment
- Environment variables (`DB_URL`, `DB_NAME`, `DB_COLLECTION`) must be set
- Branding assets and config must be updated for each deployment
- Logo and brand assets for NFS Big5 should be placed in the `images` directory

## Dependencies
- next, react, mongodb, tailwindcss, and related packages
- Internal packages: questions, results, score
- Markdown processing: gray-matter, remark, remark-gfm, remark-html

## Tool Usage Patterns
- Use of config files (`site.ts`, `fonts.ts`, `tailwind.config.js`) for customization
- Public assets in `web/public/` and custom assets in `images/` for branding
- Markdown files for posts and documentation processed with custom utilities in `src/lib/markdown.ts`