import { Box, Placeholder, Rows } from '@canva/easel';
import SectionTitle from '@/shared_components/SectionTitle';
import { Card } from '@canva/easel/card';
import React from 'react';
import MobileCarousel from '@/pages/Home/components/MobileCarousel';
import type { Template } from '@/pages/Home/Templates/data/templateLoader';

interface TemplateSectionCarouselProps {
  title: string;
  cardWidth?: number;
  cardHeight?: number;
  itemCount?: number;
  templates?: Template[];
}

export default function TemplateSectionCarousel({
  title,
  cardWidth = 160,
  cardHeight = 200,
  itemCount = 8,
  templates,
}: TemplateSectionCarouselProps): React.ReactNode {
  // Use provided templates or fall back to placeholder count
  const items = templates?.slice(0, itemCount) ?? Array.from({ length: itemCount });

  return (
    <Box>
      <Rows spacing="2u">
        <Box paddingX="2u">
          <SectionTitle>{title}</SectionTitle>
        </Box>
        <MobileCarousel name={`template-${title.toLowerCase()}`} rows={1} itemGap="12px">
          {items.map((item, index) => {
            const template = templates ? (item as Template) : null;

            return (
              <Card
                key={template?.id ?? index}
                thumbnail={
                  template?.image ? (
                    <div
                      style={{
                        height: cardHeight,
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={template.preview ?? template.image}
                        alt={template.name}
                        style={{
                          height: '100%',
                          width: 'auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <Placeholder shape="sharpRectangle" />
                    </div>
                  )
                }
              />
            );
          })}
        </MobileCarousel>
      </Rows>
    </Box>
  );
}
