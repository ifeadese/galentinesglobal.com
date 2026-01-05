import React from "react";
import Head from "next/head";
import { Event } from "types";

interface SEOProps {
  event: Event;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  event,
  title,
  description,
  image,
  url,
  type = "website",
  noindex = false,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://galentinesglobal.com";
  const siteName = event.name;
  const siteDescription = description || event.description;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageImage = image || event.logo || "/images/galentines-gradient-logo.svg";
  const absoluteImageUrl = pageImage.startsWith("http") 
    ? pageImage 
    : `${baseUrl}${pageImage}`;
  
  // Only set canonical/og:url if URL is explicitly provided to avoid hydration mismatches
  // If no URL is provided, we'll skip these tags rather than using window.location.href
  const absoluteUrl = url 
    ? (url.startsWith("http") ? url : `${baseUrl}${url}`)
    : null;

  // Structured Data - Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "description": event.description,
    "url": baseUrl,
    ...(event.logo && {
      "logo": `${baseUrl}${event.logo}`,
    }),
    ...(event.contactEmailAddress && {
      "email": event.contactEmailAddress,
    }),
    ...(event.facebookPageUrl && {
      "sameAs": [
        event.facebookPageUrl,
        ...(event.instagramPageUrl ? [event.instagramPageUrl] : []),
      ],
    }),
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={siteDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {absoluteUrl && <link rel="canonical" href={absoluteUrl} />}

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      {absoluteUrl && <meta property="og:url" content={absoluteUrl} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </Head>
  );
};

export default SEO;

