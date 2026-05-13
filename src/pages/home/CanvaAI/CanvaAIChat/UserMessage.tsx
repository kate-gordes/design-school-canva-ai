import { Text, Inline } from '@canva/easel';
import styles from './CanvaAIChat.module.css';

interface UserMessageProps {
  message: string;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <Inline spacing="0" align="end">
      <Text className={styles.userMessage}>{message}</Text>
    </Inline>
  );
}
