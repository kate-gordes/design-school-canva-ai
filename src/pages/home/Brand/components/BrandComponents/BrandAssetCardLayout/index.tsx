import { Grid, Title } from '@canva/easel';
import { BrandAssetsCard } from '@/pages/home/Brand/components/BrandAssetsCard';
import useIsMobile from '@/hooks/useIsMobile';

export interface BrandAssetCardItem {
  id: string;
  title: string;
  image: string;
  view: string;
}

export interface BrandAssetCardLayoutProps {
  /** Section title/heading to display */
  title: string;
  /** Array of card items to display */
  items: BrandAssetCardItem[];
  /** Optional custom CSS class for the title */
  titleClassName?: string;
  /** Optional callback when a card is clicked */
  onCardClick?: (view: string) => void;
}

export const BrandAssetCardLayout: React.FC<BrandAssetCardLayoutProps> = ({
  title,
  items,
  titleClassName,
  onCardClick,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {title && (
        <Title size="medium" className={titleClassName}>
          {title}
        </Title>
      )}
      <Grid columns={{ default: 2, smallUp: 3, mediumUp: 4, largeUp: 4 }} spacing="1u">
        {items.map(item => (
          <BrandAssetsCard
            key={item.id}
            title={item.title}
            image={item.image}
            onClick={onCardClick ? () => onCardClick(item.view) : undefined}
          />
        ))}
      </Grid>
    </>
  );
};
