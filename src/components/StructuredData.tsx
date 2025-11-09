import { GooglePlace } from '@/lib/types';

interface StructuredDataProps {
  provider: GooglePlace;
  pageUrl: string;
}

export function StructuredData({ provider, pageUrl }: StructuredDataProps) {
  // Parse location from vicinity
  const locationParts = provider.vicinity?.split(',') || [];
  const streetAddress = locationParts[0]?.trim() || '';
  const cityState = locationParts.slice(1).join(',').trim() || '';
  
  // Extract city and state (rough approximation)
  const cityStateParts = cityState.split(' ');
  const addressRegion = cityStateParts[cityStateParts.length - 1] || '';
  const addressLocality = cityStateParts.slice(0, -1).join(' ') || cityState;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // LocalBusiness/HealthAndBeautyBusiness
      {
        "@type": "HealthAndBeautyBusiness",
        "@id": `${pageUrl}#organization`,
        "name": provider.name,
        "url": pageUrl,
        "telephone": provider.formatted_phone_number,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": streetAddress,
          "addressLocality": addressLocality,
          "addressRegion": addressRegion,
          "addressCountry": "US"
        },
        "geo": provider.geometry?.location ? {
          "@type": "GeoCoordinates",
          "latitude": provider.geometry.location.lat,
          "longitude": provider.geometry.location.lng
        } : undefined,
        "openingHoursSpecification": provider.opening_hours?.weekday_text?.map((dayText) => {
          // Parse "Monday: 9:00 AM – 5:00 PM" format
          const [dayPart, hoursPart] = dayText.split(': ');
          const dayName = dayPart.trim();
          
          if (!hoursPart || hoursPart.toLowerCase().includes('closed')) {
            return null;
          }

          const [opens, closes] = hoursPart.split('–').map(t => t.trim());
          
          return {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": dayName,
            "opens": opens,
            "closes": closes
          };
        }).filter(Boolean),
        "aggregateRating": provider.rating ? {
          "@type": "AggregateRating",
          "ratingValue": provider.rating,
          "reviewCount": provider.user_ratings_total,
          "bestRating": "5",
          "worstRating": "1"
        } : undefined,
        "priceRange": "$$",
        "image": provider.photos && provider.photos.length > 0 
          ? provider.photos[0].getUrl({ maxWidth: 1200 }) 
          : undefined
      },

      // WebPage
      {
        "@type": "WebPage",
        "@id": pageUrl,
        "name": `${provider.name} - Neurodivergent Care Specialist`,
        "url": pageUrl,
        "description": `Expert autism, ADHD, and sensory processing support at ${provider.name}. Autism-affirming, family-centered care in ${cityState || 'your area'}.`,
        "mainEntity": {
          "@id": `${pageUrl}#organization`
        }
      },

      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Providers",
            "item": `${window.location.origin}/directory`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": provider.name
          }
        ]
      },

      // Service
      {
        "@type": "Service",
        "name": "Neurodivergent Care Services",
        "provider": { "@id": `${pageUrl}#organization` },
        "areaServed": {
          "@type": "Place",
          "name": cityState || "Local Area"
        },
        "serviceType": ["Autism Support", "ADHD Care", "Sensory Processing Support"],
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
