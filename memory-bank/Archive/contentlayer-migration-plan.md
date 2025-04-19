# Contentlayer Migration Plan

This document outlines a detailed plan to migrate from `next-contentlayer` to a custom solution using `gray-matter`, `remark`, and `rehype`. This will resolve the dependency conflict with Next.js 14 while maintaining all current functionality.

## 1. Project Analysis

### Current Setup
- **Content Source**: Markdown files in `web/posts/` directory
- **Content Type**: Blog posts with frontmatter (title, description, date, author, image)
- **Usage**: Imported as `allPosts` from `contentlayer/generated` in components and pages
- **Integration**: `withContentlayer` wrapper in Next.js config

### Key Components Using Contentlayer
- `PostCard` component
- Article pages (`[slug]/page.tsx`)
- Article listing pages

## 2. Migration Steps

### Step 1: Install Required Dependencies

```bash
npm install --save gray-matter remark remark-html remark-gfm rehype-stringify rehype-raw unified
```

### Step 2: Create Custom Markdown Utilities

Create a new file at `web/src/lib/markdown.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

// Define types to replace contentlayer types
export type Author = {
  name: string;
  link?: string;
  avatar?: string;
  username?: string;
};

export type Post = {
  _id: string;
  _raw: {
    flattenedPath: string;
    sourceFilePath: string;
    sourceFileName: string;
  };
  title: string;
  description: string;
  date: string;
  author?: Author;
  image?: string;
  url: string;
  body: {
    raw: string;
    html: string;
  };
};

// Directory where posts are stored
const postsDirectory = path.join(process.cwd(), 'posts');

// Process markdown content to HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

// Get all post files
export function getPostFiles(): string[] {
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const files = getPostFiles();
  const matchingFile = files.find(file => file.replace(/\.md$/, '') === slug);
  
  if (!matchingFile) return undefined;
  
  return await getPost(matchingFile);
}

// Get a post by filename
export async function getPost(fileName: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const html = await markdownToHtml(content);
  const slug = fileName.replace(/\.md$/, '');
  
  return {
    _id: slug,
    _raw: {
      flattenedPath: slug,
      sourceFilePath: fullPath,
      sourceFileName: fileName
    },
    title: data.title,
    description: data.description,
    date: data.date.toISOString(),
    author: data.author,
    image: data.image,
    url: `/articles/${slug}`,
    body: {
      raw: content,
      html: html
    }
  };
}

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  const files = getPostFiles();
  const posts = await Promise.all(files.map(file => getPost(file)));
  
  // Sort posts by date in descending order
  return posts.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}
```

### Step 3: Update Components and Pages

#### Update PostCard Component (`web/src/components/post-card.tsx`):

```typescript
import { Card, CardFooter, CardBody } from '@nextui-org/card';
import { Avatar } from '@nextui-org/avatar';
import { Image } from '@nextui-org/image';
import { format, parseISO } from 'date-fns';
import { Link } from '@/navigation';
import { calculateReadingTime } from '@/lib/helpers';
import { Post } from '@/lib/markdown'; // Updated import

export function PostCard(post: Post) {
  // Rest of the component remains the same
  // ...
}
```

#### Update Article Page (`web/src/app/[locale]/articles/[slug]/page.tsx`):

```typescript
import { format, parseISO } from 'date-fns';
import { ChevronRightLinearIcon } from '@/components/icons';
import NextLink from 'next/link';
import { User } from '@nextui-org/user';
import { Link } from '@nextui-org/react';
import { Image } from '@nextui-org/image';
import { calculateReadingTime } from '@/lib/helpers';
import { ViewCounter } from '@/components/view-counter';
import { Suspense } from 'react';
import { getAllPosts, getPostBySlug } from '@/lib/markdown'; // Updated imports

// Generate static paths
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ 
    slug: post._raw.flattenedPath 
  }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
}

// Page component
const PostLayout = async ({ params }: { params: { slug: string } }) => {
  const post = await getPostBySlug(params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  
  // Rest of the component remains the same
  // ...
};

export default PostLayout;
```

#### Update Articles Page (`web/src/app/[locale]/articles/page.tsx`):

```typescript
import { compareDesc } from 'date-fns';
import { PostCard } from '@/components/post-card';
import { getAllPosts } from '@/lib/markdown'; // Updated import

export default async function ArticlesPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Update Next.js Config

Remove the contentlayer wrapper from `web/next.config.js`:

```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(nextConfig);
```

### Step 5: Remove Contentlayer Dependencies

1. Delete `web/contentlayer.config.ts`
2. Remove contentlayer from `package.json`:
   ```json
   "dependencies": {
     // Remove these lines:
     "contentlayer": "0.3.4",
     "next-contentlayer": "0.3.4",
   }
   ```
3. Remove contentlayer references from `tsconfig.json`:
   ```json
   "compilerOptions": {
     "paths": {
       // Remove this line:
       "contentlayer/generated": ["./.contentlayer/generated"],
       "@/*": ["./src/*"]
     }
   },
   "include": [
     // Remove this line:
     ".contentlayer/generated"
   ]
   ```
4. Delete the `.contentlayer` directory if it exists

## 3. Testing the Migration

1. Run `npm install` to update dependencies
2. Start the development server with `npm run dev`
3. Verify that:
   - The articles page loads correctly
   - Individual article pages load correctly
   - All content and formatting is preserved

## 4. Benefits of This Approach

- **No Dependency Conflicts**: Removes the dependency on `next-contentlayer` which has compatibility issues with Next.js 14
- **Full Control**: Direct access to the markdown processing pipeline
- **Simplified Build Process**: No additional build step or plugin required
- **Future-Proof**: Uses standard libraries that are actively maintained

## 5. Potential Enhancements

- Add caching for better performance
- Implement incremental static regeneration for content updates
- Add support for MDX if needed
- Implement content search functionality

## 6. Conclusion

This migration plan provides a complete replacement for `next-contentlayer` while maintaining all existing functionality. The custom solution is more flexible, has fewer dependencies, and will be compatible with future Next.js versions.