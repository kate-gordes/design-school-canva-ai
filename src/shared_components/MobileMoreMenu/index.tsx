import React from 'react';
import { Box, Text, Avatar, Spacer } from '@canva/easel';
import { Sheet } from '@canva/easel/surface/sheet';
import { Menu, MenuItem } from '@canva/easel/menu';
import {
  ChevronRightIcon,
  AppsIcon,
  TrashIcon,
  MegaphoneIcon,
  GraduationHatIcon,
} from '@canva/easel/icons';
import { BrandIcon } from '@/shared_components/icons';
import MagicIcon from '@/pages/Home/components/Wonderbox/icons/MagicIcon';
import styles from './MobileMoreMenu.module.css';

interface MobileMoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMoreMenu({ open, onClose }: MobileMoreMenuProps): React.ReactNode {
  const handleMenuItemClick = (action: string) => {
    console.log(`More menu action: ${action}`);
    // For now, do nothing as per requirements
  };

  return (
    <Sheet open={open} onRequestClose={onClose} size="large">
      <Box className={styles.container}>
        {/* Profile section at top */}
        <Box className={styles.profileSection}>
          <Avatar
            size="small"
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face"
            alt="User avatar"
          />
        </Box>

        <Spacer size="2u" />

        {/* More heading */}
        <Box paddingX="2u">
          <Text size="xlarge" weight="bold">
            More
          </Text>
        </Box>

        <Spacer size="2u" />

        {/* Menu items */}
        <Menu>
          <MenuItem
            onClick={() => handleMenuItemClick('brand')}
            start={<BrandIcon size={24} />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Brand</Text>
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick('canva-ai')}
            start={<MagicIcon size={24} />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Canva AI</Text>
          </MenuItem>

          <MenuItem
            onClick={() => handleMenuItemClick('apps')}
            start={<AppsIcon size="medium" />}
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
            start={<GraduationHatIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Design School</Text>
          </MenuItem>

          <Box className={styles.divider} />

          <MenuItem
            onClick={() => handleMenuItemClick('trash')}
            start={<TrashIcon size="medium" />}
            end={<ChevronRightIcon size="medium" />}
          >
            <Text size="large">Trash</Text>
          </MenuItem>
        </Menu>
      </Box>
    </Sheet>
  );
}
