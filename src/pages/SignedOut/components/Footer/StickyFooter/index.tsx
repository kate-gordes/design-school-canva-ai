import { Box, Rows, Button, Columns, Column, Text } from '@canva/easel';
import { Link } from 'react-router-dom';
import FooterColumns from '@/pages/SignedOut/components/Footer/FooterColumns';
import SocialLinks from '@/pages/SignedOut/components/Footer/SocialLinks';
import styles from './StickyFooter.module.css';

interface StickyFooterProps {
  /** Text for the sticky action button */
  buttonText?: string;
  /** Click handler for the sticky action button */
  onButtonClick?: () => void;
  /** Show the sticky action button */
  showStickyButton?: boolean;
}

export default function StickyFooter({
  buttonText = 'Create a resume',
  onButtonClick,
  showStickyButton = true,
}: StickyFooterProps): React.ReactNode {
  return (
    <Box className={styles.footer} tagName="footer">
      <Box className={styles.footerContent}>
        <Rows spacing="6u">
          {/* Main footer links columns */}
          <FooterColumns />

          {/* Bottom bar with social links and legal */}
          <Box className={styles.bottomBar}>
            <Columns spacing="4u" alignY="center" align="spaceBetween">
              {/* Language selector and social icons */}
              <Column>
                <SocialLinks showLanguageSelector={true} />
              </Column>

              {/* Privacy, Terms, Copyright */}
              <Column width="content">
                <Columns spacing="3u" alignY="center">
                  <Column width="content">
                    <Link to="/privacy" className={styles.legalLink}>
                      <Button
                        variant="primary"
                        className={styles.stickyButton}
                        onClick={onButtonClick}
                      >
                        {buttonText}
                      </Button>
                      <Text size="small">Privacy</Text>
                    </Link>
                  </Column>
                  <Column width="content">
                    <Link to="/terms" className={styles.legalLink}>
                      <Text size="small">Terms</Text>
                    </Link>
                  </Column>
                  <Column width="content">
                    <Text size="small" tone="secondary">
                      © 2025 All Rights Reserved
                    </Text>
                  </Column>
                </Columns>
              </Column>
            </Columns>
          </Box>
        </Rows>
      </Box>

      {/* Sticky action button - separate from main footer */}
      {showStickyButton && <Box className={styles.stickyActionContainer}></Box>}
    </Box>
  );
}
