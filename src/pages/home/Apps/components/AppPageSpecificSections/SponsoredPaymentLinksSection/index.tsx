import React from 'react';
import { Box, Rows, Title, Text, Button } from '@canva/easel';
import styles from './SponsoredPaymentLinksSection.module.css';

export default function SponsoredPaymentLinksSection(): React.ReactNode {
  return (
    <Box width="full">
      <div className={styles.card}>
        <div className={styles.videoWrapper}>
          <button type="button" className={styles.playBadge} aria-label="Play video">
            <span className={styles.playIcon} />
          </button>
        </div>
        <div className={styles.contentSide}>
          <div className={styles.logoRow}>
            <div className={styles.logo} aria-hidden="true">
              P
            </div>
            <Rows spacing="0">
              <Title size="small">Payment Links</Title>
              <span className={styles.sponsored}>Sponsored</span>
            </Rows>
          </div>
          <Rows spacing="1u">
            <Title size="small">Add payment links and QR codes to designs</Title>
            <Text size="medium" tone="secondary">
              Turn any digital or printed design into a payment moment. Add PayPal Payment Links and
              QR codes to your Canva designs so customers can check out with PayPal, Pay Later,
              Venmo (US only), and cards.
            </Text>
          </Rows>
          <div className={styles.ctaWrapper}>
            <Button variant="secondary" size="medium" onClick={() => {}}>
              Try this app
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
}
