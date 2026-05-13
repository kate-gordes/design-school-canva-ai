import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function CommunicationSection(): React.ReactNode {
  const communicationAppsData: AppSectionData[] = [
    {
      title: 'Carousel Studio',
      description: 'Create social media carousels with AI',
      thumbnail: '',
      onClick: () => console.log('Carousel Studio clicked'),
    },
    {
      title: 'Instagram',
      description: 'Your Instagram photos, live in Canva',
      thumbnail: '',
      onClick: () => console.log('Instagram clicked'),
    },
    {
      title: 'CreatCards',
      description: 'Create & send invites, track RSVPs for any event',
      thumbnail: '',
      onClick: () => console.log('CreatCards clicked'),
    },
    {
      title: 'Text Path Maker',
      description: 'Create custom text along any path with ease',
      thumbnail: '',
      onClick: () => console.log('Text Path Maker clicked'),
    },
  ];

  return (
    <AppSection
      title="Communication"
      apps={communicationAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all communication apps')}
      limitApps={true}
    />
  );
}
