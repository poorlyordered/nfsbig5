# Netlify Edge Function + MongoDB Atlas Integration Plan (Aligned with NFS Big5 Tech Stack)

## 1. Overview

- **Goal:** Enable secure, low-latency access to MongoDB Atlas from a Next.js 14/15 (App Router, TypeScript) app deployed on Netlify, using Edge Functions for latency-sensitive operations.
- **Tech Stack Alignment:**  
  - Next.js 14/15 (App Router, TypeScript, web/)
  - MongoDB Atlas (cloud-hosted, accessed via Data API for Edge Functions)
  - Environment variables: `DB_URL`, `DB_NAME`, `DB_COLLECTION` (set in Netlify dashboard)
  - All secrets and business logic remain server-side

---

## 2. Architecture Diagram

```mermaid
flowchart TD
    A[User Browser] -- HTTP Request --> B[Netlify Edge Function (TypeScript)]
    B -- Secure DB Query (Data API) --> C[MongoDB Atlas]
    B -- Response --> A
    B -- Optionally --> D[Next.js API Route (Node.js)]
    D -- (for non-latency-critical or legacy logic) --> C
```

---

## 3. Implementation Steps

### A. MongoDB Atlas Setup
- Create a cluster and user in MongoDB Atlas.
- Enable the MongoDB Data API for RESTful access.
- Add the Data API key and connection details to Netlify environment variables:
  - `DB_URL` (if needed), `DB_NAME`, `DB_COLLECTION`, `MONGODB_API_KEY`

### B. Netlify Edge Function Directory Structure
- Place Edge Functions in `netlify/edge-functions/` (outside `web/`).
- Use TypeScript for all Edge Functions.

### C. Edge Function Implementation (TypeScript, Data API)

**Example: `netlify/edge-functions/get-ai-sessions.ts`**
```typescript
export default async function handler(request: Request, context: any) {
  // Example: JWT validation (implement according to your auth pattern)
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  // Parse userId from URL or context
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  if (!userId) return new Response('Missing userId', { status: 400 });

  // Call MongoDB Data API
  const response = await fetch('https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1/action/find', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.MONGODB_API_KEY!,
    },
    body: JSON.stringify({
      collection: process.env.DB_COLLECTION,
      database: process.env.DB_NAME,
      dataSource: 'Cluster0',
      filter: { userId },
    }),
  });

  if (!response.ok) return new Response('DB Error', { status: 500 });
  const data = await response.json();
  return new Response(JSON.stringify(data.documents), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
export const config = { path: '/api/ai/sessions/:userId' };
```

### D. Netlify Configuration

**In `netlify.toml`:**
```toml
[[edge_functions]]
  path = "/api/ai/sessions/*"
  function = "get-ai-sessions"
```

### E. Next.js API Route Integration

- For legacy or non-latency-critical logic, Next.js API routes in `web/src/app/api/` can call the Edge Function via HTTP.
- Example:
```typescript
// web/src/app/api/ai/sessions/[userId]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/.netlify/functions/get-ai-sessions?userId=${params.userId}`, {
    headers: { Authorization: request.headers.get('Authorization') || '' },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
```

### F. Security & Best Practices

- Validate JWTs and all user input in Edge Functions.
- Never expose DB credentials to the client.
- Implement rate limiting and error handling.
- Ensure GDPR compliance (e.g., allow users to delete their data).

### G. Testing

- Use `netlify dev` for local testing of Edge Functions.
- After deployment, test all flows and monitor Netlify logs.

---

## 4. Key Decisions

- **Use MongoDB Data API** for Edge Functions (guaranteed Deno/Edge compatibility).
- **TypeScript everywhere** for type safety and maintainability.
- **Environment variables** for all secrets, managed via Netlify dashboard.
- **Edge Functions for latency-sensitive features**, API routes for others.

---

## 5. Next Steps

1. Enable MongoDB Data API in Atlas.
2. Add all required environment variables to Netlify.
3. Scaffold Edge Function(s) in `netlify/edge-functions/`.
4. Update `netlify.toml` to map routes.
5. Test locally with `netlify dev`.
6. Deploy and validate in production.