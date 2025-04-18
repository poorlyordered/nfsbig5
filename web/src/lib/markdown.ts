import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

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
  date: string; // Keep as string for consistency with original data
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

// Process markdown content to HTML using remark-html
export async function markdownToHtml(markdown: string): Promise<string> {
  // Use remark() which already includes the parser
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false }) // sanitize: false allows raw HTML
    .process(markdown);

  return result.toString();
}

// Get all post files
export function getPostFiles(): string[] {
  // Check if postsDirectory exists before reading
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`);
    return [];
  }
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

  // Ensure date is handled correctly (it might be a Date object from gray-matter)
  const dateString = data.date instanceof Date ? data.date.toISOString() : data.date;

  return {
    _id: slug,
    _raw: {
      flattenedPath: slug,
      sourceFilePath: fullPath,
      sourceFileName: fileName
    },
    title: data.title,
    description: data.description,
    date: dateString,
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
  if (files.length === 0) {
    return []; // Return empty array if no files found
  }
  const posts = await Promise.all(files.map(file => getPost(file)));

  // Sort posts by date in descending order
  return posts.sort((a, b) => {
    // Ensure dates are valid before comparing
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return 0; // Handle invalid dates if necessary
    }
    return dateB.getTime() - dateA.getTime();
  });
}