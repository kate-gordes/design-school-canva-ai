import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const images: AppSectionData[] = [
  { title: 'Reface', description: 'AI-powered face swap app for unique portraits', thumbnail: '' },
  { title: 'ProfilePhoto', description: 'Create AI profile photos', thumbnail: '' },
  { title: 'AI Image Gen', description: 'Generate images from text prompts', thumbnail: '' },
  { title: 'Mojo AI', description: 'Create AI-generated imagery', thumbnail: '' },
  { title: 'Image Eraser', description: 'Remove unwanted elements from images', thumbnail: '' },
  {
    title: 'AI Headshot Maker',
    description: 'Generate professional headshots with AI',
    thumbnail: '',
  },
  { title: 'AI Image Enhancer', description: 'Upscale and sharpen images with AI', thumbnail: '' },
  {
    title: 'ShotDeck',
    description: 'Find film stills and references for your designs',
    thumbnail: '',
  },
  { title: 'AI Image Extender', description: 'Extend images with AI outpainting', thumbnail: '' },
  { title: 'Image Expander', description: 'Seamlessly expand images to any size', thumbnail: '' },
  { title: 'Country Flags', description: 'Add country flags to your designs', thumbnail: '' },
  { title: 'AI Image Labs', description: 'Advanced AI image editing tools', thumbnail: '' },
  { title: 'Image Studio', description: 'Edit and enhance images in Canva', thumbnail: '' },
  { title: 'Vector Studio', description: 'Create and edit vector illustrations', thumbnail: '' },
  { title: 'AI Face Swapper', description: 'Swap faces in photos with AI', thumbnail: '' },
  { title: 'Tangra AI', description: 'Creative AI tools for images', thumbnail: '' },
  { title: 'AI Image Editor', description: 'Edit images with AI prompts', thumbnail: '' },
  { title: 'CaricatureMaker', description: 'Turn photos into caricatures', thumbnail: '' },
  { title: 'Image Text Editor', description: 'Edit text inside images', thumbnail: '' },
  { title: 'PosterGenius AI', description: 'Generate posters with AI', thumbnail: '' },
  { title: 'Storybook Pic', description: 'Create storybook illustrations', thumbnail: '' },
  { title: 'KawaiiArt', description: 'Generate kawaii-style art', thumbnail: '' },
  { title: 'Doodles', description: 'Turn photos into doodles', thumbnail: '' },
  { title: 'MughalArt', description: 'Mughal-inspired art generator', thumbnail: '' },
  { title: 'MathPlot', description: 'Plot math functions as images', thumbnail: '' },
  { title: 'Pixel Editor', description: 'Pixel art editor for designs', thumbnail: '' },
  { title: 'Gen Pic', description: 'Generate images from text with AI', thumbnail: '' },
  { title: 'Minimalist', description: 'Create minimalist artwork', thumbnail: '' },
  { title: 'SurrealistDream', description: 'Generate surrealist AI art', thumbnail: '' },
  { title: 'SVG Clip Art', description: 'Add SVG clip art to your designs', thumbnail: '' },
  { title: 'MosaicMaker', description: 'Turn images into photo mosaics', thumbnail: '' },
  { title: 'AI Similar Image', description: 'Find similar images with AI', thumbnail: '' },
  { title: 'AI Photo Enhancer', description: 'Upscale and restore photos with AI', thumbnail: '' },
  { title: 'Image to Canva', description: 'Import external images into Canva', thumbnail: '' },
  { title: 'SVG Parser', description: 'Parse and edit SVG files', thumbnail: '' },
  { title: 'Create a Meme', description: 'Turn any image into a meme', thumbnail: '' },
  { title: 'AI Action Figure', description: 'Turn photos into action figures', thumbnail: '' },
  { title: 'AI Pet Costume', description: 'Dress up your pet with AI', thumbnail: '' },
  { title: 'Line Art Colorizer', description: 'Colorize line art with AI', thumbnail: '' },
  {
    title: 'Countdown Stickers',
    description: 'Add countdown stickers to your designs',
    thumbnail: '',
  },
];

const photoEffects: AppSectionData[] = [
  { title: 'Image Blender', description: 'Blend images together seamlessly', thumbnail: '' },
  { title: 'Image Upscaler', description: 'Upscale images without losing quality', thumbnail: '' },
  { title: 'Pixel Enhancer', description: 'Enhance pixel details with AI', thumbnail: '' },
  { title: 'Image Splitter', description: 'Split images into a grid', thumbnail: '' },
  { title: 'Image Enhancement', description: 'One-click image enhancement', thumbnail: '' },
  { title: 'SpeedPaint', description: 'Turn photos into speed-paint style', thumbnail: '' },
  { title: 'Background Eraser', description: 'Remove backgrounds instantly', thumbnail: '' },
  { title: '3D Maker', description: 'Turn images into 3D scenes', thumbnail: '' },
  { title: 'Background Removit', description: 'Remove image backgrounds with AI', thumbnail: '' },
  { title: 'Image Merge', description: 'Merge multiple images into one', thumbnail: '' },
  {
    title: 'Transform Image',
    description: 'Apply creative transformations to images',
    thumbnail: '',
  },
  { title: 'Easy Reflections', description: 'Add realistic reflections to images', thumbnail: '' },
  { title: 'Text Remover', description: 'Remove text from images with AI', thumbnail: '' },
  { title: 'Background Cleaner', description: 'Clean up messy image backgrounds', thumbnail: '' },
  { title: 'Photo Upscaler', description: 'Upscale photos up to 4x', thumbnail: '' },
  { title: 'Image Enhancer', description: 'Enhance images with one click', thumbnail: '' },
  { title: 'Trippy', description: 'Apply trippy visual effects to photos', thumbnail: '' },
  { title: 'Speed Painter', description: 'Generate speed painting effects', thumbnail: '' },
  { title: 'Skew Image', description: 'Skew images for perspective effects', thumbnail: '' },
  { title: 'Change Background', description: 'Replace image backgrounds easily', thumbnail: '' },
  { title: 'Liquify', description: 'Apply liquify distortion to images', thumbnail: '' },
  { title: 'Photo to Cartoon', description: 'Turn photos into cartoon style', thumbnail: '' },
  { title: 'Replace Background', description: 'Replace any image background', thumbnail: '' },
  { title: 'Restore Old Photos', description: 'Restore and colorize old photos', thumbnail: '' },
  { title: 'Image Transformit', description: 'Transform images with effects', thumbnail: '' },
  { title: 'Faceswap', description: 'Swap faces between photos', thumbnail: '' },
  { title: 'One Color', description: 'Apply single-color effects', thumbnail: '' },
  { title: 'Revive Photo', description: 'Revive and enhance old images', thumbnail: '' },
  { title: 'Image Divider', description: 'Divide images into sections', thumbnail: '' },
  { title: 'Frame Blur', description: 'Add blurred frame effects', thumbnail: '' },
  { title: 'Blur Background', description: 'Blur image backgrounds selectively', thumbnail: '' },
  { title: 'Paintify', description: 'Turn photos into paintings', thumbnail: '' },
  {
    title: 'Product Background',
    description: 'Generate product backgrounds with AI',
    thumbnail: '',
  },
  { title: 'ID Image', description: 'Create passport and ID photos', thumbnail: '' },
  { title: 'AI Motion', description: 'Add motion effects to still images', thumbnail: '' },
  { title: 'Image Mixer', description: 'Blend and mix multiple images', thumbnail: '' },
  { title: 'Warp Brush', description: 'Warp and distort images with a brush', thumbnail: '' },
  { title: 'CanGrid', description: 'Apply grid overlays to images', thumbnail: '' },
  { title: 'Colorize Image', description: 'Add color to black and white photos', thumbnail: '' },
  { title: 'AI Image Editor', description: 'Edit images with AI prompts', thumbnail: '' },
  { title: 'Unblur Image', description: 'Deblur images with AI', thumbnail: '' },
  { title: 'Face Swapper', description: 'Swap faces across photos', thumbnail: '' },
  { title: 'Watercolorizer', description: 'Turn photos into watercolor art', thumbnail: '' },
  { title: 'EmojifyMe', description: 'Turn photos into emoji art', thumbnail: '' },
  { title: 'ID Photo Generator', description: 'Generate compliant ID photos', thumbnail: '' },
  { title: 'Enhancer', description: 'General-purpose image enhancer', thumbnail: '' },
  { title: 'Background Pro', description: 'Professional background editing', thumbnail: '' },
  { title: 'Backgroundless', description: 'Instantly remove backgrounds', thumbnail: '' },
  { title: 'Anime Lineart', description: 'Turn photos into anime lineart', thumbnail: '' },
  { title: '3DPortrait', description: 'Generate 3D portraits from photos', thumbnail: '' },
];

export default function PhotoEditingPage(): React.ReactNode {
  return (
    <>
      <Box className={styles.bannerWrapper}>
        <HeroBanner
          badgeText="Featured"
          title="Master your ads with AI"
          subtitle="Unlock your ad's full potential before it's published. Design with your Amazon assets and get automatic feedback to help you fix any issues."
          buttonText="Try Amazon Ads"
          onButtonClick={() => {}}
          textColor="dark"
          backgroundColor="#FFDAC2"
        />
      </Box>
      <Box className={styles.toolsContent}>
        <AppsSearchCategoryPillsSection />
        <Box paddingTop="4u">
          <Rows spacing="4u">
            <Rows spacing="1u">
              <Title size="large">Photo editing</Title>
              <Text size="medium" tone="secondary">
                Touch-up images with AI, retouch photos, and create stunning visuals in seconds.
              </Text>
            </Rows>
            <CategoryAppSection title="Images" apps={images} />
            <CategoryAppSection title="Photo effects" apps={photoEffects} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
