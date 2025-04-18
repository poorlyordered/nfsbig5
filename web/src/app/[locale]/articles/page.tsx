// import { compareDesc } from 'date-fns'; // No longer needed for sorting here
// import { allPosts } from 'contentlayer/generated'; // Removed contentlayer import
import { PostCard } from '@/components/post-card';
import { getAllPosts } from '@/lib/markdown'; // Updated import

export default async function ArticlesPage() {
  // Fetch posts using the new utility (already sorted by date)
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8"> {/* Added padding */}
      <h1 className="text-4xl font-bold mb-8 text-center">Articles</h1> {/* Centered title */}
      {posts.length === 0 ? (
        <p className="text-center text-default-500">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {posts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
