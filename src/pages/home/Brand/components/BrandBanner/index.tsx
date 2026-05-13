import { Box, Title, Button, Columns, Column } from '@canva/easel';
import { MoreHorizontalIcon, CanvaLetterLogoFilledColorIcon } from '@canva/easel/icons';
import BrandKitSelector from '@/pages/home/Brand/components/BrandKitSelector';
import { useAppContext } from '@/hooks/useAppContext';
import { getBrandKitLogo, getBrandKitImageUrl } from '@/pages/home/Brand/data';
import styles from './BrandBanner.module.css';

export interface BrandBannerProps {
  /** Title text to display */
  title: string;
  /** Whether to show the logo/icon on the left */
  showLogo?: boolean;
  /** Whether to show the more button */
  more?: boolean;
  /** Optional click handler for the more button */
  onMoreClick?: () => void;
  /** Whether to show the brand kit selector */
  showBrandKitSelector?: boolean;
}

export default function BrandBanner({
  title,
  showLogo = true,
  more = false,
  onMoreClick,
  showBrandKitSelector = false,
}: BrandBannerProps) {
  const { selectedBrandKit } = useAppContext();
  const brandKitLogo = getBrandKitLogo(selectedBrandKit);
  return (
    <Box width="full" className={styles.brandBanner}>
      <Columns spacing="2u" alignY="center">
        {/* Left: Logo and Title */}
        <Column>
          <Box display="flex" alignItems="center">
            {showLogo && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={styles.avatarContainer}
              >
                {brandKitLogo ? (
                  <img
                    src={getBrandKitImageUrl(brandKitLogo)}
                    alt={`${selectedBrandKit} logo`}
                    className={styles.brandLogo}
                  />
                ) : (
                  <CanvaLetterLogoFilledColorIcon className={styles.brandLogo} />
                )}
              </Box>
            )}
            <Box paddingStart={showLogo ? '2u' : '0'}>
              <Title size="xlarge">{title}</Title>
            </Box>
          </Box>
        </Column>

        {/* Center: Brand Kit Selector (if enabled) */}
        {showBrandKitSelector && (
          <Column width="content">
            <Box className={styles.selectorContainer}>
              <BrandKitSelector showLabel={false} />
            </Box>
          </Column>
        )}

        {/* Right: More Button */}
        <Column width="content">
          {more && (
            <Button
              className={styles.moreButton}
              variant="tertiary"
              icon={MoreHorizontalIcon}
              aria-label="More options"
              onClick={onMoreClick}
            />
          )}
        </Column>
      </Columns>
    </Box>
  );
}
