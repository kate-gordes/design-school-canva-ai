import { Box, Rows, Text, Title } from '@canva/easel';
import { Button } from '@canva/easel/button';
import { Alert } from '@canva/easel/alert';
import { Link } from '@canva/easel/link';
import sharedStyles from '../shared.module.css';

export default function Login(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Login
          </Title>
        </Box>

        {/* Login Section */}
        <Box paddingBottom="2u" className={sharedStyles.divider}>
          <Rows spacing="0.3u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Login
            </Title>
            <Alert tone="info">
              You cannot change your password because your account is managed by your organization.
            </Alert>
          </Rows>
        </Box>

        {/* Security Section */}
        <Box paddingBottom="2u">
          <Rows spacing="2u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Security
            </Title>

            {/* Sign out from all devices */}
            <Box paddingBottom="2u" className={sharedStyles.divider}>
              <Rows spacing="2u">
                <Rows spacing="1u">
                  <Text weight="bold">Sign out from all devices</Text>
                  <Text tone="secondary">
                    Logged in on a shared device but forgot to sign out? End all sessions by signing
                    out from all devices.
                  </Text>
                </Rows>
                <Button variant="secondary" fullWidth>
                  Sign out from all devices
                </Button>
              </Rows>
            </Box>

            {/* Download your Canva team uploads and designs */}
            <Box paddingBottom="2u" className={sharedStyles.divider}>
              <Rows spacing="2u">
                <Rows spacing="1u">
                  <Text weight="bold">Download your Canva team uploads and designs</Text>
                  <Text tone="secondary">
                    You can request to download the uploads and designs of your Canva team(s) here.
                  </Text>
                  <Text tone="secondary">
                    Note: Team uploads and designs are managed by the team owner, as described in
                    our <Link href="#">Terms of Use</Link>. Only the team owner can download uploads
                    and designs made in a team. If you're not the team owner these will not be
                    included in your download.
                  </Text>
                </Rows>
                <Button variant="secondary" fullWidth>
                  Request to download
                </Button>
              </Rows>
            </Box>

            {/* Delete your account */}
            <Box>
              <Rows spacing="2u">
                <Text weight="bold">Delete your account</Text>
                <Alert tone="info">You don't have permission to delete your account.</Alert>
                <Button variant="secondary" disabled fullWidth>
                  Delete account
                </Button>
                <Text tone="secondary">
                  If you want to be <Link href="#">removed</Link> from your team{' '}
                  <Text tagName="span" weight="bold">
                    Canva Team
                  </Text>{' '}
                  instead, contact your team <Link href="#">administrator</Link>.
                </Text>
              </Rows>
            </Box>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
