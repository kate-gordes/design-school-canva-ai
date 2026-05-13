import { Box, Title, Button } from '@canva/easel';
import { PlusIcon, MoreHorizontalIcon } from '@canva/easel/icons';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './BrandHeader.module.css';

export interface BrandHeaderProps {
  /** Heading text to display on the left */
  title: string;
  /** Whether to show the "Add new" button */
  showAddNew?: boolean;
  /** Whether to show the more (three dots) button */
  showMore?: boolean;
  /** Optional click handler for the "Add new" button */
  onAddNewClick?: () => void;
  /** Optional click handler for the more button */
  onMoreClick?: () => void;
}

export default function BrandHeader({
  title,
  showAddNew = true,
  showMore = true,
  onAddNewClick,
  onMoreClick,
}: BrandHeaderProps) {
  const isMobile = useIsMobile();

  // On mobile, MobileBrand already provides the page title
  if (isMobile) return null;
  return (
    <Box
      width="full"
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      paddingBottom="4u"
      className={styles.brandHeader}
    >
      <Title size="large">{title}</Title>

      <Box display="flex" alignItems="center" className={styles.buttonGroup}>
        {showAddNew && (
          <Button variant="secondary" icon={PlusIcon} onClick={onAddNewClick} aria-label="Add new">
            Add new
          </Button>
        )}

        {showMore && (
          <Button
            variant="secondary"
            icon={MoreHorizontalIcon}
            aria-label="More options"
            onClick={onMoreClick}
            className={styles.moreButton}
          />
        )}
      </Box>
    </Box>
  );
}
