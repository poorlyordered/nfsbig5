import { URL } from 'url'; // Import URL for parsing

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
      dataSource: 'Cluster0', // Replace with your Atlas cluster name if different
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