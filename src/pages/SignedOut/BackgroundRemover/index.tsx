import { Box, Button, Rows } from '@canva/easel';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Heading from '@/pages/SignedOut/components/Heading';
import Breadcrumbs from '@/pages/SignedOut/components/Breadcrumbs';
import HorizontalBanner from '@/pages/SignedOut/components/HorizontalBanner';
import styles from './BackgroundRemover.module.css';

export default function BackgroundRemover(): React.ReactNode {
  const { setSidebarVisible } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible]);

  const breadcrumbs = [
    { label: 'Home', href: '/signed-out-experience' },
    { label: 'Background Remover' },
  ];

  return (
    <Box width="full" height="full" className={styles.pageWrapper} background="surface">
      <Heading />
      <Box paddingX="4u" paddingY="2u">
        <Breadcrumbs items={breadcrumbs} />
      </Box>
      <Box className={styles.container}>
        <Box className={styles.content}>
          <Rows spacing="4u">
            <HorizontalBanner
              title="Remove backgrounds instantly with AI"
              subtitle="Upload an image and remove its background automatically with Canva's AI-powered background remover. Get professional results in seconds, no editing skills required."
              backgroundColor="#E5D4F5"
              imageUrl="https://static-cse.canva.com/blob/2089883/feature_ai-generated-video_hero.jpg"
              imageAlt="AI Background Remover Feature"
              primaryActionLabel="Try Background Remover"
              primaryActionOnClick={() => navigate('/')}
            />

            <Box className={styles.actions}>
              <Rows spacing="2u">
                <Button variant="primary" size="large" onClick={() => navigate('/')}>
                  Try it now - Sign up free
                </Button>
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => navigate('/signed-out-experience')}
                >
                  Back to home
                </Button>
              </Rows>
            </Box>
          </Rows>
        </Box>
      </Box>
    </Box>
  );
}
