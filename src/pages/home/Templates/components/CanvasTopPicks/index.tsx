import { Box, Carousel, Rows } from '@canva/easel';
import SectionTitle from '@/shared_components/SectionTitle';
import styles from './CanvasTopPicks.module.css';

interface TopPick {
  id: string;
  label: string;
  gradient: string;
  imageUrl: string;
}

const picks: TopPick[] = [
  {
    id: 'short-videos',
    label: 'Hook users with short videos',
    gradient: 'linear-gradient(135deg, #B284FF 0%, #8E48FF 100%)',
    imageUrl: 'https://template.canva.com/EAFywxbYMTY/3/0/400w-OS7hbHYpxXU.jpg',
  },
  {
    id: 'canva-code',
    label: 'Build with Canva Code',
    gradient: 'linear-gradient(135deg, #2DC0CF 0%, #1A4F75 100%)',
    imageUrl: 'https://template.canva.com/EAFOcqN3nr0/1/0/400w-WugYxponV44.jpg',
  },
  {
    id: 'social-ads',
    label: 'Grow with Social Ads',
    gradient: 'linear-gradient(135deg, #FF8A4C 0%, #FF5A1F 100%)',
    imageUrl: 'https://template.canva.com/EAFT99KyCKU/1/0/400w-KSXajBA3IqU.jpg',
  },
  {
    id: 'print-shop',
    label: 'Create with Print Shop',
    gradient: 'linear-gradient(135deg, #FF5A8A 0%, #E02A5F 100%)',
    imageUrl: 'https://template.canva.com/EAE6bXuvGH0/8/0/400w-PEbNMm_8ITU.jpg',
  },
  {
    id: 'brand-system',
    label: 'Design once, scale instantly',
    gradient: 'linear-gradient(135deg, #E36BFF 0%, #B638FF 100%)',
    imageUrl: 'https://template.canva.com/EAGFO71PaMo/1/0/400w-TdizjuDbDuE.jpg',
  },
  {
    id: 'magic-design',
    label: 'Magic Design in seconds',
    gradient: 'linear-gradient(135deg, #6B8AFF 0%, #3B5BDB 100%)',
    imageUrl: 'https://template.canva.com/EADinqjp-vg/3/0/400w-PEbNMm_8ITU.jpg',
  },
  {
    id: 'docs-pro',
    label: 'Write faster with Canva Docs',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #0E7C3F 100%)',
    imageUrl: 'https://template.canva.com/EAFywxbYMTY/3/0/400w-OS7hbHYpxXU.jpg',
  },
];

export default function CanvasTopPicks(): React.ReactNode {
  return (
    <Box width="full">
      <Rows spacing="2u">
        <Box className={styles.header}>
          <SectionTitle>Canva's top picks</SectionTitle>
          <button type="button" className={styles.seeAll}>
            See all
          </button>
        </Box>
        <Carousel name="canvas-top-picks" gutter="large" buttonVariant="circular">
          {picks.map(pick => (
            <button
              key={pick.id}
              type="button"
              className={styles.card}
              style={{ background: pick.gradient }}
            >
              <span className={styles.label}>{pick.label}</span>
              <div className={styles.imageContainer}>
                <img src={pick.imageUrl} alt="" className={styles.image} />
              </div>
            </button>
          ))}
        </Carousel>
      </Rows>
    </Box>
  );
}
