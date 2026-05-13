import { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { FormField } from '@canva/easel/form/form_field';
import { Select } from '@canva/easel/form/select';
import { Switch } from '@canva/easel/form/switch';
import sharedStyles from '../shared.module.css';
import styles from './Accessibility.module.css';

type ThemeOption = 'system' | 'light' | 'dark';

export default function Accessibility(): React.ReactNode {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('system');

  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Accessibility
          </Title>
        </Box>

        {/* Theme Section */}
        <Box paddingBottom="1u">
          <Rows spacing="1u">
            <Rows spacing="1u">
              <Text weight="bold">Theme</Text>
              <Text tone="secondary">
                Choose how you'd like Canva to appear. Select a theme, or sync themes with your
                system preferences.
              </Text>
            </Rows>

            <div className={styles.themeCards}>
              {/* Sync with system */}
              <div
                className={`${styles.themeCard} ${selectedTheme === 'system' ? styles.selected : ''}`}
                onClick={() => setSelectedTheme('system')}
              >
                <div className={`${styles.themePreview} ${styles.themePreviewSystem}`}>
                  <div className={styles.themeGradientBar} />
                  <div className={styles.themeContent}>
                    <div className={`${styles.themeWindow} ${styles.themeWindowLight}`} />
                    <div className={`${styles.themeWindow} ${styles.themeWindowDark}`} />
                  </div>
                </div>
                <Text tone="secondary">Sync with system</Text>
              </div>

              {/* Light */}
              <div
                className={`${styles.themeCard} ${selectedTheme === 'light' ? styles.selected : ''}`}
                onClick={() => setSelectedTheme('light')}
              >
                <div className={`${styles.themePreview} ${styles.themePreviewLight}`}>
                  <div className={styles.themeGradientBar} />
                  <div className={styles.themeContent}>
                    <div className={`${styles.themeWindow} ${styles.themeWindowLight}`} />
                    <div className={`${styles.themeWindow} ${styles.themeWindowLight}`} />
                  </div>
                </div>
                <Text tone="secondary">Light</Text>
              </div>

              {/* Dark */}
              <div
                className={`${styles.themeCard} ${selectedTheme === 'dark' ? styles.selected : ''}`}
                onClick={() => setSelectedTheme('dark')}
              >
                <div className={`${styles.themePreview} ${styles.themePreviewDark}`}>
                  <div className={styles.themeGradientBar} />
                  <div className={styles.themeContent}>
                    <div className={`${styles.themeWindow} ${styles.themeWindowDark}`} />
                    <div className={`${styles.themeWindow} ${styles.themeWindowDark}`} />
                  </div>
                </div>
                <Text tone="secondary">Dark</Text>
              </div>
            </div>
          </Rows>
        </Box>

        {/* Shortcuts require modifier */}
        <Box paddingBottom="1u">
          <Columns alignY="start" spacing="2u">
            <Column>
              <Rows spacing="1u">
                <Text weight="bold">Shortcuts require modifier</Text>
                <Text tone="secondary">
                  Single key shortcuts require the use of the ⌥ modifier key
                </Text>
              </Rows>
            </Column>
            <Column width="content">
              <Switch />
            </Column>
          </Columns>
        </Box>

        {/* High color contrast */}
        <Box paddingBottom="1u">
          <Columns alignY="start" spacing="2u">
            <Column>
              <Rows spacing="1u">
                <Text weight="bold">High color contrast</Text>
                <Text tone="secondary">
                  Higher contrast between text and backgrounds maintained, including gradient
                  backgrounds
                </Text>
              </Rows>
            </Column>
            <Column width="content">
              <Switch />
            </Column>
          </Columns>
        </Box>

        {/* Captions */}
        <Box paddingBottom="1u">
          <Columns alignY="start" spacing="2u">
            <Column>
              <Rows spacing="1u">
                <Text weight="bold">Captions</Text>
                <Text tone="secondary">
                  Captions will be generated and displayed for all spoken-word video and audio
                  content throughout Canva
                </Text>
              </Rows>
            </Column>
            <Column width="content">
              <Switch />
            </Column>
          </Columns>
        </Box>

        {/* Autoplay videos */}
        <Box paddingBottom="1u">
          <Box className={styles.selectContainer}>
            <FormField
              label="Autoplay videos"
              control={props => (
                <Select
                  {...props}
                  stretch
                  defaultValue="system"
                  options={[
                    { value: 'system', label: 'Use my system preferences' },
                    { value: 'on', label: 'Autoplay videos on' },
                    { value: 'off', label: 'Autoplay videos off' },
                  ]}
                />
              )}
            />
          </Box>
        </Box>

        {/* Reduce motion */}
        <Box paddingBottom="1u">
          <Rows spacing="1u">
            <Box className={styles.selectContainer}>
              <FormField
                label="Reduce motion when you view and present designs"
                control={props => (
                  <Select
                    {...props}
                    stretch
                    defaultValue="off"
                    options={[
                      { value: 'system', label: 'Use my system preferences' },
                      { value: 'on', label: 'Reduce motion on' },
                      { value: 'off', label: 'Reduce motion off' },
                    ]}
                  />
                )}
              />
            </Box>
            <Text tone="secondary">
              Reduce motion on your screen when you view and present designs. This affects
              transitions, animations, masks, and overlays.
            </Text>
          </Rows>
        </Box>

        {/* Increase on-screen message display time */}
        <Box paddingBottom="1u">
          <Columns alignY="start" spacing="2u">
            <Column>
              <Rows spacing="1u">
                <Text weight="bold">Increase on-screen message display time</Text>
                <Text tone="secondary">On screen messages will stay longer before dismissing</Text>
              </Rows>
            </Column>
            <Column width="content">
              <Switch />
            </Column>
          </Columns>
        </Box>
      </Rows>
    </Box>
  );
}
