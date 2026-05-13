import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const cardsAndInvitations: AppSectionData[] = [
  {
    title: 'CreatEcards',
    description: 'Send invitations and collect responses for events',
    thumbnail: '',
  },
  {
    title: 'Text Path Maker',
    description: 'Create custom text along any path with ease',
    thumbnail: '',
  },
  {
    title: 'Partiful Invites',
    description: 'Partiful: Free party invites with RSVP tracking',
    thumbnail: '',
  },
  {
    title: 'Pinvite',
    description: 'Export designs as online invitations with RSVP',
    thumbnail: '',
  },
  { title: 'Typecard', description: 'Create your digital business card', thumbnail: '' },
  { title: 'Invotally', description: 'Create ecards from your designs', thumbnail: '' },
  {
    title: 'Coteri Invitations',
    description: 'Create digital invites and track RSVPs for free',
    thumbnail: '',
  },
  {
    title: 'AI Business Card',
    description: 'Generate business cards in different styles',
    thumbnail: '',
  },
  { title: 'RSVP Form', description: 'Embed RSVP forms into your designs', thumbnail: '' },
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
  { title: 'RISER App', description: 'Your Video CV', thumbnail: '' },
  { title: 'Google Calendar', description: 'Connect Google Calendar and Canva AI', thumbnail: '' },
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
  { title: 'Mailchimp', description: 'Turn designs into email campaigns', thumbnail: '' },
  { title: 'Constant Contact', description: 'Publish designs as marketing emails', thumbnail: '' },
  {
    title: 'Benchmark Email',
    description: 'Save designs to your Benchmark image gallery.',
    thumbnail: '',
  },
  { title: 'HubSpot', description: 'Connect designs to HubSpot campaigns', thumbnail: '' },
];

export default function CommunicationPage(): React.ReactNode {
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
              <Title size="large">Communication</Title>
              <Text size="medium" tone="secondary">
                Connect with your network over email, instant message, and social media.
              </Text>
            </Rows>
            <CategoryAppSection title="Cards and invitations" apps={cardsAndInvitations} />
            <CategoryAppSection title="Content schedulers" apps={contentSchedulers} />
            <CategoryAppSection title="Email" apps={email} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
