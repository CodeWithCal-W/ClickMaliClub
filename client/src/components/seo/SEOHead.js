import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "ClickMaliClub - Ultimate Affiliate Marketing Hub",
  description = "Discover the best affiliate deals, offers, and opportunities in forex, crypto, betting, SaaS, and more. Your trusted partner for high-converting affiliate marketing campaigns.",
  keywords = "affiliate marketing, forex deals, crypto offers, betting bonuses, SaaS discounts, online deals, affiliate programs, marketing opportunities, commission based marketing, performance marketing",
  image = "/logo512.png",
  url,
  type = "website",
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  noIndex = false,
  canonicalUrl,
  schema
}) => {
  const fullTitle = title.includes('ClickMaliClub') ? title : `${title} | ClickMaliClub`;
  const currentUrl = url || canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const imageUrl = image.startsWith('http') ? image : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ClickMaliClub",
    "description": description,
    "url": currentUrl,
    "logo": {
      "@type": "ImageObject",
      "url": imageUrl
    },
    "sameAs": [
      "https://facebook.com/clickmaliclub",
      "https://twitter.com/clickmaliclub",
      "https://instagram.com/clickmaliclub",
      "https://linkedin.com/company/clickmaliclub"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${typeof window !== 'undefined' ? window.location.origin : ''}/deals?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ClickMaliClub",
      "logo": {
        "@type": "ImageObject",
        "url": imageUrl
      }
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ClickMaliClub Team" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="bingbot" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ClickMaliClub" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@ClickMaliClub" />
      <meta name="twitter:creator" content="@ClickMaliClub" />

      {/* Article Meta (for blog posts) */}
      {articleAuthor && <meta property="article:author" content={articleAuthor} />}
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
      {type === 'article' && <meta property="article:section" content="Affiliate Marketing" />}

      {/* Additional SEO Meta */}
      <meta name="publisher" content="ClickMaliClub" />
      <meta name="copyright" content="© 2025 ClickMaliClub. All rights reserved." />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#36b37e" />
      
      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultStructuredData)}
      </script>

      {/* Google AdSense */}
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
      ></script>
    </Helmet>
  );
};

export default SEOHead;
