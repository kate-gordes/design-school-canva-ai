import React from 'react';
import { Box, TreeMenu, TreeMenuItem } from '@canva/easel';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ContextualNav.module.css';

import {
  TemplateIcon,
  LightBulbIcon,
  ElementsIcon,
  ListBulletLtrIcon,
  PrintPhotoBookIcon,
} from '@canva/easel/icons';

const items = [
  {
    id: 'creator-hub',
    title: 'Creators Hub',
    path: '/creator/creators-hub',
    icon: <TemplateIcon />,
  },
  {
    id: 'inspiration',
    title: 'Inspiration',
    path: '/creator/inspiration',
    icon: <LightBulbIcon />,
  },
  {
    id: 'elements-creator',
    title: 'Elements Creator',
    path: '/creator/elements-creator',
    icon: <ElementsIcon />,
  },
  {
    id: 'my-items',
    title: 'My Items',
    path: '/creator/my-items',
    icon: <ListBulletLtrIcon />,
  },
  {
    id: 'resources',
    title: 'Resources',
    path: '/creator/resources',
    icon: <PrintPhotoBookIcon />,
  },
];

export default function CreatorContextualNav(): React.ReactNode {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
      {items.map(item => (
        <TreeMenuItem
          key={item.id}
          label={item.title}
          start={<Box className={styles.itemIcon}>{item.icon}</Box>}
          selected={location.pathname === item.path}
          onClick={() => handleItemClick(item.path)}
        />
      ))}
    </TreeMenu>
  );
}
