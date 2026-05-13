import { Box, Rows, Text } from '@canva/easel';
import SectionTitle from '@/shared_components/SectionTitle';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileCarousel from '@/pages/Home/components/MobileCarousel';
import { templatesDoctypeCategories } from '../DoctypeTile/doctypeCategories';
import styles from './TemplateTypeCarousel.module.css';

interface TemplateTypeCarouselProps {
  title?: string;
}

export default function TemplateTypeCarousel({
  title = 'Explore templates',
}: TemplateTypeCarouselProps): React.ReactNode {
  const navigate = useNavigate();

  return (
    // Plain <div>: Easel Box resets all margins via reset_f88b8e, wiping the
    // negative margin-top that pulls this section up from the Rows gap.
    <div className={styles.section}>
      <Rows spacing="2u">
        <Box paddingX="2u">
          <SectionTitle>{title}</SectionTitle>
        </Box>
        <MobileCarousel name="template-types" rows={2} itemsPerRow={10} rowGap="12px" itemGap="8px">
          {templatesDoctypeCategories.map(type => (
            // Plain <button>: Easel Button forces its own min-height + background
            // reset, wiping the gradient tile preview below.
            <button key={type.id} className={styles.item} onClick={() => navigate(type.route)}>
              {/* Plain <div>: Easel Box resets background via reset_f88b8e,
                  wiping the per-tile `gradientStart` color. */}
              <div className={styles.thumb} style={{ background: type.gradientStart }}>
                {type.imagePath && (
                  <img src={type.imagePath} alt={type.label} className={styles.image} />
                )}
              </div>
              <Text size="small" className={styles.label}>
                {type.label}
              </Text>
            </button>
          ))}
        </MobileCarousel>
      </Rows>
    </div>
  );
}
