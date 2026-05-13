import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function AudioVoiceoverSection(): React.ReactNode {
  const audioVoiceoverAppsData: AppSectionData[] = [
    {
      title: 'AI Music',
      description: 'Custom music for your designs',
      thumbnail: '',
      onClick: () => console.log('AI Music clicked'),
    },
    {
      title: 'Voice AI',
      description: 'Generate studio-quality voices with AI',
      thumbnail: '',
      onClick: () => console.log('Voice AI clicked'),
    },
    {
      title: 'AI Music Generator',
      description: 'Create AI-generated music for your projects',
      thumbnail: '',
      onClick: () => console.log('AI Music Generator clicked'),
    },
    {
      title: 'Voice Studio',
      description: 'Generate high-quality voiceovers with AI',
      thumbnail: '',
      onClick: () => console.log('Voice Studio clicked'),
    },
  ];

  return (
    <AppSection
      title="Audio and voiceover"
      apps={audioVoiceoverAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all audio and voiceover apps')}
      limitApps={true}
    />
  );
}
