import React, { useState, useEffect } from 'react';
import { Box, Rows, Pill, Text } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { ChevronDownIcon, PlusIcon, SearchIcon, SortIcon } from '@canva/easel/icons';
import GradientBanner from '@/shared_components/GradientBanner';
import MobilePageTitle from '@/shared_components/MobilePageTitle';
import SectionTitle from '@/shared_components/SectionTitle';
import MobileSearchBox from '@/pages/Home/components/MobileSearchBox';
import MobileCarousel from '@/pages/Home/components/MobileCarousel';
import MobileProjectRow from '@/pages/Home/Projects/components/MobileProjectRow';
import MobileFolderRow from '@/pages/Home/Projects/components/MobileFolderRow';
import { useAppContext } from '@/hooks/useAppContext';
import { useDesigns } from '@/hooks/useDesigns';
import { useConnectLoading } from '@/hooks/useConnectLoading';
import { SkeletonDesignCard, SkeletonFolderCard } from '@/shared_components/SkeletonCards';
import { type RecentDesign } from '@/data/data';
import styles from './MobileProjectsPage.module.css';

const AVATAR_POOL = [
  { backgroundColor: '#F55353', name: 'Jane Doe' },
  { backgroundColor: '#FEB139', name: 'Jason Bull' },
  { backgroundColor: '#7B61FF', name: 'Mira Chen' },
  { backgroundColor: '#00B3A4', name: 'Alex Kim' },
  { backgroundColor: '#FF7AC6', name: 'Sam Lee' },
];

function collaboratorsFor(seed: string, count: number) {
  const start = seed.charCodeAt(seed.length - 1) % AVATAR_POOL.length;
  return Array.from({ length: count }, (_, i) => AVATAR_POOL[(start + i) % AVATAR_POOL.length]);
}

interface FilterPill {
  id: string;
  label: string;
}

const filterPills: FilterPill[] = [
  { id: 'type', label: 'Type' },
  { id: 'category', label: 'Category' },
  { id: 'creator', label: 'Creator' },
  { id: 'date', label: 'Date modified' },
];

// Subset of recent designs, each annotated with a collaborator count for display
interface RecentRow {
  design: RecentDesign;
  collaboratorCount: number;
}

const RECENT_COLLABORATOR_COUNTS = [4, 16, 2, 5, 1, 0];

function buildRecentRows(designs: RecentDesign[]): RecentRow[] {
  return designs.slice(0, RECENT_COLLABORATOR_COUNTS.length).map((design, i) => ({
    design,
    collaboratorCount: RECENT_COLLABORATOR_COUNTS[i],
  }));
}

interface AllItemsFolder {
  id: string;
  name: string;
  isPrivate?: boolean;
  itemCount?: number;
  collaboratorCount?: number;
  starred?: boolean;
}

const allItemsFolders: AllItemsFolder[] = [
  { id: 'uploads', name: 'Uploads', isPrivate: true },
  { id: 'creative-tech', name: 'Creative Technology', collaboratorCount: 5, itemCount: 14 },
  { id: 'areas', name: 'Areas', isPrivate: true, itemCount: 1 },
  { id: 'projects', name: 'Projects', isPrivate: true, itemCount: 10, starred: true },
  { id: 'coaching', name: 'Coaching', isPrivate: true, itemCount: 1 },
  {
    id: 'role-profiles',
    name: 'Role Profiles - Design Specialty',
    collaboratorCount: 11,
    itemCount: 5,
  },
  { id: 'archive', name: 'Archive', isPrivate: true, itemCount: 20 },
  { id: 'canva-code', name: 'Canva Code', isPrivate: true, itemCount: 8 },
  { id: 'interactive', name: 'How to create Interactive Prototypes with …', itemCount: 0 },
];

export default function MobileProjectsPage(): React.ReactNode {
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const designs = useDesigns();
  const recentRows = buildRecentRows(designs);
  const isLoading = useConnectLoading();

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  useEffect(() => {
    const el = document.querySelector('[data-mobile-scroll-container="true"]');
    if (!el) return;

    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Sticky header that appears on scroll */}
      <div className={`${styles.stickyHeader} ${scrolled ? styles.stickyHeaderVisible : ''}`}>
        <span className={styles.stickyTitle}>
          <Text size="medium" weight="bold">
            All projects
          </Text>
        </span>
        <button type="button" className={styles.stickyIconButton} aria-label="Search">
          <SearchIcon size="medium" />
        </button>
      </div>

      <div className={styles.container} data-mobile-scroll-container="true">
        <GradientBanner />

        <div className={styles.contentWrapper}>
          <MobilePageTitle
            renderTitleWrapper={title => (
              <button
                type="button"
                className={styles.titleButton}
                onClick={() => console.log('Switch projects scope')}
              >
                {title}
                <span className={styles.titleChevron}>
                  <ChevronDownIcon size="small" />
                </span>
              </button>
            )}
            actions={
              <button
                type="button"
                className={styles.plusButton}
                onClick={() => console.log('Add new clicked')}
                aria-label="Add new"
              >
                <PlusIcon size="medium" />
              </button>
            }
          >
            All projects
          </MobilePageTitle>

          {/* Search */}
          <MobileSearchBox placeholder="Search across all content" />

          {/* Filter pills */}
          <Box width="full" className={styles.pillsArea}>
            <MobileCarousel name="projects-filter-pills" gutter="small" buttonVariant="chevron">
              {filterPills.map(pill => (
                <Pill
                  key={pill.id}
                  size="medium"
                  text={pill.label}
                  end={<ChevronDownIcon size="small" />}
                  selected={selectedPill === pill.id}
                  onClick={() => setSelectedPill(selectedPill === pill.id ? null : pill.id)}
                />
              ))}
            </MobileCarousel>
          </Box>

          {/* Recents */}
          <Box paddingX="2u" paddingTop="3u">
            <Rows spacing="4u">
              <Box width="full">
                <div className={styles.sectionHeader}>
                  <SectionTitle>Recents</SectionTitle>
                  <BasicButton onClick={() => console.log('Switch view')} aria-label="Switch view">
                    <ViewGridIcon />
                  </BasicButton>
                </div>

                <div className={styles.rowList}>
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonDesignCard key={i} index={i} />
                      ))
                    : recentRows.map(({ design, collaboratorCount }) => (
                        <MobileProjectRow
                          key={design.id}
                          design={design}
                          collaborators={collaboratorsFor(design.id, collaboratorCount)}
                          onClick={() => console.log('Open recent:', design.title)}
                          onMenuClick={() => console.log('Menu recent:', design.title)}
                        />
                      ))}
                </div>

                <div className={styles.seeAllWrapper}>
                  <button type="button" className={styles.seeAllButton}>
                    See all recents
                  </button>
                </div>
              </Box>

              {/* All items */}
              <Box width="full">
                <div className={`${styles.sectionHeader} ${styles.sectionHeaderBordered}`}>
                  <SectionTitle>All items</SectionTitle>
                  <BasicButton onClick={() => console.log('Sort clicked')} aria-label="Sort">
                    <SortIcon size="medium" />
                  </BasicButton>
                </div>

                <div className={styles.rowList}>
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonFolderCard key={i} index={i} />
                      ))
                    : allItemsFolders.map(folder => (
                        <MobileFolderRow
                          key={folder.id}
                          title={folder.name}
                          isPrivate={folder.isPrivate}
                          itemCount={folder.itemCount}
                          starred={folder.starred}
                          collaborators={
                            folder.collaboratorCount
                              ? collaboratorsFor(folder.id, folder.collaboratorCount)
                              : undefined
                          }
                          onClick={() => console.log('Open folder:', folder.name)}
                          onMenuClick={() => console.log('Menu folder:', folder.name)}
                        />
                      ))}
                </div>
              </Box>
            </Rows>
          </Box>
        </div>
      </div>
    </>
  );
}

function ViewGridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  );
}
