import { Box, Text, Title, Button, Rows, Columns, Column, Spacer } from '@canva/easel';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import Heading from '@/pages/SignedOut/components/Heading';
import styles from './signed_out.module.css';

export default function SignedOutExperience(): React.ReactNode {
  const { setSidebarVisible } = useAppContext();
  const navigate = useNavigate();

  // Hide sidebar when viewing signed-out experience
  useEffect(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible]);

  return (
    <Box width="full" height="full" className={styles.pageWrapper} background="surface">
      <Heading />
      <Box className={styles.container}>
        <Box className={styles.content}>
          <Rows spacing="4u">
            <Box className={styles.hero}>
              <Title size="xlarge" alignment="center">
                Welcome to Canva
              </Title>
              <Spacer size="2u" />
              <Text size="large" alignment="center" tone="secondary">
                Design anything. Publish anywhere.
              </Text>
            </Box>

            <Box>
              <Rows spacing="3u">
                <Title size="large" alignment="center">
                  Popular Tools
                </Title>
                <Columns spacing="3u">
                  <Column>
                    <Button
                      className={styles.toolCard}
                      variant="primary"
                      size="large"
                      onClick={() => navigate('/signed-out-experience/background-remover')}
                    >
                      Background Remover
                    </Button>
                  </Column>
                  <Column>
                    <Button
                      className={styles.toolCard}
                      variant="primary"
                      size="large"
                      onClick={() => navigate('/signed-out-experience/video-generation')}
                    >
                      Video Generation
                    </Button>
                  </Column>
                  <Column>
                    <Button
                      className={styles.toolCard}
                      variant="primary"
                      size="large"
                      onClick={() => navigate('/signed-out-experience/resume-builder')}
                    >
                      Resume Builder
                    </Button>
                  </Column>
                </Columns>
              </Rows>
            </Box>

            <Box className={styles.cta}>
              <Rows spacing="2u">
                <Button variant="primary" size="large" onClick={() => navigate('/')}>
                  Sign up for free
                </Button>
                <Button variant="secondary" size="large" onClick={() => navigate('/')}>
                  Log in
                </Button>
              </Rows>
            </Box>
          </Rows>
        </Box>
      </Box>
    </Box>
  );
}
