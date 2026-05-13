import { Text, Inline } from '@canva/easel';
import styles from './CanvaAIChat.module.css';

interface AssistantMessageProps {
  message: string;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  return (
    <Inline spacing="0" align="start">
      <Text className={styles.assistantMessage}>{message}</Text>
    </Inline>
  );
}
