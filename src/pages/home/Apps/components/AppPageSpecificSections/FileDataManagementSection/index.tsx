import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function FileDataManagementSection(): React.ReactNode {
  const fileDataAppsData: AppSectionData[] = [
    {
      title: 'Google Drive',
      description: 'Add media from Google Drive to your designs',
      thumbnail: '',
      onClick: () => console.log('Google Drive clicked'),
    },
    {
      title: 'Google Photos',
      description: 'Add media from Google Photos to your designs',
      thumbnail: '',
      onClick: () => console.log('Google Photos clicked'),
    },
    {
      title: 'Shopify Connect',
      description: 'Add your Shopify products and files to any design',
      thumbnail: '',
      onClick: () => console.log('Shopify Connect clicked'),
    },
    {
      title: 'Google Maps',
      description: 'Seamlessly add Google maps to your Canva designs',
      thumbnail: '',
      onClick: () => console.log('Google Maps clicked'),
    },
  ];

  return (
    <AppSection
      title="File and data management"
      apps={fileDataAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all file and data management apps')}
      limitApps={true}
    />
  );
}
