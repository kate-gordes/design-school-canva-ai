import { Box, Carousel, Rows } from '@canva/easel';
import { PlayFilledIcon } from '@canva/easel/icons';
import SectionTitle from '@/shared_components/SectionTitle';
import styles from './MeetAiVideoEffects.module.css';

interface AiEffect {
  id: string;
  label: string;
  imageUrl: string;
}

// Visual stand-ins sourced from existing video template thumbnails.
const effects: AiEffect[] = [
  {
    id: 'cloud-cruise',
    label: 'Cloud Cruise',
    imageUrl: 'https://template.canva.com/EAFywxbYMTY/3/0/400w-OS7hbHYpxXU.jpg',
  },
  {
    id: 'photo-booth',
    label: 'Photo Booth',
    imageUrl: 'https://template.canva.com/EAFOcqN3nr0/1/0/400w-WugYxponV44.jpg',
  },
  {
    id: 'anime-portrait',
    label: 'Anime Portrait',
    imageUrl: 'https://template.canva.com/EAFT99KyCKU/1/0/400w-KSXajBA3IqU.jpg',
  },
  {
    id: 'copy-machine',
    label: 'Copy Machine',
    imageUrl: 'https://template.canva.com/EAGFO71PaMo/1/0/400w-TdizjuDbDuE.jpg',
  },
  {
    id: 'felt-doll',
    label: 'Felt Doll',
    imageUrl: 'https://template.canva.com/EAE6bXuvGH0/8/0/400w-PEbNMm_8ITU.jpg',
  },
  {
    id: 'pixel-art',
    label: 'Pixel Art',
    imageUrl: 'https://template.canva.com/EAFywxbYMTY/3/0/400w-OS7hbHYpxXU.jpg',
  },
  {
    id: 'oil-painting',
    label: 'Oil Painting',
    imageUrl: 'https://template.canva.com/EAFOcqN3nr0/1/0/400w-WugYxponV44.jpg',
  },
];

export default function MeetAiVideoEffects(): React.ReactNode {
  return (
    <Box width="full">
      <Rows spacing="2u">
        <Box className={styles.header}>
          <SectionTitle>Meet AI video effects</SectionTitle>
          <button type="button" className={styles.seeAll}>
            See all
          </button>
        </Box>
        <Carousel name="ai-video-effects" gutter="large" buttonVariant="circular">
          {effects.map(effect => (
            <div key={effect.id} className={styles.item}>
              <div className={styles.thumbnail}>
                <img src={effect.imageUrl} alt={effect.label} />
                <span className={styles.playBadge}>
                  <PlayFilledIcon size="small" />
                </span>
              </div>
              <span className={styles.label}>{effect.label}</span>
            </div>
          ))}
        </Carousel>
      </Rows>
    </Box>
  );
}
