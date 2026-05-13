import {
  Card,
  CardButtonGroup,
  CardImageThumbnail,
  CardMenuButton,
  MoreHorizontalIcon,
} from '@canva/easel';

export interface BrandAssetsCardProps {
  title: string;
  image: string;
  onClick?: () => void;
}

export const BrandAssetsCard: React.FC<BrandAssetsCardProps> = ({ title, image, onClick }) => {
  return (
    <Card
      title={title}
      layout="vertical"
      thumbnail={<CardImageThumbnail src={image} alt={title} aspectRatio={4 / 3} />}
      onClick={onClick || (() => {})}
      hoverEffect="scaleThumbnail"
      borderRadius="element"
      decorators={
        <>
          <CardButtonGroup location="top-end" transition="slide">
            <CardMenuButton
              ariaLabel="More actions: Title"
              flyoutContent={<></>}
              icon={MoreHorizontalIcon}
            />
          </CardButtonGroup>
        </>
      }
    />
  );
};
