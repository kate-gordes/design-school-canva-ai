import {
  Box,
  Title,
  Card,
  CardDescription,
  CardImageThumbnail,
  CardTitle,
  Carousel,
  ImageIcon,
  MagicIcon,
  ChevronRightIcon,
  Grid,
  Columns,
  Column,
  Bleed,
  Rows,
} from '@canva/easel';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';
import HomePageLayout from '@/pages/Home/components/HomePageLayout';

import { cdn } from '@/utils/cdn';

const Thumbnail1 = cdn('photos/photo-1.png');
const Thumbnail2 = cdn('photos/photo-2.png');
const Thumbnail3 = cdn('photos/photo-3.png');
const Thumbnail4 = cdn('photos/photo-4.png');
const Thumbnail5 = cdn('photos/photo-5.png');
const Thumbnail6 = cdn('photos/photo-6.png');
const Thumbnail7 = cdn('photos/photo-7.png');
const Thumbnail8 = cdn('photos/photo-8.png');
const Thumbnail9 = cdn('photos/photo-9.png');

type HeroCarouselItem = {
  title: string;
  fileType: string;
  fileSize: string;
  thumbnail: string;
};

const titleOptions = [
  'Urban Sunset',
  'City Life Moments',
  'Skyline Dreams',
  'Metropolitan Vibes',
  'City scape',
];
const fileTypeOptions = ['PNG', 'JPG'];
const thumbnailOptions = [
  Thumbnail1,
  Thumbnail2,
  Thumbnail3,
  Thumbnail4,
  Thumbnail5,
  Thumbnail6,
  Thumbnail7,
  Thumbnail8,
  Thumbnail9,
];

const nameOptions = ['Ash and Carly', 'Carly', 'Andrew'];

function generateThumbnails(size: number, random: boolean = false) {
  return Array.from({ length: size }, (_, i) => {
    return {
      title: random
        ? titleOptions[Math.floor(Math.random() * titleOptions.length)]
        : titleOptions[i % titleOptions.length],
      fileType: fileTypeOptions[Math.floor(Math.random() * fileTypeOptions.length)],
      fileSize: `${(Math.random() * 2 + 1).toFixed(1)}MB`,
      thumbnail: random
        ? thumbnailOptions[Math.floor(Math.random() * thumbnailOptions.length)]
        : thumbnailOptions[i % thumbnailOptions.length],
    };
  });
}

type PeopleCard = {
  title: string;
  mainImage: string;
  rightImages: {
    topRow: string[];
    bottomRow: string[];
  };
};

function generatePeopleCards(size: number) {
  return Array.from({ length: size }, () => {
    let topRowCount = Math.floor(Math.random() * 2) + 1;
    let bottomRowCount = Math.floor(Math.random() * 2) + 1;

    // Guarantee visual asymmetry: at least one row must have 2 items.
    if (topRowCount === 1 && bottomRowCount === 1) {
      if (Math.random() < 0.5) {
        topRowCount = 2;
      } else {
        bottomRowCount = 2;
      }
    }

    const topRowImages = Array.from(
      { length: topRowCount },
      () => thumbnailOptions[Math.floor(Math.random() * thumbnailOptions.length)],
    );

    const bottomRowImages = Array.from(
      { length: bottomRowCount },
      () => thumbnailOptions[Math.floor(Math.random() * thumbnailOptions.length)],
    );

    return {
      title: nameOptions[Math.floor(Math.random() * nameOptions.length)],
      mainImage: thumbnailOptions[Math.floor(Math.random() * thumbnailOptions.length)],
      rightImages: {
        topRow: topRowImages,
        bottomRow: bottomRowImages,
      },
    };
  });
}

const PhotosHeroCarousel: HeroCarouselItem[] = generateThumbnails(9);
const PhotosPeopleCarousel: PeopleCard[] = generatePeopleCards(9);
const PhotosGrid: HeroCarouselItem[] = generateThumbnails(22);

function renderHeroCarousel(result: HeroCarouselItem) {
  return (
    <Card
      key={result.title}
      title={<CardTitle>{result.title}</CardTitle>}
      description={
        <CardDescription lineClamp={1}>
          <ImageIcon />
          {result.fileType} Image • {result.fileSize}
        </CardDescription>
      }
      thumbnail={<CardImageThumbnail height={170} src={result.thumbnail} />}
      layout="vertical"
      hoverEffect="scaleThumbnail"
    />
  );
}

function renderPeopleCarousel(result: PeopleCard, index: number) {
  const isFirst = index === 0;
  const isLast = index === PhotosPeopleCarousel.length - 1;

  return (
    <Box
      key={index}
      paddingTop="2u"
      paddingBottom="4u"
      paddingStart={isFirst ? '2u' : '0'}
      paddingEnd={isLast ? '2u' : '0'}
    >
      <Box shadow="surface" borderRadius="element" padding="2u">
        <Columns spacing="2u">
          <Column>
            <Box paddingEnd="0">
              <Card
                thumbnail={<CardImageThumbnail height={180} src={result.mainImage} />}
                layout="vertical"
                hoverEffect="scaleThumbnail"
              />
            </Box>
          </Column>
          <Column>
            <Box>
              <Rows spacing="2u">
                <Grid columns={result.rightImages.topRow.length as 1 | 2} spacingX="2u">
                  {result.rightImages.topRow.map((image, index) => (
                    <Card
                      key={`top-${index}`}
                      thumbnail={<CardImageThumbnail height={82} src={image} />}
                      layout="vertical"
                      hoverEffect="scaleThumbnail"
                    />
                  ))}
                </Grid>

                <Grid columns={result.rightImages.bottomRow.length as 1 | 2} spacingX="2u">
                  {result.rightImages.bottomRow.map((image, index) => (
                    <Card
                      key={`bottom-${index}`}
                      thumbnail={<CardImageThumbnail height={82} src={image} />}
                      layout="vertical"
                      hoverEffect="scaleThumbnail"
                    />
                  ))}
                </Grid>
              </Rows>
            </Box>
          </Column>
        </Columns>
      </Box>
    </Box>
  );
}

export default function Photos(): JSX.Element {
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  return (
    <HomePageLayout gradientHeight={0}>
      <Box paddingTop="2u" paddingBottom="2u">
        <Carousel
          gutter="medium"
          expand="medium"
          buttonVariant="circular"
          name="Hero Carousel"
          buttonsHorizontalOffsetPx={20}
        >
          {PhotosHeroCarousel.map(renderHeroCarousel)}
        </Carousel>
      </Box>
      <Box paddingTop="2u" paddingBottom="2u">
        <Title tagName="span" lineClamp={1} tone="primary" size="medium">
          <MagicIcon size="large" />
          <span> People </span>
          <ChevronRightIcon size="large" />
        </Title>
      </Box>
      <Box>
        <Bleed tagName="div" x="2u">
          <Carousel
            gutter="medium"
            expand="medium"
            buttonVariant="circular"
            name="People Carousel"
            buttonsHorizontalOffsetPx={20}
          >
            {PhotosPeopleCarousel.map(renderPeopleCarousel)}
          </Carousel>
        </Bleed>
      </Box>
      <Box paddingTop="2u" paddingBottom="2u">
        <Grid
          columns={{ default: 1, smallUp: 3, mediumUp: 5 }}
          alignX="center"
          spacingX="2u"
          spacingY="2u"
        >
          {PhotosGrid.map(thumbnail => renderHeroCarousel(thumbnail))}
        </Grid>
      </Box>
    </HomePageLayout>
  );
}
