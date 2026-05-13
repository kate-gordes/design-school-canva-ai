import { Box, Button, Rows, Inline } from '@canva/easel';
import { Title, Text } from '@canva/easel/typography';
import styles from './HorizontalBanner.module.css';

interface HorizontalBannerProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  primaryActionLabel?: string;
  primaryActionOnClick?: () => void;
  secondaryActionLabel?: string;
  secondaryActionOnClick?: () => void;
}

export default function HorizontalBanner({
  title,
  subtitle,
  backgroundColor = '#E5D4F5',
  imageUrl,
  imageAlt = '',
  primaryActionLabel,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
}: HorizontalBannerProps): React.ReactNode {
  return (
    // Plain <div>s throughout: Easel Box wipes background/margin via reset_f88b8e,
    // which would break the banner's solid color layer, border-radius clipping, and
    // absolutely positioned preview overlay.
    <div className={styles.banner}>
      {/* Background Color — inline style kept because backgroundColor is a runtime
          dynamic prop that can't be expressed as a static CSS Module class. */}
      <div className={styles.background} style={{ backgroundColor }} />

      {/* Image Preview */}
      {imageUrl && (
        <div className={styles.previewContainer}>
          <img src={imageUrl} alt={imageAlt} className={styles.preview} />
        </div>
      )}

      {/* Content */}
      <Box className={styles.content}>
        <Box padding={{ default: '2u', smallUp: '4u' }} className={styles.textContent}>
          <Rows spacing={{ default: '2u', smallUp: '3u' }}>
            <Title size="xlarge" tagName="h1">
              {title}
            </Title>
            {subtitle && <Text size="large">{subtitle}</Text>}
            {(primaryActionLabel || secondaryActionLabel) && (
              <Inline
                spacing={{ default: '0.5u', smallUp: '1u' }}
                align={{ default: 'center', smallUp: 'start' }}
              >
                {primaryActionLabel && (
                  <Button variant="primary" size="large" onClick={primaryActionOnClick}>
                    {primaryActionLabel}
                  </Button>
                )}
                {secondaryActionLabel && (
                  <Button variant="secondary" size="large" onClick={secondaryActionOnClick}>
                    {secondaryActionLabel}
                  </Button>
                )}
              </Inline>
            )}
          </Rows>
        </Box>
      </Box>
    </div>
  );
}
