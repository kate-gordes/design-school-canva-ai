import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import CategoryAppSection from '@/pages/Home/Apps/components/CategoryAppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';
import styles from '../Apps.module.css';

const animation: AppSectionData[] = [
  {
    title: 'Lottie Animations',
    description: "World's largest customizable animation library",
    thumbnail: '',
  },
  { title: 'SpeedPaint', description: 'Convert any image to a speed drawing video', thumbnail: '' },
  { title: 'GIPHY', description: 'Add GIFs to your designs. Powered by GIPHY.', thumbnail: '' },
  { title: 'Speed Painter', description: 'Image to drawing animation', thumbnail: '' },
  {
    title: 'Image Animate',
    description: 'Turn your photos and ideas into engaging videos',
    thumbnail: '',
  },
  { title: 'AI Motion', description: 'Animate images with AI', thumbnail: '' },
  {
    title: 'AI Video Generator',
    description: 'Generate videos with a prompt or an image',
    thumbnail: '',
  },
  { title: 'Anime Lineart', description: 'Turn text into stunning anime line art', thumbnail: '' },
  { title: 'AI Decorations', description: 'Fun effects for every occasion', thumbnail: '' },
  { title: 'Frame Flow', description: 'Images to seamless motion video', thumbnail: '' },
  {
    title: 'CreativeBG Maker',
    description: 'Create videos and images with creative effects',
    thumbnail: '',
  },
  { title: 'Animator', description: 'Add motion to your images', thumbnail: '' },
  {
    title: 'IconScout',
    description: 'Add Icons, Illustrations, 3Ds & Lottie Animations.',
    thumbnail: '',
  },
  { title: 'Halloween', description: 'Decorations and sounds for Halloween', thumbnail: '' },
  {
    title: 'Countdown Timer',
    description: 'Create beautiful countdown timers in your designs',
    thumbnail: '',
  },
  { title: 'Tenor', description: 'Find GIFs for your designs', thumbnail: '' },
  { title: 'Black Friday', description: 'Decorations and sounds for Black Friday', thumbnail: '' },
  { title: 'Breakthru', description: 'Breakthru 2-minute breaks', thumbnail: '' },
  {
    title: 'ProgressBar Studio',
    description: 'Create dynamic animated progress bars',
    thumbnail: '',
  },
];

const avatars: AppSectionData[] = [
  {
    title: 'D-ID AI Avatars',
    description: 'Instantly add a talking head video to your designs',
    thumbnail: '',
  },
  {
    title: 'Krikey AI Animate',
    description: 'Generate 3D animated talking avatars',
    thumbnail: '',
  },
  { title: 'Character Builder', description: 'Create your own unique character', thumbnail: '' },
  {
    title: 'HeyGen AI Avatars',
    description: 'Studio quality at the speed of thought',
    thumbnail: '',
  },
  {
    title: 'Faceless Video',
    description: 'Generate videos without real faces via AI',
    thumbnail: '',
  },
  {
    title: 'AI Video by VEED',
    description: 'Turn text into video with AI, voiceovers, and more',
    thumbnail: '',
  },
  {
    title: 'Artvatar',
    description: 'Transform your image into a painting-style avatar',
    thumbnail: '',
  },
  {
    title: 'Avatarify',
    description: 'Transform your images into unique avatar styles',
    thumbnail: '',
  },
  {
    title: 'Synthesys Avatars',
    description: 'Instantly create talking avatars from a script.',
    thumbnail: '',
  },
  {
    title: 'Avatars by DupDub',
    description: 'Transform photos into stunning AI-driven videos',
    thumbnail: '',
  },
  {
    title: 'DeepReel AI Videos',
    description: 'Humanise your design with talking AI avatar videos',
    thumbnail: '',
  },
  { title: 'CyberAvatar', description: 'Turn your image into a futuristic avatar', thumbnail: '' },
  { title: 'Puppetry', description: 'Make a presenter say your script', thumbnail: '' },
  { title: 'RenaissanceAvatar', description: 'Become a Renaissance masterpiece', thumbnail: '' },
  { title: 'Jotform AI Chatbot', description: 'AI chatbots for your Canva designs', thumbnail: '' },
  {
    title: 'DeepReel AI Studio',
    description: 'Generate AI videos, avatars, images and speech',
    thumbnail: '',
  },
];

const subtitles: AppSectionData[] = [
  {
    title: 'Video Captions',
    description: 'Generate styled video captions for social media',
    thumbnail: '',
  },
  { title: 'AI Video Subtitle', description: 'Add animated captions to your video', thumbnail: '' },
  {
    title: 'Subtitles',
    description: 'Instantly add subtitles or captions to your videos',
    thumbnail: '',
  },
  { title: 'CaptionCraft', description: 'Style impactful subtitles to your videos', thumbnail: '' },
  {
    title: 'Animated Subtitles',
    description: 'Highlight spoken words with dynamic subtitles',
    thumbnail: '',
  },
  {
    title: 'Translate Subtitle',
    description: 'Subtitles translated into multiple languages',
    thumbnail: '',
  },
  {
    title: 'Styled Subtitles',
    description: 'Design, edit, and generate subtitles in any style',
    thumbnail: '',
  },
  {
    title: 'Subtitles by VEED',
    description: 'Add Subtitles and Translations to your videos',
    thumbnail: '',
  },
  { title: 'AI Captions', description: 'Animated captions generated by AI', thumbnail: '' },
  {
    title: 'Subtitles Co.',
    description: 'Amazing subtitles for your videos, in seconds',
    thumbnail: '',
  },
  {
    title: 'D-ID Vid Translate',
    description: 'AI-powered video translation for global reach',
    thumbnail: '',
  },
  {
    title: 'Subtitle Generator',
    description: 'Use AI caption generator to add subtitles to video',
    thumbnail: '',
  },
];

const videoEffects: AppSectionData[] = [
  {
    title: 'Video Upscaler',
    description: 'Convert low-quality videos into stunning HD or 4K',
    thumbnail: '',
  },
  {
    title: 'Video Reverser',
    description: 'Reverse and customize video playback with options',
    thumbnail: '',
  },
  {
    title: 'Video Cartoonify',
    description: 'Transform your videos into cartoon style',
    thumbnail: '',
  },
  { title: 'Progress Bar Maker', description: 'Add progress bars to your video', thumbnail: '' },
  {
    title: 'Artivive',
    description: 'Bring illustrations to life with Augmented Reality',
    thumbnail: '',
  },
  {
    title: 'Video Translator',
    description: 'Translate video and audio into 100+ languages',
    thumbnail: '',
  },
  {
    title: 'FrameFusion',
    description: 'Easily create video transitions from two images',
    thumbnail: '',
  },
  { title: 'VideoEnhancer', description: 'Enhances video resolution for visuals', thumbnail: '' },
  {
    title: 'Video FX Studio',
    description: 'Enhance videos with layered visual effects',
    thumbnail: '',
  },
  {
    title: 'Before After Maker',
    description: 'Create before-and-after images or videos',
    thumbnail: '',
  },
  {
    title: 'Video Optimizer',
    description: 'Resize, enhance, and colorize videos with AI',
    thumbnail: '',
  },
  {
    title: 'AI Video Loop',
    description: 'Create stunning loop video backgrounds in seconds',
    thumbnail: '',
  },
];

const videos: AppSectionData[] = [
  { title: 'YouTube Embed', description: 'Add YouTube videos to your designs', thumbnail: '' },
  { title: 'KLIPY', description: 'Explore millions of GIFS, clips, & stickers', thumbnail: '' },
  {
    title: 'Video Generator AI',
    description: 'Create stunning videos effortlessly with AI',
    thumbnail: '',
  },
  { title: 'Animated Emoji', description: 'Add lively motion to your designs!', thumbnail: '' },
  { title: 'Synthesys AI Video', description: 'Create video from text and images.', thumbnail: '' },
  {
    title: 'YT Video Thumbnail',
    description: 'Get Inspired by Thumbnails That Work!',
    thumbnail: '',
  },
  {
    title: 'Video Frames',
    description: 'Easily extract video frames in high quality',
    thumbnail: '',
  },
  { title: 'Gen Video', description: 'Generate video from text or image', thumbnail: '' },
  { title: 'Vidnoz AI', description: 'Easily create avatar videos with AI', thumbnail: '' },
  { title: 'Progress Bar Maker', description: 'Add progress bars to your video', thumbnail: '' },
  {
    title: 'Video/Audio QR',
    description: 'Record and playback video and audio in your design',
    thumbnail: '',
  },
  { title: 'HypeClips', description: 'Create dynamic animated announcement videos', thumbnail: '' },
  { title: 'KnowHow', description: 'Watch videos to learn how to do it with Canva', thumbnail: '' },
  {
    title: 'Speaking of Me',
    description: 'Edit your Speaking of Me content in Canva',
    thumbnail: '',
  },
  {
    title: 'RonDi Tutorials',
    description: 'Watch Canva tutorials as you create in the Editor',
    thumbnail: '',
  },
  { title: 'Hyperclip.io', description: 'Build a library of video clips for Canva', thumbnail: '' },
  { title: 'Vouch', description: 'Easily add video to your designs.', thumbnail: '' },
  { title: 'Gather Voices', description: 'Edit your Gather Voices videos on Canva', thumbnail: '' },
  { title: 'VideoMyJob', description: 'Edit and enhance your videos in Canva', thumbnail: '' },
  {
    title: 'AI Timelapse Video',
    description: 'Turn photos into AI timelapse videos',
    thumbnail: '',
  },
  {
    title: 'DeepReel AI Studio',
    description: 'Generate AI videos, avatars, images and speech',
    thumbnail: '',
  },
  {
    title: 'Birthday Video AI',
    description: 'Turn photos into funny birthday wishes',
    thumbnail: '',
  },
  {
    title: 'Eureka Tutorial',
    description: 'Latest Canva design tutorials in Chinese',
    thumbnail: '',
  },
  { title: 'Visla AI Video', description: 'AI-powered video creation', thumbnail: '' },
  {
    title: 'AI Video Creator',
    description: 'AI turns your text into videos with sound',
    thumbnail: '',
  },
  {
    title: 'AI Video Templates',
    description: 'Create stunning videos from templates',
    thumbnail: '',
  },
  {
    title: 'Vimeo',
    description: 'Access & edit your Vimeo videos directly in Canva',
    thumbnail: '',
  },
  {
    title: 'Video Effects',
    description: 'Transform your images into video effects',
    thumbnail: '',
  },
  { title: 'GIF Maker', description: 'Quickly convert text to GIF images', thumbnail: '' },
  {
    title: 'AI Dance Video',
    description: 'Instantly animate your photos into dance',
    thumbnail: '',
  },
  {
    title: 'AI Product Video',
    description: 'Transform images into engaging product videos',
    thumbnail: '',
  },
];

export default function VideoAnimationPage(): React.ReactNode {
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
              <Title size="large">Video and animation</Title>
              <Text size="medium" tone="secondary">
                Edit footage like a pro with motion effects, subtitles, and quality enhancing tools.
              </Text>
            </Rows>
            <CategoryAppSection title="Animation" apps={animation} />
            <CategoryAppSection title="Avatars" apps={avatars} />
            <CategoryAppSection title="Subtitles" apps={subtitles} />
            <CategoryAppSection title="Video effects" apps={videoEffects} />
            <CategoryAppSection title="Videos" apps={videos} />
          </Rows>
        </Box>
      </Box>
    </>
  );
}
