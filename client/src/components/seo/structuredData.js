// Schema.org structured data generators for different content types

export const generateWebSiteSchema = (url, searchUrl) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ClickMaliClub",
  "url": url,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${searchUrl}?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

export const generateOrganizationSchema = (url, logoUrl) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ClickMaliClub",
  "url": url,
  "logo": logoUrl,
  "description": "Ultimate affiliate marketing hub for deals and opportunities",
  "sameAs": [
    "https://facebook.com/clickmaliclub",
    "https://twitter.com/clickmaliclub",
    "https://instagram.com/clickmaliclub",
    "https://linkedin.com/company/clickmaliclub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
});

export const generateArticleSchema = ({
  title,
  description,
  url,
  imageUrl,
  author,
  publishedDate,
  modifiedDate,
  category = "Affiliate Marketing"
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": imageUrl,
  "url": url,
  "datePublished": publishedDate,
  "dateModified": modifiedDate || publishedDate,
  "author": {
    "@type": "Person",
    "name": author || "ClickMaliClub Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ClickMaliClub",
    "logo": {
      "@type": "ImageObject",
      "url": imageUrl
    }
  },
  "articleSection": category,
  "inLanguage": "en-US"
});

export const generateOfferSchema = ({
  name,
  description,
  url,
  imageUrl,
  category,
  validFrom,
  validThrough,
  price,
  currency = "USD"
}) => ({
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": name,
  "description": description,
  "url": url,
  "image": imageUrl,
  "category": category,
  "validFrom": validFrom,
  "validThrough": validThrough,
  "price": price || "0",
  "priceCurrency": currency,
  "availability": "https://schema.org/InStock",
  "seller": {
    "@type": "Organization",
    "name": "ClickMaliClub"
  }
});

export const generateProductSchema = ({
  name,
  description,
  imageUrl,
  brand,
  category,
  offers
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "image": imageUrl,
  "brand": {
    "@type": "Brand",
    "name": brand || "ClickMaliClub"
  },
  "category": category,
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    ...offers
  }
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateCollectionPageSchema = ({
  name,
  description,
  url,
  items
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": name,
  "description": description,
  "url": url,
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": item.url,
      "name": item.name
    }))
  }
});

export const generateReviewSchema = ({
  itemName,
  reviewBody,
  rating,
  author,
  datePublished
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Thing",
    "name": itemName
  },
  "reviewBody": reviewBody,
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": rating,
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": author
  },
  "datePublished": datePublished
});
