import { Box, Button, Rows } from '@canva/easel';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Heading from '@/pages/SignedOut/components/Heading';
import Breadcrumbs from '@/pages/SignedOut/components/Breadcrumbs';
import HorizontalBanner from '@/pages/SignedOut/components/HorizontalBanner';
import styles from './ResumeBuilder.module.css';

export default function ResumeBuilder(): React.ReactNode {
  const { setSidebarVisible } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible]);

  const breadcrumbs = [
    { label: 'Home', href: '/signed-out-experience' },
    { label: 'Resume Builder' },
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
              title="Build professional resumes with beautiful templates"
              subtitle="Create a standout resume in minutes with our easy-to-use builder. Choose from hundreds of professionally designed templates and customize them to match your style."
              backgroundColor="#FFE5E5"
              imageUrl="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
              imageAlt="Professional Resume Templates"
              primaryActionLabel="Start Building"
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
