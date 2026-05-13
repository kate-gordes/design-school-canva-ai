import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const color: AppSectionData[] = [
  { title: 'TypeGradient', description: 'Generate gradient text effects', thumbnail: '' },
  {
    title: 'Gradients',
    description: 'Add colorful gradient backgrounds to your designs',
    thumbnail: '',
  },
  { title: 'ColorMix', description: 'Create custom color palettes instantly', thumbnail: '' },
  {
    title: 'Gradient Generator',
    description: 'Generate beautiful gradients for any design',
    thumbnail: '',
  },
  { title: 'Image Colorizer', description: 'Recolor images with a single click', thumbnail: '' },
  {
    title: 'Color Harmony',
    description: 'Find perfectly matched color combinations',
    thumbnail: '',
  },
  {
    title: 'Mesh Gradient',
    description: 'Create organic mesh gradient backgrounds',
    thumbnail: '',
  },
  { title: 'Image Recolor', description: 'Change image colors with AI', thumbnail: '' },
  { title: 'Shade', description: 'Generate shades and tints of any color', thumbnail: '' },
  { title: 'Colorize Image', description: 'Add color to black and white photos', thumbnail: '' },
  { title: 'BGradient', description: 'Beautiful gradient backgrounds generator', thumbnail: '' },
  { title: 'Get Palette', description: 'Extract color palettes from any image', thumbnail: '' },
  { title: 'Recolor', description: 'Change colors of any element easily', thumbnail: '' },
  { title: 'Blobs', description: 'Generate organic blob shapes in any color', thumbnail: '' },
  { title: 'SVG Recolor', description: 'Recolor SVGs with custom palettes', thumbnail: '' },
  { title: 'Inkko', description: 'Design with beautiful color palettes', thumbnail: '' },
  { title: 'Palette and Tints', description: 'Create harmonious palette and tints', thumbnail: '' },
];

const dataVisualization: AppSectionData[] = [
  {
    title: 'Google Maps',
    description: 'Seamlessly add Google maps to your Canva designs',
    thumbnail: '',
  },
  {
    title: 'Flourish',
    description: 'Add Flourish charts, maps, and interactive content',
    thumbnail: '',
  },
  {
    title: 'AI Chart Maker',
    description: 'Instantly generate charts easily from text with AI',
    thumbnail: '',
  },
  {
    title: 'AI Diagram Maker',
    description: 'Generate different styles of diagrams with AI',
    thumbnail: '',
  },
  { title: 'Chart Plus', description: 'Create stunning charts and visualizations', thumbnail: '' },
  { title: 'Scoop', description: 'Sync live data into Canva with Scoop', thumbnail: '' },
  { title: 'Pictogram Maker', description: 'Turn images into pictorial charts', thumbnail: '' },
  { title: 'PrimoStats', description: 'Add marketing stats to your designs', thumbnail: '' },
  {
    title: 'Visual Morse Code',
    description: 'Turn text into visual Morse code art',
    thumbnail: '',
  },
  {
    title: 'Nomnoml Diagrams',
    description: 'Convert nomnoml syntax to SVG diagrams',
    thumbnail: '',
  },
  {
    title: 'Mermaid Diagram',
    description: 'Transform Mermaid code into clear diagrams',
    thumbnail: '',
  },
];

const documents: AppSectionData[] = [
  { title: 'Pitch', description: 'Collaborative presentations for teams', thumbnail: '' },
  {
    title: 'Magic Docs',
    description: 'Instantly generate docs from a short prompt',
    thumbnail: '',
  },
  {
    title: 'Resume Builder',
    description: 'Draft a resume tailored to your next role',
    thumbnail: '',
  },
  {
    title: 'Worksheet Generator',
    description: 'Create printable worksheets from a topic',
    thumbnail: '',
  },
  { title: 'AI Lesson Plan', description: 'Draft full lesson plans in seconds', thumbnail: '' },
  {
    title: 'AI Book Builder',
    description: 'Turn outlines into formatted books with AI',
    thumbnail: '',
  },
  { title: 'Proposal AI', description: 'Auto-draft proposals and pitch decks', thumbnail: '' },
  { title: 'AI Report Writer', description: 'Draft reports from raw notes or data', thumbnail: '' },
];

export default function GraphicDesignPage(): React.ReactNode {
  return (
    <>
      <Box className={styles.bannerWrapper}>
        <HeroBanner
          badgeText="Featured"
          title="Let your designs drive sales"
          subtitle="Add payment links or QR codes and make it easy for your customers to shop."
          buttonText="Try PayPal"
          onButtonClick={() => {}}
          textColor="dark"
          backgroundColor="#66C4F2"
        />
      </Box>
      <Box className={styles.toolsContent}>
        <AppsSearchCategoryPillsSection />
        <Box paddingTop="4u">
          <Rows spacing="4u">
            <Rows spacing="1u">
              <Title size="large">Graphic design</Title>
              <Text size="medium" tone="secondary">
                Stand out with beautiful layouts, colors, icons, and illustrations.
              </Text>
            </Rows>
            <CategoryAppSection title="Color" apps={color} />
            <CategoryAppSection title="Data visualization" apps={dataVisualization} />
            <CategoryAppSection title="Documents" apps={documents} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
