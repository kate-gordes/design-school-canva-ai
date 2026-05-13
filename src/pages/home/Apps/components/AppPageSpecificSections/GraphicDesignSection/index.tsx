import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function GraphicDesignSection(): React.ReactNode {
  const graphicDesignAppsData: AppSectionData[] = [
    {
      title: 'FontFrame',
      description: 'Create vibrant text with image backgrounds',
      thumbnail: '',
      onClick: () => console.log('FontFrame clicked'),
    },
    {
      title: 'Choppy Crop',
      description: 'Crop your images in custom shapes',
      thumbnail: '',
      onClick: () => console.log('Choppy Crop clicked'),
    },
    {
      title: 'TypeCutOut',
      description: 'Transform your text with background images',
      thumbnail: '',
      onClick: () => console.log('TypeCutOut clicked'),
    },
    {
      title: 'TypeGradient',
      description: 'Add gradients to texts',
      thumbnail: '',
      onClick: () => console.log('TypeGradient clicked'),
    },
  ];

  return (
    <AppSection
      title="Graphic design"
      apps={graphicDesignAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all graphic design apps')}
      limitApps={true}
    />
  );
}
