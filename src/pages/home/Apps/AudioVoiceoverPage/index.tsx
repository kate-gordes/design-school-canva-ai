import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const music: AppSectionData[] = [
  { title: 'AI Music', description: 'Custom music for your designs', thumbnail: '' },
  {
    title: 'AI Music Generator',
    description: 'Create AI-generated music for your projects',
    thumbnail: '',
  },
  { title: 'MelodyMuse', description: 'Turn text into tunes', thumbnail: '' },
  { title: 'Music Maker', description: 'Generate custom music for your designs', thumbnail: '' },
  { title: 'Tunetank', description: 'Free music for creators', thumbnail: '' },
  { title: 'Snapmuse', description: 'Find the perfect music for your design', thumbnail: '' },
  {
    title: 'AI Sound Effect',
    description: 'Generate sound effects, instrumental music, etc.',
    thumbnail: '',
  },
  {
    title: 'Mubert - AI Music',
    description: 'Create music for videos, designs, and projects',
    thumbnail: '',
  },
  {
    title: 'AI Music Maker',
    description: 'Use AI lyrics generator to create music and songs',
    thumbnail: '',
  },
  {
    title: 'Soundraw',
    description: 'Create the perfect song for your project using AI',
    thumbnail: '',
  },
  { title: 'AI Music Separator', description: 'Remove vocals and music from audio', thumbnail: '' },
  { title: 'SonicSocial', description: 'Prompt to audio, within seconds', thumbnail: '' },
  { title: 'GenreX', description: 'Create wonderful music with text', thumbnail: '' },
  { title: 'Tangra Music', description: 'Create your own music', thumbnail: '' },
  { title: 'Gen Music', description: 'Add high-quality music to your design', thumbnail: '' },
  {
    title: 'Gen Sound Effects',
    description: 'Turn your ideas into music with the power of AI',
    thumbnail: '',
  },
  {
    title: 'Song Generator AI',
    description: 'Create full songs from your lyrics with Saifs AI',
    thumbnail: '',
  },
];

const soundEffects: AppSectionData[] = [
  {
    title: 'AI Sound Effects',
    description: 'Generate sound effects from text prompts with AI',
    thumbnail: '',
  },
  { title: 'AI Voice Hub', description: 'Professional AI voice tools for creators', thumbnail: '' },
  { title: 'Aurora Sound FX', description: 'AI-generated Sound Effects', thumbnail: '' },
  {
    title: 'AI Sound Effect',
    description: 'Generate sound effects, instrumental music, etc.',
    thumbnail: '',
  },
  {
    title: 'AI Video Sound',
    description: 'Generates audio synchronized with videos using AI',
    thumbnail: '',
  },
  {
    title: 'Sound Effects AI',
    description: 'AI sound effects to fill the silence beautifully',
    thumbnail: '',
  },
  {
    title: 'Gen Sound Effects',
    description: 'Turn your ideas into music with the power of AI',
    thumbnail: '',
  },
];

const voiceovers: AppSectionData[] = [
  { title: 'Voice AI', description: 'Generate studio-quality voices with AI', thumbnail: '' },
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
  { title: 'Voice Labs', description: 'Generate speech, sound effects, and music', thumbnail: '' },
  {
    title: 'AiVOOV - Voiceover',
    description: 'Text to speech, voiceover & AI voice generator',
    thumbnail: '',
  },
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
  { title: 'Voiceover AI', description: 'Create human-like voiceovers in seconds', thumbnail: '' },
  {
    title: 'Text to Audio',
    description: 'Instant High Quality Human Like Voiceover',
    thumbnail: '',
  },
  {
    title: 'Text to Speech',
    description: 'A simple & easy text to speech converter',
    thumbnail: '',
  },
  {
    title: 'Children Voiceover',
    description: 'Bring storybooks to life with engaging voiceovers',
    thumbnail: '',
  },
  {
    title: 'AI Voice by Audioz',
    description: 'Generate AI text-to-speech voiceovers in minute',
    thumbnail: '',
  },
  { title: 'Botnoi Voice', description: 'Voiceover made easy', thumbnail: '' },
  { title: 'Quick AI Voiceover', description: 'Convert text to speech instantly', thumbnail: '' },
  { title: 'AI Voice Changer', description: 'Changing the tone of audio with AI', thumbnail: '' },
  { title: 'Aurora Voice Plus', description: 'Multi-language AI voice', thumbnail: '' },
  { title: 'Voiceover Pro', description: 'Create realistic voices in any style', thumbnail: '' },
  { title: 'Aurora Voice India', description: 'AI-voices designed for India', thumbnail: '' },
];

export default function AudioVoiceoverPage(): React.ReactNode {
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
              <Title size="large">Audio and voiceover</Title>
              <Text size="medium" tone="secondary">
                Easily add royalty-free music, realistic voiceovers, and top-quality sound effects
                to designs.
              </Text>
            </Rows>
            <CategoryAppSection title="Music" apps={music} />
            <CategoryAppSection title="Sound effects" apps={soundEffects} />
            <CategoryAppSection title="Voiceovers" apps={voiceovers} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
