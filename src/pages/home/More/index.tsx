import React from 'react';
import { Box, Text } from '@canva/easel';
import { Menu, MenuItem } from '@canva/easel/menu';
import {
  ChevronRightIcon,
  AppsPlusIcon,
  TrashIcon,
  MegaphoneIcon,
  DesignSchoolIcon,
  BrandSwatchIcon,
  CogIcon,
} from '@canva/easel/icons';
import useIsMobile from '@/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import styles from './More.module.css';
import MobilePageLayout from '@/pages/Home/components/MobilePageLayout';

export default function More(): React.ReactNode {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isMobile) {
      navigate('/');
    }
  }, [isMobile, navigate]);

  if (!isMobile) {
    return null;
  }

  const handleMenuItemClick = (action: string) => {
    console.log(`More menu action: ${action}`);

    if (action === 'brand') {
      navigate('/brand');
    } else if (action === 'apps') {
      navigate('/apps');
    } else if (action === 'grow') {
      navigate('/grow');
    } else if (action === 'design-school') {
      navigate('/design-school');
    } else if (action === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <MobilePageLayout title="More" showSearch={false} showAvatar={true}>
      <Box>
        <Menu className={styles.menu}>
          <MenuItem
            onClick={() => handleMenuItemClick('brand')}
            start={<BrandSwatchIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Brand</Text>
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick('apps')}
            start={<AppsPlusIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Apps</Text>
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick('grow')}
            start={<MegaphoneIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Grow</Text>
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick('design-school')}
            start={<DesignSchoolIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Design School</Text>
          </MenuItem>

          <Box className={styles.divider} />

          <MenuItem
            onClick={() => handleMenuItemClick('settings')}
            start={<CogIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Settings</Text>
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick('trash')}
            start={<TrashIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Trash</Text>
          </MenuItem>
        </Menu>
      </Box>
    </MobilePageLayout>
  );
}
