import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function AIGenerationSection(): React.ReactNode {
  const aiGenerationAppsData: AppSectionData[] = [
    {
      title: 'AI Music',
      description: 'Custom music for your designs',
      thumbnail: '',
      onClick: () => console.log('AI Music clicked'),
    },
    {
      title: 'Gen QR',
      description: 'Design vibrant QR codes',
      thumbnail: '',
      onClick: () => console.log('Gen QR clicked'),
    },
    {
      title: 'Reface',
      description: 'AI-powered face swap app for unique portraits',
      thumbnail: '',
      onClick: () => console.log('Reface clicked'),
    },
    {
      title: 'ProfilePhoto',
      description: 'Create AI-enhanced professional profile photos',
      thumbnail: '',
      onClick: () => console.log('ProfilePhoto clicked'),
    },
  ];

  return (
    <AppSection
      title="AI generation"
      apps={aiGenerationAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all AI generation apps')}
      limitApps={true}
    />
  );
}
