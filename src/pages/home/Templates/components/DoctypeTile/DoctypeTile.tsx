import { Box, Text } from '@canva/easel';
import styles from './DoctypeTile.module.css';

interface DoctypeTileProps {
  label: string;
  gradientStart: string;
  gradientEnd: string;
  imagePath?: string;
  onClick: () => void;
  doctypeId: string;
}

// Determine if a doctype has portrait or landscape content
const isPortraitDoctype = (doctypeId: string): boolean => {
  const portraitDoctypes = [
    'doc',
    'instagram-post',
    'instagram-story',
    'poster',
    'flyer',
    'email',
    'resume',
    'invitation',
    'mobile-video',
    'menu',
    'twitter-post',
    'linkedin-post',
    'pinterest-pin',
  ];
  return portraitDoctypes.includes(doctypeId);
};

export default function DoctypeTile({
  label,
  gradientStart,
  imagePath,
  onClick,
  doctypeId,
}: DoctypeTileProps) {
  const isPortrait = isPortraitDoctype(doctypeId);

  return (
    <div
      className={styles.tile}
      onClick={onClick}
      style={{
        background: gradientStart,
      }}
    >
      <Box className={styles.tileContent}>
        <Text size="medium" weight="bold">
          {label}
        </Text>
      </Box>
      {imagePath && (
        <div
          className={`${styles.tileImage} ${isPortrait ? styles.portraitContainer : styles.landscapeContainer}`}
        >
          <img
            src={imagePath}
            alt={label}
            className={`${styles.image} ${isPortrait ? styles.portrait : styles.landscape}`}
          />
        </div>
      )}
    </div>
  );
}
