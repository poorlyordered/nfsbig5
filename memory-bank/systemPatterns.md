# System Patterns

## System Architecture
- **Frontend:** Next.js web application (TypeScript, React)
- **Backend:** Next.js API routes (Node.js) and Netlify Edge Functions (TypeScript/Deno) for backend logic and data access.
- **Database:** MongoDB Atlas, with collections for results, feedback, and user data. Accessed via MongoDB Data API from Edge Functions and official Node.js driver from Next.js API routes.
- **Packages:** Modular monorepo structure with separate packages for questions, results, and scoring logic

## Key Technical Decisions
- Use of MongoDB for flexible, scalable storage of NFS Big5 assessment results
- Modularization of core logic (questions, results, score) for reusability and maintainability
- English-only support via configuration and content files (Internationalization support removed for current phase)
- Branding and theming via public assets, CSS, and config files
- Custom markdown processing for blog posts and content using remark ecosystem

## Design Patterns in Use
- Separation of concerns: UI, business logic, and data access are clearly separated
- Configuration-driven branding (language support is English-only)
- Use of environment variables for deployment flexibility
- Utility-based content processing with modular markdown transformation pipeline

## Component Relationships
- Web frontend interacts with backend API routes and/or Netlify Edge Functions for test submission and result retrieval.
- Backend logic (in API routes and Edge Functions) uses shared logic from packages for scoring and result generation where applicable.
- Database layer abstracts MongoDB Atlas access, with different access methods for API routes and Edge Functions.
- Content utilities in `src/lib/markdown.ts` provide data for blog and article components

## Critical Implementation Paths
- User completes NFS Big5 assessment → answers submitted to backend (API route or Edge Function) → results scored and stored in MongoDB Atlas → user receives and can share results
- Admin customizes branding/assets/config (using assets from the `images` directory) → redeploys app for new brand or audience
- **For latency-sensitive data access (e.g., AI sessions), frontend interacts with Netlify Edge Functions which use the MongoDB Data API.**