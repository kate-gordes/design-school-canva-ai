import { Box, Title } from '@canva/easel';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import { Button } from '@canva/easel/button';
import { useAppContext } from '@/hooks/useAppContext';
import { getBrandKitLogo, getBrandKitImageUrl } from '@/pages/Home/Brand/data';
import CanvaLogoIcon from '@/shared_components/icons/CanvaLogoIcon';
import useIsMobile from '@/hooks/useIsMobile';
import styles from '../../../Brand.module.css';

export default function BrandPageBanner(): React.ReactNode {
  const isMobile = useIsMobile();
  const { selectedBrandKit } = useAppContext();
  const brandKitLogo = getBrandKitLogo(selectedBrandKit);

  // On mobile, MobileBrand already provides the banner/header
  if (isMobile) return null;

  return (
    <Box width="full">
      <Box className={styles.contentArea}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {/* Left section - logo */}
          <Box display="flex" alignItems="center" justifyContent="end">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className={styles.brandKitLogo}
            >
              {brandKitLogo ? (
                <img
                  src={getBrandKitImageUrl(brandKitLogo)}
                  alt={`${selectedBrandKit} logo`}
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
              ) : (
                <CanvaLogoIcon size={48} />
              )}
            </Box>
          </Box>

          {/* Center section - title (always centered) */}
          <Title size="large" tagName="h3" className={styles.pageTitle} alignment="center">
            {selectedBrandKit}
          </Title>

          {/* Right section - button */}
          <Box display="flex" alignItems="center" justifyContent="start">
            <Button
              variant="tertiary"
              icon={MoreHorizontalIcon}
              aria-label="More options"
              onClick={() => console.log('More options')}
            />
          </Box>
        </div>
      </Box>
    </Box>
  );
}
