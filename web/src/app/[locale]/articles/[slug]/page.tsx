import { format, parseISO } from 'date-fns';
// import { allPosts } from 'contentlayer/generated'; // Removed contentlayer import
import { ChevronRightLinearIcon } from '@/components/icons';
import NextLink from 'next/link';
import { User } from '@nextui-org/user';
import { Link } from '@nextui-org/react';
import { Image } from '@nextui-org/image';
import { calculateReadingTime } from '@/lib/helpers';
import { ViewCounter } from '@/components/view-counter';
import { Suspense } from 'react';
import { getAllPosts, getPostBySlug } from '@/lib/markdown'; // Updated imports

// Generate static paths using the new utility
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post._raw.flattenedPath
  }));
}

// Generate metadata using the new utility
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  // Optionally add more metadata like description, open graph image etc.
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

// Page component using the new utility
const PostLayout = async ({ params }: { params: { slug: string } }) => {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    // Consider rendering a proper 404 page here
    return <div>Post not found</div>;
  }

  return (
    <article className='w-full flex flex-col justify-start items-center prose prose-neutral dark:prose-invert max-w-none'> {/* Added dark mode and max-w-none */}
      <div className='w-full max-w-4xl px-4'> {/* Added padding */}
        <div className='flex items-center mb-4'> {/* Adjusted layout */}
          <Link
            isBlock
            as={NextLink}
            className='text-default-500 hover:text-default-900 mr-auto' // Use mr-auto for alignment
            color='foreground'
            href='/articles'
            size='md'
          >
            <ChevronRightLinearIcon
              className='rotate-180 inline-block mr-1'
              size={15}
            />
            Back to articles
          </Link>
          {post.author && ( // Check if author exists
            <User
              // href={post.author?.link} // Link component might be better here if needed
              name={post.author.name}
              description={post.author.username}
              avatarProps={{
                src: post.author.avatar || '/avatars/default.png' // Fallback avatar
              }}
            />
          )}
        </div>
        {post.image && (
          <div className='relative w-full mb-6'> {/* Added margin */}
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={600}
              className='mb-4 w-full object-cover rounded-lg' // Added rounded corners
            />
            <div className='absolute inset-0 flex items-end p-4 md:p-8'> {/* Adjusted positioning */}
              <div className='bg-foreground/80 backdrop-blur-sm px-4 py-2 z-10 h-fit rounded'> {/* Added backdrop blur */}
                <h1 className='lg:text-5xl md:text-4xl text-2xl font-bold z-20 text-background'> {/* Adjusted text size */}
                  {post.title}
                </h1>
              </div>
            </div>
          </div>
        )}
        <div className='flex justify-between text-sm mb-4 text-default-500 w-full'> {/* Adjusted text size and margin */}
          <p>{calculateReadingTime(post.body.raw)} min read</p>
          <Suspense fallback={<div>Loading views...</div>}> {/* Added fallback */}
            <ViewCounter postId={post._id} />
          </Suspense>
          <time dateTime={post.date}>
            {format(parseISO(post.date), 'LLLL d, yyyy')}
          </time>
        </div>
        {/* Apply prose styles directly if needed, or use a dedicated container */}
        <div
          className='prose prose-neutral dark:prose-invert max-w-none articlePage' // Ensure prose styles apply
          dangerouslySetInnerHTML={{ __html: post.body.html }}
        />
      </div>
    </article>
  );
};

export default PostLayout;
