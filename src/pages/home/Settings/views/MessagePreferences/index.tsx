import { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column, Avatar } from '@canva/easel';
import { Switch } from '@canva/easel/form/switch';
import sharedStyles from '../shared.module.css';
import styles from './MessagePreferences.module.css';

type FrequencyOption = 'all' | 'weekly' | 'monthly' | 'snooze';
type ChannelOption = 'both' | 'notifications' | 'email';

interface TopicCardProps {
  title: string;
  description: string;
  checked?: boolean;
}

function TopicCard({ title, description, checked = false }: TopicCardProps) {
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <Box className={styles.topicCard} padding="1u">
      <Columns spacing="1u" alignY="center">
        <Column width="content">
          <Box className={styles.imagePlaceholder} />
        </Column>
        <Column>
          <Rows spacing="0">
            <Text weight="bold">{title}</Text>
            <Text tone="secondary">{description}</Text>
          </Rows>
        </Column>
        <Column width="content">
          <Switch defaultValue={isChecked} onChange={setIsChecked} />
        </Column>
      </Columns>
    </Box>
  );
}

export default function MessagePreferences(): React.ReactNode {
  const [optedIn, setOptedIn] = useState(true);
  const [frequency, setFrequency] = useState<FrequencyOption>('all');
  const [channel, setChannel] = useState<ChannelOption>('both');

  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Rows spacing="1u">
            <Title size="large" alignment="center">
              Message preferences
            </Title>
            <Text tone="secondary" alignment="center">
              We'll always update you on critical account information, but you control the marketing
              content you receive.
            </Text>
          </Rows>
        </Box>

        {/* Marketing Communications */}
        <Box paddingTop="4u" paddingBottom="2u">
          <Rows spacing="2u">
            <Rows spacing="0.5u">
              <Title size="small" className={sharedStyles.sectionTitle}>
                {optedIn
                  ? "You've opted in to marketing communications"
                  : "You've opted out of marketing communications"}
              </Title>
              <Text
                tone="secondary"
                size="small"
                weight="regular"
                className={styles.marketingDescription}
              >
                {optedIn
                  ? "You're receiving offers, updates, and other marketing communications about Canva and all of our products, including Affinity."
                  : "You're not receiving marketing communications about Canva and our products."}
              </Text>
            </Rows>
            <div className={styles.segmentedControlNarrow}>
              <button
                className={`${styles.segmentButton} ${optedIn ? styles.segmentButtonActive : ''}`}
                onClick={() => setOptedIn(true)}
              >
                Opt in
              </button>
              <button
                className={`${styles.segmentButton} ${!optedIn ? styles.segmentButtonActive : ''}`}
                onClick={() => setOptedIn(false)}
              >
                Opt out
              </button>
            </div>
          </Rows>
        </Box>

        {/* Topics Card */}
        <Box className={styles.topicsContainer} paddingBottom="2u">
          <Rows spacing="2u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              What Canva topics interest you?
            </Title>

            <div className={styles.topicsGrid}>
              <TopicCard title="What's New" description="Canva news and releases" checked={true} />
              <TopicCard
                title="Recommendations"
                description="Templates and features just for you"
                checked={true}
              />
              <TopicCard
                title="Design School"
                description="Tips and design courses"
                checked={true}
              />
              <TopicCard
                title="Design Challenges"
                description="Practice your design skills"
                checked={true}
              />
              <TopicCard
                title="Achievements"
                description="Celebrate design milestones"
                checked={true}
              />
              <TopicCard
                title="Special Days"
                description="Holiday and occasion messages"
                checked={true}
              />
            </div>

            {/* Message Frequency */}
            <Box paddingTop="2u">
              <Rows spacing="1.5u">
                <Title size="small" className={sharedStyles.sectionTitle}>
                  Choose your message frequency
                </Title>
                <div className={styles.segmentedControl}>
                  {(['all', 'weekly', 'monthly', 'snooze'] as FrequencyOption[]).map(option => (
                    <button
                      key={option}
                      className={`${styles.segmentButton} ${frequency === option ? styles.segmentButtonActive : ''}`}
                      onClick={() => setFrequency(option)}
                    >
                      {option === 'all'
                        ? 'All'
                        : option === 'weekly'
                          ? 'Weekly'
                          : option === 'monthly'
                            ? 'Monthly'
                            : 'Snooze for 3 months'}
                    </button>
                  ))}
                </div>
              </Rows>
            </Box>

            {/* Channel Preference */}
            <Box paddingTop="2u">
              <Rows spacing="1.5u">
                <Title size="small" className={sharedStyles.sectionTitle}>
                  Choose how you hear from us
                </Title>
                <div className={styles.segmentedControl}>
                  {(['both', 'notifications', 'email'] as ChannelOption[]).map(option => (
                    <button
                      key={option}
                      className={`${styles.segmentButton} ${channel === option ? styles.segmentButtonActive : ''}`}
                      onClick={() => setChannel(option)}
                    >
                      {option === 'both'
                        ? 'Both'
                        : option === 'notifications'
                          ? 'Notifications'
                          : 'Email'}
                    </button>
                  ))}
                </div>
              </Rows>
            </Box>
          </Rows>
        </Box>

        {/* Canva Team Section */}
        <Box paddingTop="4u" paddingBottom="6u" className={sharedStyles.divider}>
          <Rows spacing="2u">
            <Columns spacing="2u" alignY="center">
              <Column width="content">
                <Avatar name="CT" size="medium" />
              </Column>
              <Column>
                <Rows spacing="0">
                  <Title size="small" className={sharedStyles.sectionTitle}>
                    Canva Team
                  </Title>
                  <Text tone="secondary">
                    Choose which emails you receive from your team's activity.
                  </Text>
                </Rows>
              </Column>
            </Columns>

            <Box paddingTop="2u">
              <Rows spacing="2u">
                <Text weight="bold">Notify me when:</Text>

                <Columns alignY="start" spacing="2u">
                  <Column>
                    <Text>Someone joins the team</Text>
                  </Column>
                  <Column width="content">
                    <Switch defaultValue={true} />
                  </Column>
                </Columns>

                <Columns alignY="start" spacing="2u">
                  <Column>
                    <Text>Someone requests for you to review their design</Text>
                  </Column>
                  <Column width="content">
                    <Switch defaultValue={true} />
                  </Column>
                </Columns>
              </Rows>
            </Box>
          </Rows>
        </Box>

        {/* Contact Preferences */}
        <Box paddingTop="2u" paddingBottom="2u">
          <Rows spacing="2u">
            <Title size="medium" className={sharedStyles.sectionTitle}>
              Contact Preferences
            </Title>

            <Columns alignY="start" spacing="2u">
              <Column>
                <Rows spacing="1u">
                  <Text weight="bold" size="medium">
                    Research opportunities
                  </Text>
                  <Text tone="secondary">
                    Opt in for opportunities to participate in research that helps to improve and
                    provide our service
                  </Text>
                </Rows>
              </Column>
              <Column width="content">
                <Switch defaultValue={true} />
              </Column>
            </Columns>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
