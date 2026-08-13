import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOWrapperProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SEOWrapper: React.FC<SEOWrapperProps> = ({
  title = "Kiremon - Pokemon Web Game",
  description = "Ứng dụng web game Pokemon fullstack với .NET 8, React 19, SignalR. Khám phá, bắt và huấn luyện Pokemon!",
  image = "/images/home.png", // Assume there's a default image
  url = "https://kiremon.vercel.app", // The production URL
  type = "website",
  jsonLd,
}) => {
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) for AIO/GEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Helmet>
  );
};

export default SEOWrapper;
