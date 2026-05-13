import { Box, Button, Rows } from '@canva/easel';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Heading from '@/pages/SignedOut/components/Heading';
import Breadcrumbs from '@/pages/SignedOut/components/Breadcrumbs';
import HorizontalBanner from '@/pages/SignedOut/components/HorizontalBanner';
import styles from './VideoGeneration.module.css';
import FooterColumns from '@/pages/SignedOut/components/Footer/FooterColumns';
import SocialLinks from '@/pages/SignedOut/components/Footer/SocialLinks';

export default function VideoGeneration(): React.ReactNode {
  const { setSidebarVisible } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible]);

  const breadcrumbs = [
    { label: 'Home', href: '/signed-out-experience' },
    { label: 'Video Generation' },
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
              title="Bring your best ideas to life with Canva's AI video generator"
              subtitle="With Canva AI's Create a Video Clip, powered by Google's Veo-3, turn text prompts into stunning AI-generated videos in just one click. Add cinematic visuals and synchronized audio—including dialogue and sound effects—into any project."
              backgroundColor="#E5D4F5"
              imageUrl="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
              imageAlt="Underwater scene with coral reef"
              primaryActionLabel="Generate AI video"
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

            <FooterColumns />
            <SocialLinks showLanguageSelector={true} />
          </Rows>
        </Box>
      </Box>
    </Box>
  );
}
