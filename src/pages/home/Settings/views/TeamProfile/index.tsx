import React from 'react';
import { Box, Rows, Text, Title } from '@canva/easel';
import CanvaLogoIcon from '@/shared_components/icons/CanvaLogoIcon';
import sharedStyles from '../shared.module.css';
import styles from './TeamProfile.module.css';

export default function TeamProfile(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Team profile
          </Title>
        </Box>

        {/* Logo and home banner */}
        <Box>
          <Rows spacing="0.5u">
            <Text weight="bold">Logo and home banner</Text>
            <Box className={styles.logoContainer}>
              <CanvaLogoIcon size={90} />
            </Box>
          </Rows>
        </Box>

        {/* Divider */}
        <Box className={sharedStyles.divider} />

        {/* Name */}
        <Box>
          <Rows spacing="0.5u">
            <Text weight="bold">Name</Text>
            <Text>Canva Team</Text>
          </Rows>
        </Box>

        {/* Divider */}
        <Box className={sharedStyles.divider} />

        {/* Description */}
        <Box>
          <Rows spacing="0.5u">
            <Text weight="bold">Description</Text>
            <Text tone="secondary">No team description</Text>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
