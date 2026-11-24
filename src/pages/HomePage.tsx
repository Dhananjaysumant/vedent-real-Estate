import { Hero } from '../components/home/Hero';
import { BrandIntro } from '../components/home/BrandIntro';
import { FeaturedResidences } from '../components/home/FeaturedResidences';
import { ScrollStory } from '../components/home/ScrollStory';
import { ExplorerInvite } from '../components/home/ExplorerInvite';
import { Philosophy } from '../components/home/Philosophy';
import { ExperienceValues } from '../components/home/ExperienceValues';
import { ViewingCta } from '../components/home/ViewingCta';
import { usePageMeta } from '../hooks/usePageMeta';
import { properties } from '../data/properties';
import { SITE } from '../lib/site';

export function HomePage() {
  usePageMeta({
    title: 'The Art of Living',
    description:
      'Vanguard Estates creates exceptional luxury residences in extraordinary landscapes. Explore three demonstration residences, an interactive 3D villa and a private viewing experience.',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          inLanguage: 'en',
        },
        {
          '@type': 'Organization',
          name: SITE.name,
          url: SITE.url,
          slogan: SITE.tagline,
          description:
            'A fictional luxury residential development studio presented as an interactive demonstration project.',
        },
        {
          '@type': 'ItemList',
          name: 'Illustrative demonstration residences',
          itemListElement: properties.map((property, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Residence',
              name: property.name,
              description: property.intro,
              address: {
                '@type': 'PostalAddress',
                addressLocality: property.location.city,
                addressRegion: property.location.region,
                addressCountry: property.location.country,
              },
            },
          })),
        },
      ],
    },
  });

  return (
    <>
      <Hero />
      <main id="main-content">
        <BrandIntro />
        <FeaturedResidences />
        <ScrollStory />
        <ExplorerInvite />
        <Philosophy />
        <ExperienceValues />
        <ViewingCta />
      </main>
    </>
  );
}
