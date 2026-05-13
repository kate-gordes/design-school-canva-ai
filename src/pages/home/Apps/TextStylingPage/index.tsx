import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

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

const textEffects: AppSectionData[] = [
  { title: 'FontFrame', description: 'Frame your text in decorative styles', thumbnail: '' },
  { title: 'FontStudio', description: 'Advanced font design and editing', thumbnail: '' },
  { title: 'TypeExtrude', description: 'Extrude 3D text effects', thumbnail: '' },
  { title: 'TypeCutOut', description: 'Create cut-out text effects', thumbnail: '' },
  { title: 'TypeGradient', description: 'Generate gradient text effects', thumbnail: '' },
  { title: 'TypeLettering', description: 'Custom lettering for headlines', thumbnail: '' },
  { title: 'Equations', description: 'Add mathematical equations to designs', thumbnail: '' },
  { title: 'TypeCraft', description: 'Hand-crafted typography tools', thumbnail: '' },
  { title: 'Type Warp', description: 'Warp text into custom shapes', thumbnail: '' },
  { title: 'Cool Text Maker', description: 'Create stylized cool text effects', thumbnail: '' },
  { title: 'Blend Image', description: 'Blend text and images together', thumbnail: '' },
  { title: 'Text Warp', description: 'Warp text to fit any path', thumbnail: '' },
  { title: 'Word Cloud Maker', description: 'Generate word clouds from text', thumbnail: '' },
  { title: 'DepthText', description: 'Add depth and dimension to text', thumbnail: '' },
  { title: 'TextArt', description: 'Turn text into artwork', thumbnail: '' },
  { title: 'Type Curve', description: 'Curve text along any path', thumbnail: '' },
  { title: 'Textsmith', description: 'Professional typography tools', thumbnail: '' },
  { title: 'Text Art Maker', description: 'Create artistic text compositions', thumbnail: '' },
  {
    title: 'Social Bellow',
    description: 'AI-powered conversational content creator',
    thumbnail: '',
  },
  {
    title: 'SwitchCase.xyz',
    description: 'UPPERCASE, lowercase, Title Case, slug-text, etc',
    thumbnail: '',
  },
  {
    title: 'Handwriting Maker',
    description: 'Create realistic handwriting from digital text',
    thumbnail: '',
  },
  {
    title: 'Text Splitter',
    description: 'Divide text into lines or columns effortlessly',
    thumbnail: '',
  },
  {
    title: 'To Code',
    description: 'Convert your design to code for an accessible web',
    thumbnail: '',
  },
  {
    title: 'AI Font Generator',
    description: 'Easily design captivating headline and custom font',
    thumbnail: '',
  },
  { title: 'FontPixel', description: 'Transform text into colorful pixel art', thumbnail: '' },
  { title: 'MotionText', description: 'Animated text with style and motion', thumbnail: '' },
  {
    title: 'Text to Pixel',
    description: 'Turn text into pixel art with custom styles',
    thumbnail: '',
  },
  { title: 'TypeStudio', description: 'Pro-style lettering made easy', thumbnail: '' },
  {
    title: '3D Text Gradient',
    description: '3D text generator with multiple custom gradients',
    thumbnail: '',
  },
  { title: 'Letteristic', description: 'Transform words into art instantly', thumbnail: '' },
  {
    title: 'Convert Case',
    description: 'Transform text into various cases quickly',
    thumbnail: '',
  },
  { title: 'Text Cleaner', description: 'Easily organize and format your text', thumbnail: '' },
  {
    title: 'Ethiopic Fonts',
    description: 'Add beautiful Ethiopic fonts to designs',
    thumbnail: '',
  },
  {
    title: 'WordAnchor',
    description: 'Automated visual learning aid for classroom use',
    thumbnail: '',
  },
];

const textGenerators: AppSectionData[] = [
  {
    title: 'Carousel Studio',
    description: 'Automate social media carousels with AI',
    thumbnail: '',
  },
  { title: 'CaptionCraft', description: 'Style impactful subtitles to your videos', thumbnail: '' },
  {
    title: 'Transcribe Audio',
    description: 'Transcribe your audio for captions / subtitles',
    thumbnail: '',
  },
  { title: 'Transcribe', description: 'Transcribe your audio and video to text', thumbnail: '' },
  { title: 'Captions', description: 'Image-inspired captions in an instant', thumbnail: '' },
  {
    title: 'Storytelling',
    description: 'Tell engaging, exciting, and memorable stories',
    thumbnail: '',
  },
  {
    title: 'Speech to Text',
    description: 'Transcribe video or audio into text or subtitles',
    thumbnail: '',
  },
  { title: 'Lorem Ipsum', description: 'Revolutionizing placeholders', thumbnail: '' },
  { title: 'TextAnywhere', description: 'Turn text into stunning visuals', thumbnail: '' },
  {
    title: 'Image Translator',
    description: 'Quickly translate images into over 130+ languages',
    thumbnail: '',
  },
  {
    title: 'Quotes',
    description: 'Generate and add beautiful quotes to your design',
    thumbnail: '',
  },
  {
    title: 'Job And Resume AI',
    description: 'AI-powered Resume/CV & Cover Letter builder',
    thumbnail: '',
  },
  {
    title: 'Quick Lorem',
    description: 'Easily insert "Lorem Ipsum" filler text into your',
    thumbnail: '',
  },
  {
    title: 'Lorem Generator',
    description: 'Generate placeholder Lorem Ipsum text easily',
    thumbnail: '',
  },
  {
    title: 'Prompt Genie',
    description: 'Turn simple ideas into ready to use prompts',
    thumbnail: '',
  },
  {
    title: 'Word Art Generator',
    description: 'Convert words into artistic word images',
    thumbnail: '',
  },
  { title: 'CanLorem', description: 'Generate "Lorem Ipsum" placeholder text', thumbnail: '' },
  { title: 'Faker', description: 'Generate placeholder text quickly', thumbnail: '' },
  { title: 'Aurora Ipsum', description: 'Generate simple placeholder text', thumbnail: '' },
  {
    title: 'Narrato',
    description: 'Generate text content for your designs using AI',
    thumbnail: '',
  },
  { title: 'Stori', description: 'Bring your Canva designs to STORI', thumbnail: '' },
  { title: 'Smartling', description: 'Smartling Translation Platform Integration', thumbnail: '' },
  { title: 'OpenRep', description: 'AI Social Media Caption Generator', thumbnail: '' },
  { title: 'Image Insight', description: 'Generate captions for your images', thumbnail: '' },
  { title: 'Auto Captions', description: 'Create TikTok-style captions for videos', thumbnail: '' },
  {
    title: 'Math Keyboard',
    description: 'Easily create mathematical formulas with ease',
    thumbnail: '',
  },
  {
    title: 'Quran Verse',
    description: 'Generate Quran verses for beautiful designs',
    thumbnail: '',
  },
  { title: 'Buzzbase AI', description: 'Create content from scratch', thumbnail: '' },
  {
    title: 'AI Resume Builder',
    description: 'AI powered resume generator, checker and letters',
    thumbnail: '',
  },
  {
    title: '3D Text Gradient',
    description: '3D text generator with multiple custom gradients',
    thumbnail: '',
  },
  {
    title: 'AI Quiz Generator',
    description: 'Create quizzes, questions and tests with AI',
    thumbnail: '',
  },
  {
    title: 'Hashtag Gen AI',
    description: 'Generate trending hashtags for social media posts',
    thumbnail: '',
  },
  {
    title: 'WordAnchor',
    description: 'Automated visual learning aid for classroom use',
    thumbnail: '',
  },
  {
    title: 'AI Lesson Planner',
    description: 'Generate lesson plans and syllabi with AI',
    thumbnail: '',
  },
  { title: 'Zoom', description: 'Import Zoom meetings and transcripts easily', thumbnail: '' },
];

export default function TextStylingPage(): React.ReactNode {
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
              <Title size="large">Text styling</Title>
              <Text size="medium" tone="secondary">
                Make your words stand out with stunning effects, generators, and typography.
              </Text>
            </Rows>
            <CategoryAppSection title="Forms" apps={forms} />
            <CategoryAppSection title="Text effects" apps={textEffects} />
            <CategoryAppSection title="Text generators" apps={textGenerators} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
