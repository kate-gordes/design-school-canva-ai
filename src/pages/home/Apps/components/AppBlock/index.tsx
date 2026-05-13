import React from 'react';
import { Box, Columns, Column, Text, Rows } from '@canva/easel';
import { ImageWithPlaceholder } from '@/pages/Home/components/ImageWithPlaceholder';
import styles from './AppBlock.module.css';

export interface AppBlockData {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconAlt: string;
  onClick?: () => void;
}

export interface AppBlockProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconAlt: string;
  onClick?: () => void;
}

const AppBlock: React.FC<AppBlockProps> = ({ name, description, icon, iconAlt, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Box
      className={styles.appBlock}
      onClick={handleClick}
      padding="2u"
      borderRadius="elementStandard"
      background="surface"
    >
      <Columns spacing="2u" alignY="start">
        <Column width="content">
          <Box className={styles.iconContainer}>
            <ImageWithPlaceholder src={icon} alt={iconAlt} className={styles.appIcon} />
          </Box>
        </Column>
        <Column>
          <Rows spacing="0.5u">
            <Text size="medium" weight="bold">
              {name}
            </Text>
            <Text size="small" tone="secondary">
              {description}
            </Text>
          </Rows>
        </Column>
      </Columns>
    </Box>
  );
};

export default AppBlock;
