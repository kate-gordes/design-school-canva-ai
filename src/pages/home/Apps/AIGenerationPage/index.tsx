import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const aiAudio: AppSectionData[] = [
  { title: 'AI Music', description: 'Custom music for your designs', thumbnail: '' },
  { title: 'Voice AI', description: 'Generate studio-quality voices with AI', thumbnail: '' },
  {
    title: 'AI Music Generator',
    description: 'Create AI-generated music for your projects',
    thumbnail: '',
  },
  { title: 'Voice Studio', description: 'Generate high-quality voiceovers with AI', thumbnail: '' },
  { title: 'Voiceover', description: 'Instantly add high quality voiceovers', thumbnail: '' },
  {
    title: 'AI Text to Speech',
    description: 'Convert text to speech to add Audeus voiceovers',
    thumbnail: '',
  },
  {
    title: 'AI Voiceover',
    description: 'Generate a Human-Like voiceover within seconds',
    thumbnail: '',
  },
  {
    title: 'AI Sound Effects',
    description: 'Generate sound effects from text prompts with AI',
    thumbnail: '',
  },
  { title: 'Voice Labs', description: 'Generate speech, sound effects, and music', thumbnail: '' },
  { title: 'AI Voice Hub', description: 'Professional AI voice tools for creators', thumbnail: '' },
  {
    title: 'AiVOOV - Voiceover',
    description: 'Text to speech, voiceover & AI voice generator',
    thumbnail: '',
  },
  { title: 'Aurora Sound FX', description: 'AI-generated Sound Effects', thumbnail: '' },
  {
    title: 'Text-to-Speech',
    description: 'Generate realistic voices from text and documents',
    thumbnail: '',
  },
  {
    title: 'AI Voice Cloning',
    description: 'Use AI clone voice and convert text to speech',
    thumbnail: '',
  },
  { title: 'MelodyMuse', description: 'Turn text into tunes', thumbnail: '' },
  { title: 'Voiceover AI', description: 'Create human-like voiceovers in seconds', thumbnail: '' },
];

const aiImages: AppSectionData[] = [
  {
    title: 'Magic Media',
    description: 'Generate images, videos, and graphics with AI',
    thumbnail: '',
  },
  {
    title: 'DALL·E',
    description: 'Create AI-generated images from a text description',
    thumbnail: '',
  },
  { title: 'Imagen', description: 'Generate photorealistic images with Google AI', thumbnail: '' },
  { title: 'Image Generator', description: 'Text-to-image generation in seconds', thumbnail: '' },
  { title: 'AI Headshots', description: 'Studio-quality headshots with AI', thumbnail: '' },
  { title: 'AI Avatars', description: 'Generate stylised AI avatars from a photo', thumbnail: '' },
  { title: 'AI Photo Enhancer', description: 'Upscale and restore photos with AI', thumbnail: '' },
  { title: 'Reface', description: 'AI-powered face swap app for unique portraits', thumbnail: '' },
];

const aiText: AppSectionData[] = [
  { title: 'Magic Write', description: 'Go from idea to first draft faster', thumbnail: '' },
  { title: 'ChatGPT', description: 'Generate text for copy, emails, and more', thumbnail: '' },
  { title: 'Anthropic', description: 'Write with Claude across your designs', thumbnail: '' },
  {
    title: 'AI Copywriter',
    description: 'Ad copy, headlines, and taglines with AI',
    thumbnail: '',
  },
  { title: 'Translate', description: 'Translate any text across 100+ languages', thumbnail: '' },
  { title: 'Rewriter', description: 'Paraphrase and polish any text with AI', thumbnail: '' },
  {
    title: 'Resume Builder',
    description: 'Draft a resume tailored to your next role',
    thumbnail: '',
  },
  { title: 'Gemini', description: 'Draft, brainstorm, and ideate with Gemini', thumbnail: '' },
];

const aiVideos: AppSectionData[] = [
  { title: 'Magic Animate', description: 'Animate elements with a single click', thumbnail: '' },
  {
    title: 'AI Video Generator',
    description: 'Generate short videos from text prompts',
    thumbnail: '',
  },
  { title: 'Runway', description: 'AI tools for video editors and filmmakers', thumbnail: '' },
  { title: 'HeyGen', description: 'Create talking avatars from text', thumbnail: '' },
  { title: 'D-ID AI Video', description: 'Turn photos into animated presenters', thumbnail: '' },
  { title: 'Lumen5', description: 'Turn articles into videos with AI', thumbnail: '' },
  { title: 'Pictory', description: 'Long-form to short-form video with AI', thumbnail: '' },
  { title: 'Synthesia', description: 'AI video generation with studio quality', thumbnail: '' },
];

const aiDocuments: AppSectionData[] = [
  {
    title: 'Magic Docs',
    description: 'Instantly generate docs from a short prompt',
    thumbnail: '',
  },
  { title: 'AI Resume', description: 'Build and tailor resumes with AI', thumbnail: '' },
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
  {
    title: 'AI Summarizer',
    description: 'Summarize documents into key bullet points',
    thumbnail: '',
  },
];

export default function AIGenerationPage(): React.ReactNode {
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
              <Title size="large">AI generation</Title>
              <Text size="medium" tone="secondary">
                Generate or enhance images, videos, text, music, and more with a little help from
                AI.
              </Text>
            </Rows>
            <CategoryAppSection title="AI audio" apps={aiAudio} />
            <CategoryAppSection title="AI images" apps={aiImages} />
            <CategoryAppSection title="AI text" apps={aiText} />
            <CategoryAppSection title="AI videos" apps={aiVideos} />
            <CategoryAppSection title="AI documents" apps={aiDocuments} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
