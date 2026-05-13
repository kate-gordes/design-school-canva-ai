import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const ads: AppSectionData[] = [
  {
    title: 'Meta Design Check',
    description: 'Check your ads meet Meta design standards',
    thumbnail: '',
  },
  {
    title: 'Shopify Connect',
    description: 'Add your Shopify products and files to any design',
    thumbnail: '',
  },
  { title: 'Amazon Creators', description: 'Post your design to Amazon Storefront', thumbnail: '' },
  {
    title: 'Properti',
    description: 'Smart marketing, sold properties and automations',
    thumbnail: '',
  },
  { title: 'Cloze', description: 'Real estate marketing', thumbnail: '' },
  { title: 'LinkedIn Ads', description: 'Publish designs as ads on LinkedIn', thumbnail: '' },
  { title: 'Amazon Ads', description: 'Build launch-ready ads', thumbnail: '' },
  {
    title: 'Google Ads',
    description: 'Connect your Google Ads creative workflow to Canva',
    thumbnail: '',
  },
  {
    title: 'Xposure',
    description: 'Create Xposure marketing materials for print/web',
    thumbnail: '',
  },
  { title: 'Starchive', description: 'Archive and share your creative assets', thumbnail: '' },
  { title: 'TREV', description: 'Track the performance of your ads', thumbnail: '' },
  { title: 'OhsemAds', description: 'Generate ad creatives for all platforms', thumbnail: '' },
  { title: 'HubSpot', description: 'Connect designs to HubSpot campaigns', thumbnail: '' },
  { title: 'DataTube', description: 'Sync your data with your designs', thumbnail: '' },
  { title: 'BrandkitApp', description: 'Organise brand assets in Canva', thumbnail: '' },
  { title: 'Fiscal Info TV', description: 'Display fiscal info in digital signage', thumbnail: '' },
  {
    title: 'TikTok Ads',
    description: 'Create and publish TikTok ads directly from Canva',
    thumbnail: '',
  },
  {
    title: 'Virtual Ambassador',
    description: 'AI virtual ambassadors for your brand',
    thumbnail: '',
  },
  { title: 'Design Buddy', description: 'Get AI design feedback on your work', thumbnail: '' },
  {
    title: 'Creative Validator',
    description: 'Validate creatives against platform specs',
    thumbnail: '',
  },
];

const contentSchedulers: AppSectionData[] = [
  {
    title: 'Vista Social',
    description: 'Publish and schedule designs to social media',
    thumbnail: '',
  },
  { title: 'Later', description: 'Schedule your content to all social platforms', thumbnail: '' },
  { title: 'Planable', description: 'Plan and schedule your content efficiently', thumbnail: '' },
  {
    title: 'Metricool',
    description: 'Add hashtags and post your designs on Social Media',
    thumbnail: '',
  },
  { title: 'Loomly', description: 'Schedule your Canva designs with Loomly', thumbnail: '' },
  {
    title: 'Publer',
    description: 'Your ultimate social media management superhero',
    thumbnail: '',
  },
  {
    title: 'Nuelink',
    description: 'Social media scheduling with automation superpower',
    thumbnail: '',
  },
  { title: 'Stori', description: 'Bring your Canva designs to STORI', thumbnail: '' },
  { title: 'Dailyfy', description: 'Import and export your creations to Dailyfy', thumbnail: '' },
  { title: 'Edgar', description: 'Upload your designs to MeetEdgar.', thumbnail: '' },
  {
    title: 'Flowsplus AI',
    description: 'Auto schedule & post social media content with AI',
    thumbnail: '',
  },
  {
    title: 'Hootsuite',
    description: 'Create and schedule seamlessly with Hootsuite',
    thumbnail: '',
  },
  {
    title: 'Gain',
    description: 'Gather client feedback and publish social content',
    thumbnail: '',
  },
];

const display: AppSectionData[] = [
  {
    title: 'Directable Signage',
    description: 'Display your Canva designs on digital signage TVs',
    thumbnail: '',
  },
  { title: 'Disign', description: 'Display signage from Canva designs', thumbnail: '' },
  { title: 'K4Community', description: 'Senior living community signage', thumbnail: '' },
  { title: 'Newline SignagePro', description: 'Digital signage for every space', thumbnail: '' },
  { title: 'Sep7 in4me', description: 'Connect displays to Canva designs', thumbnail: '' },
  { title: 'Neon', description: 'Neon-style signage for digital displays', thumbnail: '' },
  { title: 'L Squared Hub', description: 'Manage digital signage with L Squared', thumbnail: '' },
  { title: 'Nodeark', description: 'Signage deployment platform', thumbnail: '' },
  { title: 'Breeze Signage', description: 'Lightweight digital signage solution', thumbnail: '' },
  { title: 'Kitcast', description: 'Cloud-based digital signage', thumbnail: '' },
  { title: 'b2b-alive', description: 'B2B live digital signage', thumbnail: '' },
  { title: 'EasyTV', description: 'Digital signage made easy', thumbnail: '' },
  { title: 'Fiscal Info TV', description: 'Display fiscal info in digital signage', thumbnail: '' },
  { title: 'Vivi', description: 'Display Canva designs on Vivi classroom screens', thumbnail: '' },
];

const email: AppSectionData[] = [
  { title: 'Klaviyo', description: 'Send Canva designs and emails to Klaviyo', thumbnail: '' },
  {
    title: 'Easy RSVP',
    description: 'Add RSVP to Canva invitations and manage guests',
    thumbnail: '',
  },
  {
    title: 'MailerLite',
    description: 'Easily move designs between Canva and MailerLite',
    thumbnail: '',
  },
  { title: 'iContact', description: 'Seamlessly add your designs to your emails', thumbnail: '' },
  {
    title: 'Benchmark Email',
    description: 'Save designs to your Benchmark image gallery.',
    thumbnail: '',
  },
  { title: 'theMarketer', description: 'Email and SMS marketing automation', thumbnail: '' },
  { title: 'Spillover Software', description: 'Email workflow automation', thumbnail: '' },
  { title: 'Braze', description: 'Customer engagement platform', thumbnail: '' },
  { title: 'HubSpot', description: 'Connect designs to HubSpot campaigns', thumbnail: '' },
  { title: 'Constant Contact', description: 'Publish designs as marketing emails', thumbnail: '' },
  { title: 'Flodesk', description: 'Design beautiful emails with Flodesk', thumbnail: '' },
  { title: 'Gmail', description: 'Send designs through Gmail', thumbnail: '' },
];

const flipbooks: AppSectionData[] = [
  { title: 'Heyzine', description: 'Turn PDFs into stunning flipbooks', thumbnail: '' },
  { title: 'FlippingBook', description: 'Convert PDFs into interactive flipbooks', thumbnail: '' },
  {
    title: 'Simplebooklet',
    description: 'Create digital flipbooks from Canva designs',
    thumbnail: '',
  },
  { title: 'Issuu', description: 'Publish your designs as interactive flipbooks', thumbnail: '' },
  {
    title: 'Common Ninja',
    description: 'Embed flipbooks and widgets in your designs',
    thumbnail: '',
  },
  {
    title: 'Publuu Flipbooks',
    description: 'Convert PDFs into realistic flipbooks',
    thumbnail: '',
  },
  { title: 'Flipbook Maker', description: 'Create flipbooks from your designs', thumbnail: '' },
  { title: 'Storyboard AI', description: 'Generate storyboards with AI', thumbnail: '' },
];

export default function MarketingPage(): React.ReactNode {
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
              <Title size="large">Marketing</Title>
              <Text size="medium" tone="secondary">
                Get your brand out there with ads, email campaigns, socials, and more.
              </Text>
            </Rows>
            <CategoryAppSection title="Ads" apps={ads} />
            <CategoryAppSection title="Content schedulers" apps={contentSchedulers} />
            <CategoryAppSection title="Display" apps={display} />
            <CategoryAppSection title="Email" apps={email} />
            <CategoryAppSection title="Flipbooks" apps={flipbooks} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
