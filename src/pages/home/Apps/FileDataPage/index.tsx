import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const analytics: AppSectionData[] = [
  { title: 'Eye Trace', description: 'Track visual focus in designs with AI', thumbnail: '' },
  {
    title: 'Pinvite',
    description: 'Export designs as online invitations with RSVP',
    thumbnail: '',
  },
  {
    title: 'Image Meta Cleaner',
    description: 'Remove hidden metadata from images for privacy',
    thumbnail: '',
  },
];

const dataConnectors: AppSectionData[] = [
  {
    title: 'HubSpot Data',
    description: 'Bring HubSpot CRM data to your Canva designs',
    thumbnail: '',
  },
  {
    title: 'World Bank',
    description: 'Connect and visualise World Bank data in Canva',
    thumbnail: '',
  },
  {
    title: 'Google Analytics',
    description: 'Bring your web and app performance data to Canva',
    thumbnail: '',
  },
  {
    title: 'Statista Data',
    description: 'Access insights across 150+ industries & countries',
    thumbnail: '',
  },
  {
    title: 'Snowflake',
    description: 'Connect and visualise Snowflake data in Canva',
    thumbnail: '',
  },
  { title: 'SheetSync', description: 'Import data from multiple apps effortlessly', thumbnail: '' },
  { title: 'BigQuery', description: 'Import BigQuery data into Canva designs', thumbnail: '' },
  {
    title: 'Meta Catalog Data',
    description: 'Connect Meta catalog data with your Canva designs',
    thumbnail: '',
  },
  { title: 'Financial Datasets', description: 'Connect Finance MCP and Canva AI', thumbnail: '' },
  { title: 'Microsoft 365', description: 'Connect Microsoft 365 to Canva AI', thumbnail: '' },
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

const fileConverters: AppSectionData[] = [
  {
    title: 'Slides to Video',
    description: 'Convert presentations to engaging videos and GIFs',
    thumbnail: '',
  },
  {
    title: 'Design to Image',
    description: 'Use Canva designs as images seamlessly',
    thumbnail: '',
  },
  { title: 'Text Extractor', description: 'Convert images to editable text easily', thumbnail: '' },
  {
    title: 'Code To Image',
    description: 'Convert code snippets into beautiful images.',
    thumbnail: '',
  },
  {
    title: '3D Viewer',
    description: 'Upload, adjust, and export 3D models as 2D images',
    thumbnail: '',
  },
  {
    title: 'ConvertMarkz',
    description: 'Convert designs to desktop publishing formats',
    thumbnail: '',
  },
  { title: 'OCRtoText', description: 'Convert images to text', thumbnail: '' },
  {
    title: 'Site2Slide',
    description: 'Turn a website into slides/social media post',
    thumbnail: '',
  },
  {
    title: 'DesignMarkz',
    description: 'Open InDesign, MS Publisher, Affinity, QuarkXPress',
    thumbnail: '',
  },
];

const fileImportExport: AppSectionData[] = [
  { title: 'Google Drive', description: 'Access your Google Drive files in Canva', thumbnail: '' },
  {
    title: 'Google Photos',
    description: 'Add media from Google Photos to your designs',
    thumbnail: '',
  },
  {
    title: 'Shopify Connect',
    description: 'Add your Shopify products and files to any design',
    thumbnail: '',
  },
  { title: 'Amazon Creators', description: 'Post your design to Amazon Storefront', thumbnail: '' },
  {
    title: 'Genially',
    description: 'Export your Canva designs to Genially or embed it!',
    thumbnail: '',
  },
  {
    title: 'Properti',
    description: 'Smart marketing, sold properties and automations',
    thumbnail: '',
  },
  { title: 'Klaviyo', description: 'Send Canva designs and emails to Klaviyo', thumbnail: '' },
  { title: 'Dropbox', description: 'Integrate files with Canva and Dropbox', thumbnail: '' },
  { title: 'Cloze', description: 'Real estate marketing', thumbnail: '' },
  { title: 'PDF Deck', description: 'Share your design as a PDF link', thumbnail: '' },
  { title: 'Bynder', description: 'Access Bynder assets for your designs', thumbnail: '' },
  { title: 'Brandfolder', description: 'All your Brandfolder assets, in Canva', thumbnail: '' },
  {
    title: 'MailerLite',
    description: 'Easily move designs between Canva and MailerLite',
    thumbnail: '',
  },
  { title: 'Amazon Ads', description: 'Build launch-ready ads', thumbnail: '' },
  {
    title: 'SharePoint',
    description: 'Access your assets and add them to your designs.',
    thumbnail: '',
  },
  {
    title: 'Google Ads',
    description: 'Connect your Google Ads creative workflow to Canva',
    thumbnail: '',
  },
  {
    title: 'Yodeck',
    description: 'Transfer media between Canva and Yodeck with ease',
    thumbnail: '',
  },
  {
    title: 'DeckBird.ai',
    description: 'Narrate presentation slides with voice and video',
    thumbnail: '',
  },
  {
    title: 'Xposure',
    description: 'Create Xposure marketing materials for print/web',
    thumbnail: '',
  },
  { title: 'Shop Sync', description: 'Access your Shopify images in Canva', thumbnail: '' },
  {
    title: 'Directable Signage',
    description: 'Display your Canva designs on digital signage TVs',
    thumbnail: '',
  },
  { title: 'FileFlow', description: 'All your FileFlow assets, in Canva', thumbnail: '' },
  {
    title: 'DataPocket',
    description: 'Integrate eCommerce or data feeds to Canva designs',
    thumbnail: '',
  },
  {
    title: 'Embed',
    description: 'Add video, music and online media to your designs.',
    thumbnail: '',
  },
];

export default function FileDataPage(): React.ReactNode {
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
              <Title size="large">File and data management</Title>
              <Text size="medium" tone="secondary">
                Access, sync, and share assets, no matter where they're stored.
              </Text>
            </Rows>
            <CategoryAppSection title="Analytics" apps={analytics} />
            <CategoryAppSection title="Data connectors" apps={dataConnectors} />
            <CategoryAppSection title="Data visualization" apps={dataVisualization} />
            <CategoryAppSection title="File converters" apps={fileConverters} />
            <CategoryAppSection title="File import and export" apps={fileImportExport} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
