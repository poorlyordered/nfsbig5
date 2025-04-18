# System Patterns

## System Architecture
- **Frontend:** Next.js web application (TypeScript, React)
- **Backend:** API routes within Next.js, direct MongoDB access for result storage/retrieval
- **Database:** MongoDB, with collections for results, feedback, and possibly user data
- **Packages:** Modular monorepo structure with separate packages for questions, results, and scoring logic

## Key Technical Decisions
- Use of MongoDB for flexible, scalable storage of NFS Big5 assessment results
- Modularization of core logic (questions, results, score) for reusability and maintainability
- Internationalization support via configuration and content files
- Branding and theming via public assets, CSS, and config files
- Custom markdown processing for blog posts and content using remark ecosystem

## Design Patterns in Use
- Separation of concerns: UI, business logic, and data access are clearly separated
- Configuration-driven branding and language support
- Use of environment variables for deployment flexibility
- Utility-based content processing with modular markdown transformation pipeline

## Component Relationships
- Web frontend interacts with backend API routes for test submission and result retrieval
- Backend API uses shared logic from packages for scoring and result generation
- Database layer abstracts MongoDB access
- Content utilities in `src/lib/markdown.ts` provide data for blog and article components

## Critical Implementation Paths
- User completes NFS Big5 assessment → answers submitted to backend → results scored and stored in MongoDB → user receives and can share results
- Admin customizes branding/assets/config (using assets from the `images` directory) → redeploys app for new brand or audience