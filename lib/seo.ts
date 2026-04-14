import { Metadata } from 'next';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  publishedTime?: string;
  authors?: string[];
}

export function constructMetadata({
  title,
  description,
  image = '/og-image.png',
  url = 'https://warlockpublishing.com',
  type = 'website',
  keywords = [],
  publishedTime,
  authors,
}: SeoProps): Metadata {
  const siteTitle = 'Warlock Publishing';
  const fullTitle = `${title} | ${siteTitle}`;

  const baseKeywords = [
    'Warlock Publishing', 
    'Digital Assets', 
    'Writing Tools', 
    'Self-Publishing', 
    'Marketing Assets',
    'Creator Economy'
  ];

  return {
    title: fullTitle,
    description,
    keywords: [...new Set([...baseKeywords, ...keywords])],
    authors: authors?.map(name => ({ name })) || [{ name: 'Warlock Team' }],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteTitle,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@WarlockPub',
    },
    metadataBase: new URL('https://warlockpublishing.com'),
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
