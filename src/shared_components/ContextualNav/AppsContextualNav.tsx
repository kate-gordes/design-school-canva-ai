import React from 'react';
import { Box, Text, TreeMenu, TreeMenuItem, Spacer } from '@canva/easel';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AppsIcon,
  CalendarIcon,
  ProductPhotosIcon,
  SmartMockupsIcon,
  QrCodeIcon,
} from '@canva/easel/icons';
import styles from './ContextualNav.module.css';

const treeItems = [
  { id: 'all-apps', title: 'All apps', icon: <AppsIcon size="medium" /> },
  { id: 'ai-generation', title: 'AI generation' },
  { id: 'audio-voiceover', title: 'Audio and voiceover' },
  { id: 'communication', title: 'Communication' },
  { id: 'file-data', title: 'File and data management' },
  { id: 'graphic-design', title: 'Graphic design' },
  { id: 'marketing', title: 'Marketing' },
  { id: 'photo-editing', title: 'Photo editing' },
  { id: 'project-management', title: 'Project management' },
  { id: 'text-styling', title: 'Text styling' },
  { id: 'video-animation', title: 'Video and animation' },
];

const recommended = [
  { id: 'dynamic-qr-codes', title: 'Dynamic QR codes', icon: <QrCodeIcon size="medium" /> },
  { id: 'content-planner', title: 'Content Planner', icon: <CalendarIcon size="medium" /> },
  { id: 'product-photos', title: 'Product Photos', icon: <ProductPhotosIcon size="medium" /> },
  { id: 'mockups', title: 'Mockups', icon: <SmartMockupsIcon size="medium" /> },
];

export default function AppsContextualNav(): React.ReactNode {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const selected = category || 'for-you';

  const handleClick = (id: string) => {
    navigate(id === 'for-you' ? '/apps' : `/apps/${id}`);
  };

  return (
    <>
      <TreeMenu
        role="list"
        className={`${styles.itemsList} ${styles.appsTreeMenu}`}
        itemCustomToggleWidth="1u"
        indentation="0"
      >
        {treeItems.map(item => (
          <TreeMenuItem
            key={item.id}
            label={item.title}
            start={item.icon ? <Box className={styles.itemIcon}>{item.icon}</Box> : undefined}
            selected={selected === item.id}
            onClick={() => handleClick(item.id)}
          />
        ))}
      </TreeMenu>
      <Spacer size="3u" />
      <Box className={`${styles.section} ${styles.appsRecommendedSection}`}>
        <Box
          className={styles.sectionHeader}
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
        >
          <Text size="small" weight="bold" className={styles.sectionTitle}>
            Recommended
          </Text>
        </Box>
        <TreeMenu
          role="list"
          className={styles.itemsList}
          itemCustomToggleWidth="1u"
          indentation="0"
        >
          {recommended.map(item => (
            <TreeMenuItem
              key={item.id}
              label={item.title}
              start={<Box className={styles.itemIcon}>{item.icon}</Box>}
            />
          ))}
        </TreeMenu>
      </Box>
    </>
  );
}
