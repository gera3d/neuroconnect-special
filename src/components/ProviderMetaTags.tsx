import { useEffect } from 'react';
import { GooglePlace } from '@/lib/types';

interface ProviderMetaTagsProps {
  provider: GooglePlace;
  photoUrl: string;
}

export function ProviderMetaTags({ provider, photoUrl }: ProviderMetaTagsProps) {
  useEffect(() => {
    const title = `${provider.name} - Autism & ADHD Care Specialist`;
    const description = `Expert neurodivergent care at ${provider.name}. Autism-affirming, sensory-friendly support for families. Rated ${provider.rating || '4.8'}/5 by ${provider.user_ratings_total || 'many'} families.`;
    const url = window.location.href;

    // Set primary meta tags
    document.title = title;
    
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Description
    setMetaTag('description', description);
    
    // Open Graph
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', photoUrl, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', url);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', photoUrl);

    // Additional SEO
    setMetaTag('robots', 'index, follow, max-image-preview:large');
    setMetaTag('author', provider.name);

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

  }, [provider, photoUrl]);

  return null;
}
