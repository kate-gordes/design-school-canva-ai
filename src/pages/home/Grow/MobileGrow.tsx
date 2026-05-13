import React from 'react';
import { Box, Rows, Title, Text, Grid, Pill } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { Card, CardPlaceholder } from '@canva/easel/card';
import { ArrowLeftIcon, ChevronDownIcon, StarIcon, ImageIcon } from '@canva/easel/icons';
import { useNavigate } from 'react-router-dom';
import GradientBanner from '@/shared_components/GradientBanner';
import MobileWonderbox from '@/pages/Home/components/Wonderbox/MobileWonderbox';
import styles from './MobileGrow.module.css';

export default function MobileGrow(): React.ReactNode {
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        const scrolled = scrollableElement.scrollTop > 0;
        setShowHeader(scrolled);
      }
    };

    const timer = setTimeout(() => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', handleScroll);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleBackClick = () => {
    navigate('/more');
  };

  const examples = [
    {
      id: 'collage',
      title: 'Collage',
      description: 'Tell a richer story with multiple shots in one frame.',
    },
    {
      id: 'comparison',
      title: 'Comparison',
      description: 'Show why your product wins side-by-side.',
    },
    {
      id: 'ig-story',
      title: 'IG Story',
      description: 'Capture attention with immersive vertical video.',
    },
    {
      id: 'discount',
      title: 'Discount or Offer',
      description: 'Highlight a special deal to drive urgency.',
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      description: 'Embed your product into real-life moments.',
    },
    {
      id: 'questions',
      title: 'Questions',
      description: 'Hook attention by asking the right question.',
    },
    {
      id: 'listicle',
      title: 'Listicle',
      description: 'Fast facts, easy to read, hard to ignore.',
    },
    {
      id: 'feature-callout',
      title: 'Feature Callout',
      description: 'Highlight what makes your product shine.',
    },
    {
      id: 'case-study',
      title: 'Case Study',
      description: 'Turn success stories into proof that builds trust and credibility.',
    },
    {
      id: 'announcement',
      title: 'Announcement',
      description: 'Highlight a launch or update with bold, scroll-stopping visuals.',
    },
    {
      id: 'social-proof',
      title: 'Social Proof',
      description: 'Build trust with real voices and ratings.',
    },
    {
      id: 'testimonial',
      title: 'Testimonial',
      description: 'Let happy customers tell your story.',
    },
  ];

  return (
    <>
      <div className={`${styles.headerBackground} ${showHeader ? styles.visible : ''}`} />

      <div className={styles.backButton}>
        <BasicButton onClick={handleBackClick}>
          <ArrowLeftIcon size="medium" />
        </BasicButton>
      </div>

      <div className={`${styles.headerTitle} ${showHeader ? styles.visible : ''}`}>
        <Text size="small" weight="bold">
          Create ads
        </Text>
      </div>

      {/* Plain div: Easel Box resets background/margin, which would break the
         fade-to-white seam below GradientBanner. */}
      <div className={styles.container} data-mobile-scroll-container="true">
        <GradientBanner />

        <div className={styles.contentWrapper}>
          <Box width="full" className={styles.headerArea}>
            <BasicButton onClick={() => console.log('Create ads dropdown clicked')}>
              <Box display="flex" className={styles.titleButton}>
                <Title size="large" weight="normal" className={styles.title}>
                  Create ads
                </Title>
                <Box className={styles.dropdownIconCircle}>
                  <ChevronDownIcon size="medium" />
                </Box>
              </Box>
            </BasicButton>
          </Box>

          <Box paddingBottom="4u">
            <Rows spacing="2u">
              <Box width="full" paddingX="2u">
                <MobileWonderbox placeholder="Hey 👋 Drop in a product page URL." />
              </Box>

              <Box width="full" paddingX="2u">
                <Pill
                  size="medium"
                  text="Pick a business"
                  start={<StarIcon size="medium" />}
                  onClick={() => console.log('Pick a business')}
                />
              </Box>

              <Box width="full" paddingX="2u">
                <Box className={styles.disclaimer}>
                  <Text size="small" tone="secondary" align="center">
                    Canva AI can make mistakes. Please check for accuracy.
                  </Text>
                  <Box display="flex" className={styles.disclaimerLinks}>
                    <Text size="small">
                      <a href="#" className={styles.link}>
                        See terms
                      </a>
                    </Text>
                    <Text size="small" tone="secondary">
                      {'\u00A0•\u00A0'}
                    </Text>
                    <Text size="small">
                      <a href="#" className={styles.link}>
                        Give feedback
                      </a>
                    </Text>
                  </Box>
                </Box>
              </Box>

              <Box width="full" paddingX="2u" paddingTop="2u">
                <Rows spacing="3u">
                  <Title size="medium">See what you can do with AI</Title>

                  <Grid columns={2} spacing="2u">
                    {examples.map(example => (
                      <Box key={example.id} className={styles.exampleCard}>
                        <Box className={styles.cardContent}>
                          <Box display="flex" alignItems="center" gap="2u">
                            <Box className={styles.exampleIconWrapper}>
                              <ImageIcon size="medium" />
                            </Box>
                            <Text size="medium" weight="bold" className={styles.exampleTitle}>
                              {example.title}
                            </Text>
                          </Box>
                          <Text size="medium" className={styles.exampleDescription}>
                            {example.description}
                          </Text>
                        </Box>
                        <Box className={styles.cardImageWrapper}>
                          <CardPlaceholder />
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                </Rows>
              </Box>
            </Rows>
          </Box>
        </div>
      </div>
    </>
  );
}
