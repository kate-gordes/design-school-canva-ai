import React from 'react';
import { FlyoutMenu, FlyoutMenuItem } from '@canva/easel/flyout_menu';
import { Text, Box, Spacer, Button, Checkbox } from '@canva/easel';
import {
  ChevronRightIcon,
  MoreHorizontalIcon,
  ToolkitSocialFilledIcon,
  ToolkitPrintFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitVideoFilledIcon,
  ToolkitWebsiteFilledIcon,
  ToolkitWhiteboardFilledIcon,
  CustomSizeIcon,
  MagicTranslateGradientIcon,
  MagicSwitchGradientIcon,
} from '@canva/easel/icons';
import { RegularSearch } from '@/shared_components/Search';
import ResizeButton from '@/shared_components/Header/ResizeButton';
import SeeAll from '@/shared_components/SeeAll';
import styles from './ResizeMenu.module.css';

export const ResizeMenu: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({
    '1000x1920': false,
    'instagram-story': false,
    'instagram-post': false,
    'website': false,
    'whiteboard': false,
  });

  const handleMenuItemClick = (action: string) => {
    console.log(`Resize menu action: ${action}`);
  };

  const handleCheckboxToggle = (itemKey: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <FlyoutMenu
      trigger={props => (
        <ResizeButton
          pressed={props.pressed}
          ariaControls={props.ariaControls}
          ariaHasPopup={props.ariaHasPopup}
          onClick={props.onClick}
        />
      )}
    >
      <Box className={styles.resizeMenuContent}>
        {/* Scrollable Content */}
        <Box className={styles.scrollableContent}>
          {/* Search */}
          <Box className={styles.firstMenuSection}>
            <RegularSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search resize options"
            />
          </Box>

          {/* Suggested */}
          <Box className={styles.menuSection}>
            <Box className={styles.sectionHeader}>
              <Text size="small" tone="secondary" weight="bold">
                Suggested
              </Text>
              <SeeAll onClick={() => handleMenuItemClick('see-all-suggested')} />
            </Box>
          </Box>

          <FlyoutMenuItem
            onClick={() => handleCheckboxToggle('1000x1920')}
            start={<Checkbox checked={checkedItems['1000x1920']} />}
          >
            <Box display="flex" flexDirection="column">
              <Text size="medium">1000 × 1920 px</Text>
            </Box>
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleCheckboxToggle('instagram-story')}
            start={<Checkbox checked={checkedItems['instagram-story']} />}
          >
            <Box display="flex" flexDirection="column">
              <Text size="medium">Instagram Story</Text>
              <Text size="small" tone="secondary">
                1080 × 1920 px
              </Text>
            </Box>
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleCheckboxToggle('instagram-post')}
            start={<Checkbox checked={checkedItems['instagram-post']} />}
          >
            <Box display="flex" flexDirection="column">
              <Text size="medium">Instagram Post (4:5)</Text>
              <Text size="small" tone="secondary">
                1080 × 1350 px
              </Text>
            </Box>
          </FlyoutMenuItem>

          {/* Browse by category */}
          <Box className={styles.menuSection}>
            <Text size="small" weight="bold">
              Browse by category
            </Text>
          </Box>

          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('custom-size')}
            start={<CustomSizeIcon size="medium" />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Custom size
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('social-media')}
            start={<ToolkitSocialFilledIcon size="medium" tone="critical" />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Social media
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('print-products')}
            start={<ToolkitPrintFilledIcon size="medium" className={styles.purpleIcon} />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Print products
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('presentations')}
            start={<ToolkitPresentationFilledIcon size="medium" className={styles.orangeIcon} />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Presentations
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('videos')}
            start={<ToolkitVideoFilledIcon size="medium" className={styles.magentaIcon} />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Videos
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleCheckboxToggle('website')}
            start={<Checkbox checked={checkedItems['website']} />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            <Box display="flex" alignItems="center">
              <ToolkitWebsiteFilledIcon size="medium" className={styles.blueIcon} />
              <Spacer size="1u" />
              <Text size="medium">Website</Text>
            </Box>
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleCheckboxToggle('whiteboard')}
            start={<Checkbox checked={checkedItems['whiteboard']} />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            <Box display="flex" alignItems="center">
              <ToolkitWhiteboardFilledIcon size="medium" className={styles.greenIcon} />
              <Spacer size="1u" />
              <Text size="medium">Whiteboard</Text>
            </Box>
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('more')}
            start={<MoreHorizontalIcon size="medium" />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            More
          </FlyoutMenuItem>

          {/* Magic Switch */}
          <Box className={styles.menuSection}>
            <Text size="small" weight="bold">
              Magic Switch
            </Text>
          </Box>

          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('translate')}
            start={<MagicTranslateGradientIcon size="medium" />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Translate
          </FlyoutMenuItem>
          <FlyoutMenuItem
            onClick={() => handleMenuItemClick('transform-doc')}
            start={<MagicSwitchGradientIcon size="medium" />}
            end={<ChevronRightIcon size="medium" tone="secondary" />}
          >
            Transform into Doc
          </FlyoutMenuItem>
        </Box>

        {/* Fixed Footer */}
        <Box className={styles.footer}>
          <Box className={styles.menuSection}>
            <Button
              variant="primary"
              size="small"
              onClick={() => handleMenuItemClick('copy-resize')}
              className={styles.footerButton}
              stretch
              disabled
            >
              Copy & resize
            </Button>
            <Spacer size="1u" />
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleMenuItemClick('resize-design')}
              className={styles.footerButton}
              stretch
              disabled
            >
              Resize this design
            </Button>
          </Box>
        </Box>
      </Box>
    </FlyoutMenu>
  );
};
