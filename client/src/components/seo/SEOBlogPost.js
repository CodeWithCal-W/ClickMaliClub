import React from 'react';
import SEOHead from '../seo/SEOHead';
import { generateArticleSchema, generateBreadcrumbSchema } from '../seo/structuredData';

const SEOBlogPost = ({ post, children }) => {
  if (!post) return children;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || post.description,
    url: `/blog/${post.slug}`,
    imageUrl: post.featuredImage || '/logo512.png',
    author: post.author || 'ClickMaliClub Team',
    publishedDate: post.publishedAt || post.createdAt,
    modifiedDate: post.updatedAt,
    category: post.category || 'Affiliate Marketing'
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema]
  };

  const seoTitle = post.seoTitle || `${post.title} | ClickMaliClub`;
  const seoDescription = post.seoDescription || post.excerpt || post.description;
  const seoKeywords = post.seoKeywords || `${post.title}, affiliate marketing, deals, offers, ClickMaliClub`;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="article"
        image={post.featuredImage || '/logo512.png'}
        canonicalUrl={`/blog/${post.slug}`}
        articleAuthor={post.author || 'ClickMaliClub Team'}
        articlePublishedTime={post.publishedAt || post.createdAt}
        articleModifiedTime={post.updatedAt}
        schema={combinedSchema}
      />
      {children}
    </>
  );
};

export default SEOBlogPost;
