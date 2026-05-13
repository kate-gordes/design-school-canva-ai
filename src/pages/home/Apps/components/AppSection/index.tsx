import React from 'react';
import { Box, Rows, Text, Grid } from '@canva/easel';
import { AppCard } from '@/pages/Home/components/CardThumbnails';
import SectionTitle from '@/shared_components/SectionTitle';
import styles from './AppSection.module.css';

export interface AppSectionData {
  title: string;
  description: string;
  thumbnail: string;
  onClick?: () => void;
  onMenuClick?: () => void;
}

export interface AppSectionProps {
  title: string;
  subtitle?: string;
  apps: AppSectionData[];
  className?: string;
  showSeeAll?: boolean;
  onSeeAllClick?: () => void;
  loading?: boolean;
  emptyStateMessage?: string;
  limitApps?: boolean; // New prop to limit to 3 apps by default
}

const AppSection: React.FC<AppSectionProps> = ({
  title,
  subtitle,
  apps,
  className,
  showSeeAll = false,
  onSeeAllClick,
  loading = false,
  emptyStateMessage = 'No apps available at the moment.',
  limitApps = false,
}) => {
  const [showAllApps, setShowAllApps] = React.useState(false);
  const renderContent = () => {
    if (loading) {
      return (
        <Grid columns={{ default: 1, smallUp: 2, mediumUp: 3 }} spacing="2u">
          {Array.from({ length: 6 }).map((_, index) => (
            <Box key={index} className={styles.placeholder}>
              <div className={styles.placeholderShimmer} />
            </Box>
          ))}
        </Grid>
      );
    }

    if (apps.length === 0) {
      return (
        <Box className={styles.emptyState} padding="4u" alignItems="center" justifyContent="center">
          <Text size="medium" tone="secondary" alignment="center">
            {emptyStateMessage}
          </Text>
        </Box>
      );
    }

    // Determine which apps to show based on limitApps prop and showAllApps state
    const appsToShow = limitApps && !showAllApps ? apps.slice(0, 3) : apps;

    return (
      <Grid columns={{ default: 1, smallUp: 2, mediumUp: 3 }} spacing="2u">
        {appsToShow.map((appData, index) => (
          <AppCard
            key={index}
            app={{
              title: appData.title,
              description: appData.description,
              thumbnail: appData.thumbnail,
            }}
            onClick={appData.onClick}
            onMenuClick={appData.onMenuClick}
          />
        ))}
      </Grid>
    );
  };

  return (
    <Box className={className} width="full">
      <Rows spacing="3u">
        {/* Header Section */}
        <Rows spacing="1u">
          <Box className={styles.headerContainer}>
            <SectionTitle>{title}</SectionTitle>
            {(showSeeAll || (limitApps && apps.length > 3)) && (
              <div
                className={styles.seeAllLink}
                onClick={() => {
                  if (limitApps) {
                    setShowAllApps(!showAllApps);
                  } else if (onSeeAllClick) {
                    onSeeAllClick();
                  }
                }}
              >
                <Text size="medium">
                  {limitApps && apps.length > 3
                    ? showAllApps
                      ? 'Show less'
                      : 'See all'
                    : 'See all'}
                </Text>
              </div>
            )}
          </Box>
          {subtitle && (
            <Text size="medium" tone="secondary">
              {subtitle}
            </Text>
          )}
        </Rows>

        {/* Content Section */}
        {renderContent()}
      </Rows>
    </Box>
  );
};

export default AppSection;
