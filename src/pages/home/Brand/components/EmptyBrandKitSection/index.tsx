import React from 'react';
import { Box, Title, Text, Button, Rows } from '@canva/easel';
import { OpenInNewIcon } from '@canva/easel/icons';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './EmptyBrandKitSection.module.css';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';

export interface EmptyBrandKitSectionProps {
  /** The category name (e.g., "Charts", "Icons", "Graphics") */
  categoryName: string;
  /** The image URL to display */
  imageUrl: string;
  /** The main title text */
  title: string;
  /** The description text */
  description: string;
  /** Button text */
  buttonText?: string;
  /** Button click handler */
  onButtonClick?: () => void;
}

export default function EmptyBrandKitSection({
  categoryName,
  imageUrl,
  title,
  description,
  buttonText = 'Show who I can ask',
  onButtonClick,
}: EmptyBrandKitSectionProps): React.ReactNode {
  const isMobile = useIsMobile();

  return (
    <Box width="full">
      {/* On mobile, MobileBrand already shows the category title */}
      {!isMobile && (
        <BrandHeader
          title={categoryName}
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => {}}
          onMoreClick={() => {}}
        />
      )}

      <Box
        width="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="8u"
        className={styles.container}
      >
        <Box display="flex" alignItems="center" justifyContent="center" className={styles.content}>
          <Rows spacing="2u" align="center">
            {/* Category Image */}
            <Box display="flex" justifyContent="center">
              <img
                src={imageUrl}
                alt={`${categoryName} illustration`}
                className={styles.categoryImage}
              />
            </Box>

            {/* Text Content */}
            <Rows spacing="2u" align="center">
              <Title size="medium" className={styles.title} alignment="center">
                {title}
              </Title>

              <Text
                size="medium"
                tone="secondary"
                className={styles.description}
                alignment="center"
              >
                {description}
              </Text>
            </Rows>

            {/* Action Button */}
            <Box display="flex" justifyContent="center">
              <Button
                variant="secondary"
                icon={OpenInNewIcon}
                onClick={onButtonClick}
                className={styles.actionButton}
              >
                {buttonText}
              </Button>
            </Box>
          </Rows>
        </Box>
      </Box>
    </Box>
  );
}
