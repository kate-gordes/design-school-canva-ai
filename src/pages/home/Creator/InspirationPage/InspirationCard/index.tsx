import React from 'react';
import { Card, CardImageThumbnail } from '@canva/easel/card';
import { TypeBadge } from '@/pages/Home/Creator/components/Badges';

interface InspirationCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  onClick?: () => void;
  onCreateClick?: (category: string, title: string) => void;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({
  title,
  description,
  image,
  category,
  onClick,
  onCreateClick,
}) => {
  return (
    <>
      <Card
        title={title}
        description={description}
        border="low"
        onClick={() => {
          if (onCreateClick) {
            onCreateClick(category, title);
          } else if (onClick) {
            onClick();
          }
        }}
        thumbnail={
          <CardImageThumbnail src={image} alt="Image description" width="9u" height="9u" />
        }
        layout="horizontal"
        hoverEffect="bgColorTransition"
        hoverBoundary="card"
        selected={false}
        selectableMode="secondary"
        padding="1u"
        content={<TypeBadge type={category} />}
      />
    </>
  );
};
