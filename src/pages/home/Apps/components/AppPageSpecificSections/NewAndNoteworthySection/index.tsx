import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function NewAndNoteworthySection(): React.ReactNode {
  const newAndNoteworthyAppsData: AppSectionData[] = [
    {
      title: 'Colorize Image',
      description: 'Add color to black and white images',
      thumbnail: '',
      onClick: () => console.log('Colorize Image clicked'),
    },
    {
      title: 'Mosaicify',
      description: 'Turn your photos into beautiful mosaics with Mosai',
      thumbnail: '',
      onClick: () => console.log('Mosaicify clicked'),
    },
    {
      title: 'Image Recolor',
      description: 'Easily recolor images with a color palette',
      thumbnail: '',
      onClick: () => console.log('Image Recolor clicked'),
    },
    {
      title: 'ChibiArtist',
      description: 'Create cute chibi-style artwork',
      thumbnail: '',
      onClick: () => console.log('ChibiArtist clicked'),
    },
    {
      title: 'LowPolyGen',
      description: 'Create stylish low poly artwork',
      thumbnail: '',
      onClick: () => console.log('LowPolyGen clicked'),
    },
    {
      title: 'Watercolorizer',
      description: 'Turn photos into watercolor-style images',
      thumbnail: '',
      onClick: () => console.log('Watercolorizer clicked'),
    },
    {
      title: 'MathPlot',
      description: 'Add math graphs in your designs',
      thumbnail: '',
      onClick: () => console.log('MathPlot clicked'),
    },
    {
      title: 'Leaf and Flowers',
      description: 'Natural elements for soft, floral designs',
      thumbnail: '',
      onClick: () => console.log('Leaf and Flowers clicked'),
    },
    {
      title: 'Get Palette',
      description: 'Generate palette from images',
      thumbnail: '',
      onClick: () => console.log('Get Palette clicked'),
    },
  ];

  return (
    <AppSection
      title="New and noteworthy"
      subtitle="Catch up on the newest and hottest releases"
      apps={newAndNoteworthyAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all new and noteworthy apps')}
    />
  );
}
