import { Box } from '@canva/easel';
import styles from './UserAvatar.module.css';

export default function UserAvatar() {
  return (
    <Box
      width="32px"
      height="32px"
      borderRadius="full"
      background="surfaceSubtle"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box as="span" className={styles.avatarInitial}>
        U
      </Box>
    </Box>
  );
}
