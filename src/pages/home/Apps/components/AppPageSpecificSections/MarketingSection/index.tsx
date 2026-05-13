import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function MarketingSection(): React.ReactNode {
  const marketingAppsData: AppSectionData[] = [
    {
      title: 'Google Drive',
      description: 'Add media from Google Drive to your designs',
      thumbnail: '',
      onClick: () => console.log('Google Drive clicked'),
    },
    {
      title: 'Gen QR',
      description: 'Design vibrant QR codes',
      thumbnail: '',
      onClick: () => console.log('Gen QR clicked'),
    },
    {
      title: 'Brandfetch Logo',
      description: 'Brand logos at your fingertips',
      thumbnail: '',
      onClick: () => console.log('Brandfetch Logo clicked'),
    },
    {
      title: 'QR Code with Logo',
      description: 'Create QR codes with your own logo and colors',
      thumbnail: '',
      onClick: () => console.log('QR Code with Logo clicked'),
    },
  ];

  return (
    <AppSection
      title="Marketing"
      apps={marketingAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all marketing apps')}
      limitApps={true}
    />
  );
}
