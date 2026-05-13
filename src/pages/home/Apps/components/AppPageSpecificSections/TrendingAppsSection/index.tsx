import { CarouselBanner } from '@/pages/Home/Apps/components/Banners';
import type { CarouselBannerCard } from '@/pages/Home/Apps/components/Banners';

import { AppVisualCardMessages as Messages } from './messages/app_visual_card.messages.ts';
import { cdn } from '@/utils/cdn';

const refacePhoto = cdn('apps/trending/reface.png');
const typecutoutPhoto = cdn('apps/trending/typecutout.png');
const imageRecolorPhoto = cdn('apps/trending/imagerecolor.png');
const frameBlurPhoto = cdn('apps/trending/frameblur.png');
const shotdeckPhoto = cdn('apps/trending/shotdeck.png');
const meshGradientPhoto = cdn('apps/trending/meshgradient.png');
const easyReflectionsPhoto = cdn('apps/trending/easy_reflections.png');
const genqrPhoto = cdn('apps/trending/genqr.png');
const shadePhoto = cdn('apps/trending/shade.png');
const filmCameraPhoto = cdn('apps/trending/filmcamera.png');

export default function TrendingAppsSection(): React.ReactNode {
  const trendingAppsData: CarouselBannerCard[] = [
    {
      id: 'AAGkStWX290',
      name: 'Image Recolor',
      cardColor: '#A9EDAE',
      image: imageRecolorPhoto,
      description: Messages.imageRecolorDescription(),
      textColor: 'dark',
      imageAltText: Messages.imageRecolorImageAltText(),
      onClick: () => console.log('Image Recolor clicked'),
    },
    {
      id: 'AAGWQGvPKfo',
      name: 'Reface',
      cardColor: '#FC6567',
      image: refacePhoto,
      description: "Swap faces with Reface's AI photo editing",
      textColor: 'dark',
      imageAltText: 'Reface AI face swapping app',
      onClick: () => console.log('Reface clicked'),
    },
    {
      id: 'AAGB3po4Nwg',
      name: 'TypeCutOut',
      cardColor: '#607BF7',
      image: typecutoutPhoto,
      description: Messages.typecutoutDescription(),
      textColor: 'dark',
      imageAltText: Messages.typecutoutImageAltText(),
      onClick: () => console.log('TypeCutOut clicked'),
    },
    {
      id: 'AAGHb9FZgnQ',
      name: 'Frame Blur',
      cardColor: '#138EFF',
      image: frameBlurPhoto,
      description: Messages.frameBlurDescription(),
      textColor: 'dark',
      imageAltText: Messages.frameBlurImageAltText(),
      onClick: () => console.log('Frame Blur clicked'),
    },
    {
      id: 'AAGQ9ONJxhs',
      name: 'ShotDeck',
      cardColor: '#A571FB',
      image: shotdeckPhoto,
      description: Messages.shotdeckDescription(),
      textColor: 'dark',
      imageAltText: Messages.shotdeckImageAltText(),
      onClick: () => console.log('ShotDeck clicked'),
    },
    {
      id: 'AAF1u9b5fF0',
      name: 'Mesh Gradient',
      cardColor: '#FFD9EF',
      image: meshGradientPhoto,
      description: Messages.meshGradientDescription(),
      textColor: 'dark',
      imageAltText: Messages.meshGradientImageAltText(),
      onClick: () => console.log('Mesh Gradient clicked'),
    },
    {
      id: 'AAF4vKXERBg',
      name: 'Easy Reflections',
      cardColor: '#6BA9FF',
      image: easyReflectionsPhoto,
      description: Messages.easyReflectionsDescription(),
      textColor: 'dark',
      imageAltText: Messages.easyReflectionsImageAltText(),
      onClick: () => console.log('Easy Reflections clicked'),
    },
    {
      id: 'AAGB4-AUqkc',
      name: 'Gen QR',
      cardColor: '#69DDF4',
      image: genqrPhoto,
      description: Messages.genqrDescription(),
      textColor: 'dark',
      imageAltText: Messages.genqrAltText(),
      onClick: () => console.log('Gen QR clicked'),
    },
    {
      id: 'AAFrrz7ML5E',
      name: 'Shade',
      cardColor: '#daf2f4',
      image: shadePhoto,
      description: Messages.shadeDescription(),
      textColor: 'dark',
      imageAltText: Messages.shadeImageAltText(),
      onClick: () => console.log('Shade clicked'),
    },
    {
      id: 'AAGchc3GiPw',
      name: 'Film Camera',
      cardColor: '#FB3332',
      image: filmCameraPhoto,
      description: Messages.filmCameraDescription(),
      textColor: 'dark',
      imageAltText: Messages.filmCameraImageAltText(),
      onClick: () => console.log('Film Camera clicked'),
    },
  ];

  return (
    <CarouselBanner
      title="Trending apps"
      subtitle="The latest and greatest apps we think you'll love"
      cards={trendingAppsData}
      variant="trending"
    />
  );
}
