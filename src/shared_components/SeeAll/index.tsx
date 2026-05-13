import { Text } from '@canva/easel';
import styles from './SeeAll.module.css';

interface SeeAllProps {
  onClick?: () => void;
}

export default function SeeAll({ onClick }: SeeAllProps) {
  // Raw <button>: Easel Button enforces its own typography, padding, and border
  // treatment. This "See all" affordance is a link-style trigger rendering Easel
  // Text, so a stripped-down native button preserves the Text's intended visual.
  return (
    <button onClick={onClick} className={styles.button} type="button">
      <Text size="small" tone="secondary" weight="bold">
        See all
      </Text>
    </button>
  );
}
