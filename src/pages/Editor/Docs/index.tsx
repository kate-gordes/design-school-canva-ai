import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import styles from './docs.module.css';
import Block from './components/Block';
import DocsToolbar from './components/DocsToolbar';
import MobileDocsToolbar from './components/MobileDocsToolbar';
import MobileDocsActionsSheet from './components/MobileDocsActionsSheet';
import { blocks, activeBlockId, toggleConfigPanel } from '@/store';
import useIsMobile from '@/hooks/useIsMobile';

export default function DocsDoctype(): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const showDebugTools = searchParams.has('config');

  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains(styles.docsScroll)) {
      const lastBlock = blocks.value[blocks.value.length - 1];
      if (lastBlock) {
        activeBlockId.value = lastBlock.blockId;
      }
    }
  };

  return (
    <Box className={styles.docsArea}>
      {!isMobile && (
        <div className={styles.docsToolbarContainer}>
          <DocsToolbar />
        </div>
      )}
      <div className={styles.docsScroll} onClick={handleBackgroundClick}>
        <div className={styles.docsContainer}>
          <div className={styles.blocksWrapper}>
            {blocks.value.map((block, index) => (
              <Block
                key={block.blockId}
                block={block}
                isActive={activeBlockId.value === block.blockId}
                isFirst={index === 0}
                isLast={index === blocks.value.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
      {!isMobile && showDebugTools && (
        <div className={styles.floatingBar}>
          <button className={styles.floatingConfigButton} onClick={toggleConfigPanel}>
            Config
          </button>
        </div>
      )}
      {isMobile && <MobileDocsToolbar />}
      {isMobile && <MobileDocsActionsSheet />}
    </Box>
  );
}
