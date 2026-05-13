import React, { useState } from 'react';
import { Box } from '@canva/easel';
import { Grid } from '@canva/easel/layout';
import useIsMobile from '@/hooks/useIsMobile';
import { InspirationCard } from '@/pages/Home/Creator/InspirationPage/InspirationCard';
import InspirationCreateMenu from '@/pages/Home/Creator/InspirationPage/InspirationCreateMenu';
import styles from './CreatorInspirationCardSection.module.css';

export interface InspirationData {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  earnAmount?: number;
  badges?: { text: string; tone: 'info' | 'positive' | 'warning' | 'critical' }[];
  timeLeft?: { days: number; unit?: 'DAY' | 'DAYS' | 'HOURS' | 'MINUTES' };
  trendData?: { value: string; percentage: number };
}

interface CreatorInspirationCardSectionProps {
  inspirations: InspirationData[];
  onCardClick?: () => void;
}

const CreatorInspirationCardSection: React.FC<CreatorInspirationCardSectionProps> = ({
  inspirations,
  onCardClick,
}) => {
  const isMobile = useIsMobile();
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [selectedInspiration, setSelectedInspiration] = useState<{
    category: string;
    title: string;
  } | null>(null);

  const handleCreateClick = (category: string, title: string) => {
    setSelectedInspiration({ category, title });
    setCreateMenuOpen(true);
  };

  return (
    <Box className={styles.container}>
      <InspirationCreateMenu
        open={createMenuOpen}
        onClose={() => {
          setCreateMenuOpen(false);
          setSelectedInspiration(null);
        }}
        inspirationCategory={selectedInspiration?.category}
        inspirationTitle={selectedInspiration?.title}
      />
      <Grid columns={{ default: 1, smallUp: 2 }} spacing={isMobile ? '2u' : '3u'}>
        {inspirations.map(inspiration => (
          <InspirationCard
            key={inspiration.id}
            title={inspiration.title}
            description={inspiration.description}
            image={inspiration.image}
            category={inspiration.category}
            onCreateClick={handleCreateClick}
            onClick={onCardClick}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default CreatorInspirationCardSection;
