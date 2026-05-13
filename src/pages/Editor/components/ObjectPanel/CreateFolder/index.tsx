import React from 'react';
import { Box, Text, Spacer, Button } from '@canva/easel';
import { FolderIcon } from '@canva/easel/icons';
import organizeUploadsImage from '@/pages/Editor/assets/organize-uploads.webp';
import styles from './CreateFolder.module.css';

interface CreateFolderProps {
  onCreateFolder?: () => void;
}

export default function CreateFolder({ onCreateFolder }: CreateFolderProps): React.ReactNode {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" className={styles.container}>
      {/* Illustration */}
      <div className={styles.illustration}>
        <img
          src={organizeUploadsImage}
          alt="Organize your uploads"
          className={styles.illustrationImage}
        />
      </div>

      <Spacer size="2u" />

      {/* Title */}
      <Text weight="bold" size="large" alignment="center">
        Organize your uploads
      </Text>

      <Spacer size="1u" />

      {/* Description */}
      <Text tone="secondary" size="medium" alignment="center" className={styles.description}>
        Keep your uploads neatly organized by moving them into folders.
      </Text>

      <Spacer size="2u" />

      {/* Create Folder Button */}
      <Button variant="secondary" onClick={onCreateFolder} alignment="center">
        <FolderIcon size="medium" /> Create folder
      </Button>
    </Box>
  );
}
