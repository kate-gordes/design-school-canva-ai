import React from 'react';
import { Box, TreeMenu, TreeMenuItem } from '@canva/easel';
import {
  TemplatesTabIcon,
  ImageIcon,
  ElementsIcon,
  HeartFrameIcon,
  StarIcon,
} from '@canva/easel/icons';
import styles from './ContextualNav.module.css';

const items = [
  { id: 'templates', title: 'Templates', icon: <TemplatesTabIcon size="medium" /> },
  { id: 'photos', title: 'Photos', icon: <ImageIcon size="medium" /> },
  { id: 'graphics', title: 'Graphics', icon: <ElementsIcon size="medium" /> },
  { id: 'creators', title: 'Creators', icon: <HeartFrameIcon size="medium" /> },
  { id: 'starred-content', title: 'Starred content', icon: <StarIcon size="medium" /> },
];

export default function TemplatesContextualNav(): React.ReactNode {
  const [selected, setSelected] = React.useState<string>('templates');
  return (
    <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
      {items.map(item => (
        <TreeMenuItem
          key={item.id}
          label={item.title}
          start={<Box className={styles.itemIcon}>{item.icon}</Box>}
          selected={selected === item.id}
          onClick={() => setSelected(item.id)}
        />
      ))}
    </TreeMenu>
  );
}
