import React from 'react';
import SEOHead from '../seo/SEOHead';
import { generateCollectionPageSchema, generateOfferSchema } from '../seo/structuredData';

const SEODealsPage = ({ deals, category, children }) => {
  const categoryName = category?.name || 'All Categories';
  const title = `${categoryName} Deals & Offers | ClickMaliClub`;
  const description = `Discover the best ${categoryName.toLowerCase()} affiliate deals and offers. Save money with verified coupons, discounts, and exclusive promotions.`;
  const keywords = `${categoryName.toLowerCase()} deals, ${categoryName.toLowerCase()} offers, affiliate marketing, discounts, coupons, savings, ClickMaliClub`;

  // Generate structured data for deals collection
  const dealsItems = deals?.map(deal => ({
    name: deal.title,
    url: deal.affiliateLink || '#'
  })) || [];

  const collectionSchema = generateCollectionPageSchema({
    name: `${categoryName} Deals`,
    description: description,
    url: category ? `/categories/${category.slug}` : '/deals',
    items: dealsItems
  });

  // Generate offer schemas for individual deals
  const offerSchemas = deals?.slice(0, 5).map(deal => generateOfferSchema({
    name: deal.title,
    description: deal.description,
    url: deal.affiliateLink,
    imageUrl: deal.image || '/logo512.png',
    category: deal.category?.name || categoryName,
    validFrom: deal.createdAt,
    validThrough: deal.expiryDate,
    price: "0", // Free deals
    currency: "USD"
  })) || [];

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [collectionSchema, ...offerSchemas]
  };

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
        canonicalUrl={category ? `/categories/${category.slug}` : '/deals'}
        image={category?.image || '/logo512.png'}
        schema={combinedSchema}
      />
      {children}
    </>
  );
};

export default SEODealsPage;
