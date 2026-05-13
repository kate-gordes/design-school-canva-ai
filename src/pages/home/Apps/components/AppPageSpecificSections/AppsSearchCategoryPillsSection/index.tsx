import { Box, Columns, Column, Button } from '@canva/easel';
import { RegularSearch } from '@/shared_components/Search';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AppsSearchCategoryPillsSection.module.css';

const categories: { label: string; slug: string }[] = [
  { label: 'For you', slug: 'for-you' },
  { label: 'AI generation', slug: 'ai-generation' },
  { label: 'Audio and voiceover', slug: 'audio-voiceover' },
  { label: 'Communication', slug: 'communication' },
  { label: 'File and data management', slug: 'file-data' },
  { label: 'Graphic design', slug: 'graphic-design' },
  { label: 'Marketing', slug: 'marketing' },
  { label: 'Photo editing', slug: 'photo-editing' },
  { label: 'Project management', slug: 'project-management' },
  { label: 'Text styling', slug: 'text-styling' },
  { label: 'Video and animation', slug: 'video-animation' },
  { label: 'All apps', slug: 'all-apps' },
];

export default function AppsSearchCategoryPillsSection(): React.ReactNode {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const selectedSlug = category || 'for-you';

  const handleClick = (slug: string) => {
    navigate(slug === 'for-you' ? '/apps' : `/apps/${slug}`);
  };

  return (
    <Box width="full">
      <Columns spacing="3u" align="start" alignY="center">
        <Column width="content">
          <Box className={styles.searchContainer}>
            <RegularSearch
              placeholder="Search apps"
              value={searchValue}
              onChange={setSearchValue}
              showPopover={false}
              suggestions={[]}
              onSuggestionClick={() => {}}
            />
          </Box>
        </Column>
        <Column>
          {/* plain div: needs custom flex+overflow-x scroll behavior that Box resets interfere with */}
          <div className={styles.categoryFilters}>
            {categories.map(({ label, slug }) => (
              <Button
                variant="secondary"
                key={slug}
                selected={selectedSlug === slug}
                onClick={() => handleClick(slug)}
                className={styles.categoryButton}
              >
                {label}
              </Button>
            ))}
          </div>
        </Column>
      </Columns>
    </Box>
  );
}
