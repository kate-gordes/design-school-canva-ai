import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

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

const forms: AppSectionData[] = [
  { title: 'Jotform', description: 'Add Jotform forms to Canva designs', thumbnail: '' },
  { title: 'CanSign', description: 'Add e-signatures to documents', thumbnail: '' },
  { title: 'Klaviyo', description: 'Send Canva designs and emails to Klaviyo', thumbnail: '' },
  { title: 'Formester', description: 'Build forms inside your designs', thumbnail: '' },
  {
    title: 'Easy RSVP',
    description: 'Add RSVP to Canva invitations and manage guests',
    thumbnail: '',
  },
  { title: 'FluidForms', description: 'Embed dynamic forms into Canva', thumbnail: '' },
  { title: 'Form AI', description: 'Generate forms with AI', thumbnail: '' },
  { title: 'Jotform AI Chatbot', description: 'Add AI chatbots to your designs', thumbnail: '' },
  { title: 'Alchemy Forms', description: 'Alchemy form builder integration', thumbnail: '' },
  { title: 'Weavely AI Forms', description: 'Weavely AI-powered form builder', thumbnail: '' },
  { title: 'ouRSVP', description: 'Manage RSVPs for your events', thumbnail: '' },
  { title: 'Celero', description: 'Collect payments with forms', thumbnail: '' },
];

const socialNetworking: AppSectionData[] = [
  {
    title: 'Carousel Studio',
    description: 'Automate social media carousels with AI',
    thumbnail: '',
  },
  { title: 'Instagram', description: 'Publish your designs to Instagram', thumbnail: '' },
  { title: 'Facebook', description: 'Publish your designs to Facebook', thumbnail: '' },
  {
    title: 'Social Previewer',
    description: 'Preview designs across social platforms',
    thumbnail: '',
  },
  { title: 'LinkedIn Ads', description: 'Publish designs as ads on LinkedIn', thumbnail: '' },
  {
    title: 'Vista Social',
    description: 'Publish and schedule designs to social media',
    thumbnail: '',
  },
  {
    title: 'Social Bellow',
    description: 'AI-powered conversational content creator',
    thumbnail: '',
  },
  { title: 'SocialPilot', description: 'Schedule content across social networks', thumbnail: '' },
  { title: 'SocialHub', description: 'Your social media hub', thumbnail: '' },
  { title: 'theMarketer', description: 'Email and SMS marketing automation', thumbnail: '' },
  { title: 'Spillover Software', description: 'Email workflow automation', thumbnail: '' },
  { title: 'Lomavis', description: 'Local marketing platform', thumbnail: '' },
  { title: 'OpenRep', description: 'AI Social Media Caption Generator', thumbnail: '' },
  { title: 'LinkedIn', description: 'Share designs directly to LinkedIn', thumbnail: '' },
  {
    title: 'Gain',
    description: 'Gather client feedback and publish social content',
    thumbnail: '',
  },
  { title: 'HubSpot', description: 'Connect designs to HubSpot campaigns', thumbnail: '' },
  { title: 'Slack', description: 'Share your Canva designs via Slack', thumbnail: '' },
];

const tasksAndWorkflows: AppSectionData[] = [
  { title: 'Asana', description: 'Manage Asana tasks from your designs', thumbnail: '' },
  { title: 'Pomodoro', description: 'Pomodoro timer for focused work', thumbnail: '' },
  { title: 'Correctify', description: 'Correction and feedback workflows', thumbnail: '' },
  { title: 'Monday.com', description: 'Manage monday.com boards inside Canva', thumbnail: '' },
  { title: 'Pomodoro Timer', description: 'Time your design sessions', thumbnail: '' },
  { title: 'Wellzesta', description: 'Wellness activity scheduling', thumbnail: '' },
  { title: 'Todo App', description: 'Manage todos inside Canva', thumbnail: '' },
  { title: 'Design Buddy', description: 'Get AI design feedback on your work', thumbnail: '' },
  {
    title: 'Creative Validator',
    description: 'Validate creatives against platform specs',
    thumbnail: '',
  },
  { title: 'Tailwind', description: 'Schedule Pinterest and Instagram content', thumbnail: '' },
  { title: 'PageProof', description: 'Proof and approve creative work', thumbnail: '' },
  { title: 'Slack', description: 'Share your Canva designs via Slack', thumbnail: '' },
  { title: 'Atlassian', description: 'Connect Atlassian tools to your designs', thumbnail: '' },
  { title: 'Notion', description: 'Embed Canva designs into Notion', thumbnail: '' },
  { title: 'Linear', description: 'Track issues and tasks in Linear', thumbnail: '' },
];

export default function ProjectManagementPage(): React.ReactNode {
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
              <Title size="large">Project management</Title>
              <Text size="medium" tone="secondary">
                Plan, approve, and publish together — all without leaving Canva.
              </Text>
            </Rows>
            <CategoryAppSection title="Content schedulers" apps={contentSchedulers} />
            <CategoryAppSection title="Forms" apps={forms} />
            <CategoryAppSection title="Social networking" apps={socialNetworking} />
            <CategoryAppSection title="Tasks and workflows" apps={tasksAndWorkflows} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
