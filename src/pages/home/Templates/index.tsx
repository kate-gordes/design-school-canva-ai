import HeroSection from '@/pages/Home/components/HeroSection';
import HomePageLayout from '@/pages/Home/components/HomePageLayout';
import TemplatePills from '@/pages/Home/Templates/components/TemplatePills';
import TemplateTypeCarousel from '@/pages/Home/Templates/components/TemplateTypeCarousel';
import TemplateSectionCarousel from '@/pages/Home/Templates/components/TemplateSectionCarousel';
import JustifiedGallery from '@/pages/Home/Templates/components/JustifiedGallery';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { Box, Carousel, Rows } from '@canva/easel';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Templates.module.css';
import MobilePageLayout from '@/pages/Home/components/MobilePageLayout';
import {
  getInspiredTemplates,
  getDiscoverTemplates,
  getTrendingTemplates,
  getMasonryTemplates,
} from '@/pages/Home/Templates/data/templateLoader';
import DoctypeTile from '@/pages/Home/Templates/components/DoctypeTile/DoctypeTile';
import { templatesDoctypeCategories } from '@/pages/Home/Templates/components/DoctypeTile/doctypeCategories';
import CategoryPills from '@/pages/Home/Templates/components/CategoryPills';
import MeetAiVideoEffects from '@/pages/Home/Templates/components/MeetAiVideoEffects';
import CanvasTopPicks from '@/pages/Home/Templates/components/CanvasTopPicks';
import SectionTitle from '@/shared_components/SectionTitle';

export default function Templates(): React.ReactNode {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  const inspiredTemplates = useMemo(() => getInspiredTemplates(12), []);
  const discoverTemplates = useMemo(() => getDiscoverTemplates(12), []);
  const trendingTemplates = useMemo(() => getTrendingTemplates(12), []);
  const masonryTemplates = useMemo(() => getMasonryTemplates(30), []);

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  if (isMobile) {
    return (
      <MobilePageLayout
        title="Templates"
        searchPlaceholder="Search templates"
        showTitleOnScroll={true}
      >
        <Rows spacing="3u">
          <TemplatePills />

          <TemplateTypeCarousel title="Explore templates" />

          <MeetAiVideoEffects />

          <TemplateSectionCarousel
            title="Inspired by your designs"
            cardWidth={227}
            cardHeight={128}
            itemCount={6}
            templates={inspiredTemplates}
          />

          <TemplateSectionCarousel
            title="Discover Canva"
            cardWidth={227}
            cardHeight={128}
            itemCount={6}
            templates={discoverTemplates}
          />

          <CanvasTopPicks />

          <Box paddingX="2u">
            <JustifiedGallery
              title="More templates for you"
              templates={masonryTemplates}
              targetRowHeight={200}
              gap={16}
            />
          </Box>
        </Rows>
      </MobilePageLayout>
    );
  }

  return (
    <HomePageLayout>
      <HeroSection
        title="Templates"
        wonderboxInitialTab="templates"
        showWonderboxTabs={false}
        gradient={false}
      />
      <CategoryPills />

      <Rows spacing="4u" className={styles.templatesPage}>
        <Box width="full" className={styles.exploreSection}>
          <Rows spacing="2u">
            <SectionTitle>Explore templates</SectionTitle>
            <Carousel name="explore-templates" gutter="large" buttonVariant="circular">
              {Array.from({ length: Math.ceil(templatesDoctypeCategories.length / 2) }).map(
                (_, i) => {
                  const category1 = templatesDoctypeCategories[i * 2];
                  const category2 = templatesDoctypeCategories[i * 2 + 1];
                  return (
                    <div key={`explore-col-${i}`} className={styles.exploreColumn}>
                      <Rows spacing="3u">
                        {category1 ? (
                          <DoctypeTile
                            doctypeId={category1.id}
                            label={category1.label}
                            gradientStart={category1.gradientStart}
                            gradientEnd={category1.gradientEnd}
                            imagePath={category1.imagePath}
                            onClick={() => navigate(category1.route)}
                          />
                        ) : (
                          <Box width={225} height={80} />
                        )}
                        {category2 ? (
                          <DoctypeTile
                            doctypeId={category2.id}
                            label={category2.label}
                            gradientStart={category2.gradientStart}
                            gradientEnd={category2.gradientEnd}
                            imagePath={category2.imagePath}
                            onClick={() => navigate(category2.route)}
                          />
                        ) : (
                          <Box width={225} height={80} />
                        )}
                      </Rows>
                    </div>
                  );
                },
              )}
            </Carousel>
          </Rows>
        </Box>

        <MeetAiVideoEffects />

        <Box width="full">
          <Rows spacing="2u">
            <SectionTitle>Inspired by your designs</SectionTitle>
            <Carousel name="inspired-designs" gutter="large" buttonVariant="circular">
              {inspiredTemplates.map(template => (
                <div key={template.id} className={styles.templateTile}>
                  <img
                    src={template.preview ?? template.image}
                    alt={template.name}
                    className={styles.templateTileImage}
                  />
                </div>
              ))}
            </Carousel>
          </Rows>
        </Box>

        <Box width="full">
          <Rows spacing="2u">
            <SectionTitle>Discover Canva</SectionTitle>
            <Carousel name="discover-canva" gutter="large" buttonVariant="circular">
              {discoverTemplates.map(template => (
                <div key={template.id} className={styles.templateTile}>
                  <img
                    src={template.preview ?? template.image}
                    alt={template.name}
                    className={styles.templateTileImage}
                  />
                </div>
              ))}
            </Carousel>
          </Rows>
        </Box>

        <Box width="full">
          <Rows spacing="2u">
            <SectionTitle>Trending near you</SectionTitle>
            <Carousel name="trending" gutter="large" buttonVariant="circular">
              {trendingTemplates.map(template => (
                <div key={template.id} className={styles.templateTile}>
                  <img
                    src={template.preview ?? template.image}
                    alt={template.name}
                    className={styles.templateTileImage}
                  />
                </div>
              ))}
            </Carousel>
          </Rows>
        </Box>

        <CanvasTopPicks />

        <JustifiedGallery title="More templates for you" templates={masonryTemplates} gap={32} />
      </Rows>
    </HomePageLayout>
  );
}
