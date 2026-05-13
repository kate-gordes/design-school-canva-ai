import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { Button } from '@canva/easel/button';
import { Link } from '@canva/easel/link';
import sharedStyles from '../shared.module.css';

interface StorageCardProps {
  title: string;
  description: React.ReactNode;
  buttonLabel: string;
  buttonVariant?: 'secondary' | 'critical';
}

function StorageCard({
  title,
  description,
  buttonLabel,
  buttonVariant = 'secondary',
}: StorageCardProps) {
  return (
    <Box className={sharedStyles.settingsCard}>
      <Rows spacing="2u">
        <Rows spacing="0">
          <Text weight="bold">{title}</Text>
          <Text tone="secondary">{description}</Text>
        </Rows>
        <Box display="inlineFlex">
          <Button variant={buttonVariant}>{buttonLabel}</Button>
        </Box>
      </Rows>
    </Box>
  );
}

export default function DataAndStorage(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Rows spacing="1u">
            <Title size="large" alignment="center">
              Data and storage
            </Title>
            <Text tone="secondary" alignment="center">
              Manage and delete your offline content and data.
            </Text>
          </Rows>
        </Box>

        {/* Data on this device section */}
        <Box paddingTop="0.4u">
          <Rows spacing="2u">
            <Rows spacing="0">
              <Title size="small" className={sharedStyles.sectionTitle}>
                Data on this device
              </Title>
              <Text tone="secondary">
                Manage the designs and data Canva saves to your device.{' '}
                <Link href="#">View offline designs.</Link>
              </Text>
            </Rows>

            <StorageCard
              title="Remove offline designs"
              description={
                <>
                  Designs you've made available offline will be removed from your device. You can
                  still access them while online. To remove individual designs go to{' '}
                  <Link href="#">Available offline</Link>.
                </>
              }
              buttonLabel="Remove designs"
              buttonVariant="secondary"
            />

            <StorageCard
              title="Delete all stored data"
              description="This will delete all data, including designs, content, and other cached files used for offline functionality. If you're offline, you won't be able to use Canva until you're back online."
              buttonLabel="Delete data"
              buttonVariant="critical"
            />
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
