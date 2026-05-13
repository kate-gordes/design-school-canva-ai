import React, { useEffect } from 'react';
import { Box, Rows, Text } from '@canva/easel';
import { useParams } from 'react-router-dom';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppContext } from '@/hooks/useAppContext';
import HomePageLayout from '@/pages/Home/components/HomePageLayout';
import SectionTitle from '@/shared_components/SectionTitle';
import { HeroBanner } from '@/pages/Home/Apps/components/Banners';
import AppsSearchCategoryPillsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AppsSearchCategoryPillsSection';
import FeaturedAppsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/FeaturedAppsSection';
import CollectionsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/CollectionsSection';
import TeamAppsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/TeamAppsSection';
import AIGenerationSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AIGenerationSection';
import AudioVoiceoverSection from '@/pages/Home/Apps/components/AppPageSpecificSections/AudioVoiceoverSection';
import CommunicationSection from '@/pages/Home/Apps/components/AppPageSpecificSections/CommunicationSection';
import FileDataManagementSection from '@/pages/Home/Apps/components/AppPageSpecificSections/FileDataManagementSection';
import GraphicDesignSection from '@/pages/Home/Apps/components/AppPageSpecificSections/GraphicDesignSection';
import MarketingSection from '@/pages/Home/Apps/components/AppPageSpecificSections/MarketingSection';
import NewAndNoteworthySection from '@/pages/Home/Apps/components/AppPageSpecificSections/NewAndNoteworthySection';
import TrendingAppsSection from '@/pages/Home/Apps/components/AppPageSpecificSections/TrendingAppsSection';
import SponsoredPaymentLinksSection from '@/pages/Home/Apps/components/AppPageSpecificSections/SponsoredPaymentLinksSection';
import AIGenerationPage from './AIGenerationPage';
import AudioVoiceoverPage from './AudioVoiceoverPage';
import CommunicationPage from './CommunicationPage';
import FileDataPage from './FileDataPage';
import GraphicDesignPage from './GraphicDesignPage';
import MarketingPage from './MarketingPage';
import PhotoEditingPage from './PhotoEditingPage';
import ProjectManagementPage from './ProjectManagementPage';
import TextStylingPage from './TextStylingPage';
import VideoAnimationPage from './VideoAnimationPage';
import MobileApps from './MobileApps';
import styles from './Apps.module.css';

function CategoryPage({ category }: { category: string }): React.ReactNode {
  switch (category) {
    case 'ai-generation':
      return <AIGenerationPage />;
    case 'audio-voiceover':
      return <AudioVoiceoverPage />;
    case 'communication':
      return <CommunicationPage />;
    case 'file-data':
      return <FileDataPage />;
    case 'graphic-design':
      return <GraphicDesignPage />;
    case 'marketing':
      return <MarketingPage />;
    case 'photo-editing':
      return <PhotoEditingPage />;
    case 'project-management':
      return <ProjectManagementPage />;
    case 'text-styling':
      return <TextStylingPage />;
    case 'video-animation':
      return <VideoAnimationPage />;
    default:
      return null;
  }
}

export default function Apps(): React.ReactNode {
  const isMobile = useIsMobile();
  const { category } = useParams<{ category: string }>();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  if (isMobile) {
    return <MobileApps />;
  }

  if (category) {
    const page = CategoryPage({ category });
    if (page) {
      return <HomePageLayout gradientHeight={0}>{page}</HomePageLayout>;
    }
  }

  return (
    <HomePageLayout gradientHeight={0}>
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
            <FeaturedAppsSection />
            <CollectionsSection />
            <TeamAppsSection />
            <Rows spacing="1u">
              <SectionTitle>Explore them all</SectionTitle>
              <Text size="medium" tone="secondary">
                Browse the entire directory and get more out of Canva
              </Text>
            </Rows>
            <AIGenerationSection />
            <AudioVoiceoverSection />
            <CommunicationSection />
            <FileDataManagementSection />
            <GraphicDesignSection />
            <MarketingSection />
            <NewAndNoteworthySection />
            <TrendingAppsSection />
            <SponsoredPaymentLinksSection />
          </Rows>
        </Box>
      </Box>
    </HomePageLayout>
  );
}
