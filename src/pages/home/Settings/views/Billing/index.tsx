import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { Button } from '@canva/easel/button';
import { Alert } from '@canva/easel/alert';
import { Link } from '@canva/easel/link';
import { GlobeIcon, BuildingsIcon, InfoIcon } from '@canva/easel/icons';
import sharedStyles from '../shared.module.css';
import styles from './Billing.module.css';

export default function Billing(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Billing
          </Title>
        </Box>

        {/* Plan Card */}
        <Box className={styles.planCardWrapper}>
          <Box className={styles.billingCard}>
            <Rows spacing="2u">
              <Box className={sharedStyles.divider} paddingBottom="1.5u">
                <Title size="small">Plan</Title>
              </Box>

              <Box paddingTop="1u" paddingBottom="0.5u">
                <Columns spacing="2u" alignY="center">
                  <Column width="content">
                    <BuildingsIcon size="large" />
                  </Column>
                  <Column>
                    <Title size="large">Canva Enterprise</Title>
                  </Column>
                </Columns>
              </Box>

              <Alert tone="info" showIcon={false}>
                To manage your plan, contact your admin
              </Alert>
            </Rows>
          </Box>
        </Box>

        {/* Payment method section */}
        <Box paddingTop="2u" paddingBottom="4u">
          <Rows spacing="2u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Payment method for your team: Canva Team
            </Title>
            <Text tone="secondary">
              To manage your team's card and invoice details, contact your{' '}
              <Link href="#">administrator</Link>.
            </Text>
          </Rows>
        </Box>

        {/* Billing details card */}
        <Box>
          <Box className={styles.billingCard}>
            <Rows spacing="0.5u">
              <Title size="small">Billing details</Title>
              <Text tone="secondary">
                To manage your team's billing details, contact your admin.
              </Text>
            </Rows>
          </Box>
        </Box>

        {/* Domain subscriptions */}
        <Box paddingTop="2u">
          <Rows spacing="1u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Domain subscriptions
            </Title>

            <Box className={styles.domainCard}>
              <Rows spacing="1.5u">
                <Columns spacing="1.5u" alignY="center">
                  <Column width="content">
                    <Box className={styles.globeIcon}>
                      <GlobeIcon size="large" />
                    </Box>
                  </Column>
                  <Column>
                    <Rows spacing="0">
                      <Title size="small">Custom domain</Title>
                      <Text>canvaspacesyd.com</Text>
                    </Rows>
                  </Column>
                </Columns>

                <Columns spacing="0.5u" alignY="center">
                  <Column width="content">
                    <Text tone="secondary">Next bill on July 16, 2026</Text>
                  </Column>
                  <Column width="content">
                    <InfoIcon size="small" />
                  </Column>
                </Columns>

                <Box paddingTop="1u">
                  <Button variant="secondary" className={styles.fullWidthButton}>
                    Contact administrator
                  </Button>
                </Box>
              </Rows>
            </Box>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
