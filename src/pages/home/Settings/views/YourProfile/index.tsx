import { Box, Rows, Text, Title, Columns, Column, Avatar } from '@canva/easel';
import { Button } from '@canva/easel/button';
import { Alert } from '@canva/easel/alert';
import { FormField } from '@canva/easel/form/form_field';
import { Select } from '@canva/easel/form/select';
import { Switch } from '@canva/easel/form/switch';
import { Link } from '@canva/easel/link';
import sharedStyles from '../shared.module.css';
import styles from './YourProfile.module.css';

export default function YourProfile(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box paddingBottom="0.2u">
          <Title size="large" alignment="center">
            Your profile
          </Title>
        </Box>

        {/* Organization notice */}
        <Box paddingBottom="3u">
          <Text tone="secondary">Your account is managed by your organization.</Text>
        </Box>

        {/* Profile Photo Section */}
        <Box paddingBottom="3u" className={sharedStyles.divider}>
          <Rows spacing="2u">
            <Box display="flex" justifyContent="center">
              <Avatar
                size="xxlarge"
                name="Valentina Solis"
                photo="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face"
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Button variant="secondary" fullWidth>
                Edit photo
              </Button>
            </Box>
          </Rows>
        </Box>

        {/* SSO Alert */}
        <Alert tone="info">
          Your account is managed by your organization. Contact your admin to update your name in
          your SSO identity provider.
        </Alert>

        {/* Name Field */}
        <Box paddingBottom="2u" className={sharedStyles.divider}>
          <Rows spacing="2u">
            <Text weight="bold">Name</Text>
            <Text>Valentina Solis</Text>
          </Rows>
        </Box>

        {/* Email Alert */}
        <Alert tone="info">
          You cannot change your email address because your account is managed by your organization.
        </Alert>

        {/* Email Address Field */}
        <Box paddingBottom="2u" className={sharedStyles.divider}>
          <Rows spacing="2u">
            <Text weight="bold">Email address</Text>
            <Text>valentina.solis@canva.com</Text>
          </Rows>
        </Box>

        {/* What will you be using Canva for? */}
        <Box paddingBottom="2u" className={sharedStyles.divider}>
          <Box className={styles.selectContainer}>
            <FormField
              label="What will you be using Canva for?"
              control={props => (
                <Select
                  {...props}
                  stretch
                  options={[
                    { value: '', label: 'Select an option' },
                    { value: 'personal', label: 'Personal' },
                    { value: 'small-business', label: 'Small business' },
                    { value: 'large-company', label: 'Large company' },
                    { value: 'education', label: 'Education' },
                    { value: 'nonprofit', label: 'Nonprofit' },
                  ]}
                />
              )}
            />
          </Box>
        </Box>

        {/* Language */}
        <Box paddingBottom="2u" className={sharedStyles.divider}>
          <Box className={styles.selectContainer}>
            <FormField
              label="Language"
              control={props => (
                <Select
                  {...props}
                  stretch
                  defaultValue="en-US"
                  options={[
                    { value: 'en-US', label: 'English (US)' },
                    { value: 'en-GB', label: 'English (UK)' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' },
                    { value: 'de', label: 'Deutsch' },
                    { value: 'pt-BR', label: 'Português (Brasil)' },
                    { value: 'ja', label: '日本語' },
                    { value: 'zh-CN', label: '中文 (简体)' },
                  ]}
                />
              )}
            />
          </Box>
        </Box>

        {/* Connected social accounts */}
        <Box paddingBottom="2u">
          <Rows spacing="2u">
            <Rows spacing="1u">
              <Text weight="bold">Connected social accounts</Text>
              <Text tone="secondary">Services that you use to log in to Canva</Text>
            </Rows>

            <Box className={styles.cardBox}>
              <Columns spacing="2u" alignY="center">
                <Column width="content">
                  <Box className={styles.iconBox}>
                    <Text className={styles.googleIcon}>G</Text>
                  </Box>
                </Column>
                <Column>
                  <Rows spacing="1u">
                    <Text weight="bold">Google</Text>
                    <Text tone="secondary">Valentina Solis</Text>
                  </Rows>
                </Column>
                <Column width="content">
                  <Button variant="secondary">Disconnect</Button>
                </Column>
              </Columns>
            </Box>
          </Rows>
        </Box>

        {/* Integrations connected to Canva */}
        <Box paddingBottom="2u">
          <Rows spacing="2u">
            <Text weight="bold">Integrations connected to Canva</Text>

            <Box className={styles.cardBox}>
              <Columns spacing="2u" alignY="center">
                <Column width="content">
                  <Box className={styles.iconBox}>
                    <Text className={styles.integrationIcon}>⋮⋮⋮</Text>
                  </Box>
                </Column>
                <Column>
                  <Text weight="bold">Affinity 2</Text>
                </Column>
                <Column width="content">
                  <Button variant="secondary">Disconnect</Button>
                </Column>
              </Columns>
            </Box>

            <Box className={styles.cardBox}>
              <Columns spacing="2u" alignY="center">
                <Column width="content">
                  <Box className={styles.iconBox}>
                    <Text className={styles.integrationIcon}>⋮⋮⋮</Text>
                  </Box>
                </Column>
                <Column>
                  <Text weight="bold">CMD cursor proto</Text>
                </Column>
                <Column width="content">
                  <Button variant="secondary">Disconnect</Button>
                </Column>
              </Columns>
            </Box>

            <Box className={styles.cardBox}>
              <Columns spacing="2u" alignY="center">
                <Column width="content">
                  <Box className={styles.iconBox}>
                    <svg className={styles.slackIcon} viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
                        fill="#E01E5A"
                      />
                      <path
                        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
                        fill="#E01E5A"
                      />
                      <path
                        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
                        fill="#36C5F0"
                      />
                      <path
                        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
                        fill="#2EB67D"
                      />
                      <path
                        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
                        fill="#ECB22E"
                      />
                    </svg>
                  </Box>
                </Column>
                <Column>
                  <Text weight="bold">Canva Slack Integration</Text>
                </Column>
                <Column width="content">
                  <Button variant="secondary">Disconnect</Button>
                </Column>
              </Columns>
            </Box>
          </Rows>
        </Box>

        {/* Link opening */}
        <Box paddingBottom="1u">
          <Rows spacing="2u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Link opening
            </Title>

            <Columns alignY="start" spacing="2u">
              <Column>
                <Rows spacing="1u">
                  <Text weight="bold">Open designs in a new tab</Text>
                  <Text tone="secondary">
                    Designs in the web browser will always open in a new tab.
                  </Text>
                </Rows>
              </Column>
              <Column width="content">
                <Switch defaultValue={true} />
              </Column>
            </Columns>

            <Columns alignY="start" spacing="2u">
              <Column>
                <Rows spacing="1u">
                  <Text weight="bold">Open links in Desktop App</Text>
                  <Text tone="secondary">
                    Canva links are opened in the Desktop App instead of the web browser.
                  </Text>
                </Rows>
              </Column>
              <Column width="content">
                <Switch />
              </Column>
            </Columns>
          </Rows>
        </Box>

        {/* Video editing */}
        <Box paddingBottom="1u">
          <Rows spacing="2u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Video editing
            </Title>

            <Columns alignY="start" spacing="2u">
              <Column>
                <Rows spacing="1u">
                  <Text weight="bold">Use new multi-track video editor (beta)</Text>
                  <Text tone="secondary">
                    New video designs are opened in the beta editor.{' '}
                    <Link href="#">Learn more</Link>.
                  </Text>
                </Rows>
              </Column>
              <Column width="content">
                <Switch defaultValue={true} />
              </Column>
            </Columns>
          </Rows>
        </Box>

        {/* Staff Beta */}
        <Box>
          <Rows spacing="2u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Staff Beta
            </Title>

            <Columns alignY="start" spacing="2u">
              <Column>
                <Rows spacing="1u">
                  <Text weight="bold">'Staff Beta' mode</Text>
                  <Text tone="secondary">
                    Access upcoming features in their developmental stage. Dive into the creative
                    chaos, provide feedback, and be a part of shaping the future of Canva.
                  </Text>
                </Rows>
              </Column>
              <Column width="content">
                <Switch defaultValue={true} />
              </Column>
            </Columns>

            <Box className={styles.selectContainer}>
              <FormField
                label="Staff Launch Horizon"
                description="Choose which upcoming launch horizon you wish to preview. This allows you to experience features as they will appear in future releases."
                control={props => (
                  <Select
                    {...props}
                    stretch
                    options={[
                      { value: 'off', label: 'Off' },
                      { value: 'h1', label: 'H1 2026' },
                      { value: 'h2', label: 'H2 2026' },
                    ]}
                    defaultValue="off"
                  />
                )}
              />
            </Box>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
