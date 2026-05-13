import { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { Switch } from '@canva/easel/form/switch';
import { Alert } from '@canva/easel/alert';
import { Link } from '@canva/easel/link';
import { LockClosedIcon } from '@canva/easel/icons';
import sharedStyles from '../shared.module.css';
import styles from './PrivacyControls.module.css';

interface PrivacyCardProps {
  title: string;
  description: string;
  enabled?: boolean;
  locked?: boolean;
  learnMoreUrl?: string;
  children?: React.ReactNode;
}

function PrivacyCard({
  title,
  description,
  enabled = false,
  locked = false,
  learnMoreUrl,
  children,
}: PrivacyCardProps) {
  const [isOn, setIsOn] = useState(enabled);

  return (
    <Box className={sharedStyles.settingsCard}>
      <Rows spacing="1u">
        <div className={styles.cardLayout}>
          <div className={styles.textColumn}>
            <Box className={!isOn ? sharedStyles.disabledContent : undefined}>
              <Rows spacing="1u">
                <Text weight="bold">{title}</Text>
                <Text tone="secondary">
                  {description}
                  {learnMoreUrl && (
                    <>
                      {' '}
                      <Link href={learnMoreUrl}>Learn more</Link>
                    </>
                  )}
                </Text>
              </Rows>
            </Box>
          </div>
          <div className={styles.toggleColumn}>
            <Columns spacing="1u" alignY="center">
              {locked && <LockClosedIcon size="small" />}
              <Switch defaultValue={enabled} onChange={setIsOn} />
            </Columns>
          </div>
        </div>
        {children}
      </Rows>
    </Box>
  );
}

export default function PrivacyControls(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Privacy controls
          </Title>
        </Box>

        {/* Subtitle */}
        <Text tone="secondary">
          You're always in control of your settings and can manage them here any time.{' '}
          <Link href="#">Learn more.</Link>
        </Text>

        {/* AI general usage */}
        <PrivacyCard
          title="AI-powered features can learn and improve with your general usage"
          description="When this setting is on, Canva and our trusted partners will use information about your general usage to help AI-powered features learn and improve. This includes how you interact and create with Canva products, but not your content."
          enabled={false}
          locked={true}
        />

        {/* AI content */}
        <PrivacyCard
          title="AI-powered features can learn and improve with your content"
          description="When this setting is on, Canva and our trusted partners will use your content to help AI-powered features learn and improve. This includes your videos, images, files, other uploads, and your text in designs. It does not include your content in the Affinity app."
          enabled={false}
          locked={true}
        >
          <Alert tone="info">
            This only applies to the team you're logged in to. Switch accounts to control settings
            for other teams.
          </Alert>
        </PrivacyCard>

        {/* Marketing communications */}
        <PrivacyCard
          title="Personalize your marketing communications"
          description="When this setting is on, Canva will use your information to personalize marketing communications."
          enabled={true}
        />

        {/* Ads on other websites */}
        <PrivacyCard
          title="Personalize Canva ads on other websites"
          description="Canva may use my profile and analytics data to show me personalized ads about Canva when I am browsing on other apps and websites."
          enabled={true}
        />

        {/* Enhanced profile */}
        <PrivacyCard
          title="Enhanced profile with information from 3rd party providers"
          description="When this setting is on, Canva will enrich your profile by collecting additional information about you from third-party providers to offer tailored recommendations"
          enabled={true}
        />

        {/* Share design usage */}
        <PrivacyCard
          title="Share my design usage with collaborators"
          description="Share my usage and activity data with the editors or owners of the designs that I interact with via Design Insights."
          enabled={true}
          learnMoreUrl="#"
        />

        {/* Session recording */}
        <PrivacyCard
          title="Allow your sessions to be recorded"
          description="By opting in, we'll be able to make and view recordings of how you use Canva which we may use for product discovery and improvement purposes. We won't be able to see your financial info, passwords, or email and all of your recordings are deleted 3 months after they're made."
          enabled={false}
          locked={true}
        />

        {/* Footer links */}
        <Box paddingTop="2u">
          <Rows spacing="2u">
            <Text tone="secondary">
              For updating marketing messaging settings, visit{' '}
              <Link href="/settings?view=message-preferences">Messaging Preferences</Link>.
            </Text>
            <Text tone="secondary">
              To update cookies settings, visit <Link href="#">Manage Cookies</Link>.
            </Text>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
