# Active Context

## Current Work Focus
- Updating all Memory Bank documentation to reflect the NFS Big5 branding
- Integrating new logo assets from the `images` directory into the branding plan and documentation
- Ensuring all references to the assessment use "NFS Big5"
- **Implementing deployment infrastructure with Netlify and MongoDB Atlas.**

## Recent Changes
- All core Memory Bank files updated to use the NFS Big5 name and reference the new asset location
- Branding customization plan instructs use of logo assets from `images/`
- Migrated from contentlayer to a custom markdown processing solution using remark, gray-matter, and related libraries
- **Completed MongoDB Atlas migration and verified database connectivity.**
- **Scaffolded initial Netlify Edge Function (`netlify/edge-functions/get-ai-sessions.ts`) and created `netlify.toml` for configuration.**
- **Resolved ESLint parsing error by excluding specific files in `web/.eslintrc.json`.**
- **Removed `.env.local` from Git history using `git-filter-repo` to prevent exposure of sensitive information.**
- **Resolved Netlify "page not found" error by configuring build settings (base directory and build command) in `netlify.toml`.**

## Next Steps
- Implement branding changes in the codebase using assets from `images`
- Update UI, config, and documentation to consistently use "NFS Big5"
- Continue refining documentation as the project evolves
- Consider implementing caching for markdown processing to improve performance
- **Complete Netlify Edge Function setup:**
    - Enable MongoDB Data API in Atlas (manual).
    - Add required environment variables to Netlify site settings (manual).
    - Test Edge Function locally using `netlify dev`.
    - Integrate Edge Function calls into Next.js API routes if needed.
    - Deploy and validate Edge Function in production.

## Active Decisions and Considerations
- Centralizing brand assets in the `images` directory for easier management
- Ensuring all documentation and code references are consistent with the NFS Big5 brand
- Using a custom markdown processing solution instead of contentlayer for better compatibility with Next.js 14
- **Using Netlify Edge Functions with MongoDB Data API for low-latency database access in production.**

## Important Patterns and Preferences
- Use of configuration files and public assets for customization
- Modular monorepo structure for maintainability
- Emphasis on privacy, security, and user experience

## Learnings and Project Insights
- Consistent branding and asset management streamline future updates and deployments
- Clear documentation supports onboarding and customization for new brands
- Custom solutions for content processing provide more flexibility and fewer dependency conflicts