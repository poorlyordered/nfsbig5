import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/markdown'; // Updated import
// import MdxContent from '@/components/mdx-content'; // Removed non-existent component import
// ... other imports ...

// ADD THIS FUNCTION:
// Function to generate static paths for the English locale
export async function generateStaticParams() {
  // Define the 'rest' segments for the paths you want to statically generate under /en/
  // IMPORTANT: Replace these examples with your actual expected paths.
  // - Use an empty array `[]` if this route handles the root /en path itself.
  // - Add arrays like `['about']` for /en/about, `['docs', 'intro']` for /en/docs/intro, etc.
  const pathsToGenerate = [
     [] // Example: Generates the root path /en
    // ['about'],         // Example: Generates /en/about
    // ['contact'],       // Example: Generates /en/contact
    // Add more arrays for other static paths handled by this route...
  ];

  // Generate parameters only for the 'en' locale and each defined path
  return pathsToGenerate.map((rest) => ({
    locale: 'en',
    rest: rest.length > 0 ? rest : undefined, // Pass undefined for the root path case []
  }));
}


// The Page component itself (ensure it handles locale and rest correctly)
export default async function Page({ params }: { params: { locale: string; rest?: string[] } }) {
  // Basic validation for English locale
  if (params.locale !== 'en') {
     notFound();
  }

  // Determine the content slug from the 'rest' parameter
  // If 'rest' is undefined or empty, it might correspond to the root '/en' page
  const slug = params.rest?.join('/') || 'index'; // Adjust 'index' if your root slug is different

  try {
    // Fetch content based on the determined slug (locale 'en' is implicit)
    const pageData = await getPostBySlug(slug); // Use getPostBySlug

    if (!pageData) {
      notFound();
    }

    // Render the page content
    return (
      <article>
        <h1>{pageData.title}</h1>
        {/* Render the pre-processed HTML directly */}
        <div dangerouslySetInnerHTML={{ __html: pageData.body.html }} />
      </article>
    );
  } catch (error) {
    console.error(`Error fetching page data for /${params.locale}/${slug}:`, error);
    notFound(); // Show not found for errors or missing pages
  }
}

// ... rest of the file ...