import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { Button } from '@canva/easel/button';
import sharedStyles from '../shared.module.css';
import styles from './WebDomains.module.css';

interface DomainCardProps {
  domain: string;
  status: 'active' | 'expired' | 'pending' | 'connected';
  expiryInfo: string;
}

function StatusBadge({ status }: { status: 'expired' | 'pending' | 'connected' }) {
  const badgeLabels: Record<string, string> = {
    expired: 'Expired',
    pending: 'Pending',
    connected: 'Connected',
  };

  const badgeClasses: Record<string, string> = {
    expired: styles.badgeExpired,
    pending: styles.badgePending,
    connected: styles.badgeConnected,
  };

  return (
    <span className={`${styles.statusBadge} ${badgeClasses[status]}`}>
      <Text size="small" weight="bold" className={styles.statusBadgeText}>
        {badgeLabels[status]}
      </Text>
    </span>
  );
}

function DomainCard({ domain, status, expiryInfo }: DomainCardProps) {
  return (
    <Box className={styles.domainCard}>
      <Columns spacing="2u" alignY="center">
        <Column>
          <Rows spacing="1u">
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                <Text>{domain}</Text>
              </Column>
              {status !== 'active' && (
                <Column width="content">
                  <StatusBadge status={status} />
                </Column>
              )}
            </Columns>
            <Text tone="secondary">{expiryInfo}</Text>
          </Rows>
        </Column>
        <Column width="content">
          <Button variant="secondary" fullWidth>
            View
          </Button>
        </Column>
      </Columns>
    </Box>
  );
}

export default function WebDomains(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Web domains
          </Title>
        </Box>

        {/* Managed by Canva */}
        <Box paddingBottom="2u">
          <Rows spacing="2u">
            <Title size="medium">Managed by Canva</Title>

            <Rows spacing="1u">
              <DomainCard domain="canvaversary.com" status="expired" expiryInfo="Expired 7/19/23" />
              <DomainCard domain="staff.canva.site" status="active" expiryInfo="Never expires" />
              <DomainCard domain="public.canva.site" status="active" expiryInfo="Never expires" />
              <DomainCard
                domain="contractors.canva.site"
                status="active"
                expiryInfo="Never expires"
              />
              <DomainCard domain="canvaspacesyd.com" status="active" expiryInfo="Renews 7/16/26" />
              <DomainCard domain="bpos.canva.site" status="active" expiryInfo="Never expires" />
              <DomainCard domain="si.canva.site" status="active" expiryInfo="Never expires" />
            </Rows>
          </Rows>
        </Box>

        {/* Managed by third party */}
        <Box paddingBottom="2u">
          <Rows spacing="2u">
            <Title size="medium">Managed by third party</Title>

            <Rows spacing="1u">
              <DomainCard
                domain="happybirthdaycanva.com"
                status="pending"
                expiryInfo="Hosted by third party"
              />
              <DomainCard
                domain="canvacreative.team"
                status="connected"
                expiryInfo="Hosted by third party"
              />
              <DomainCard
                domain="herdrum.com"
                status="expired"
                expiryInfo="Hosted by third party"
              />
            </Rows>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
