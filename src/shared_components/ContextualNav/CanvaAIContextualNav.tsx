import React from 'react';
import { Box, Text, TreeMenu, TreeMenuItem, Button } from '@canva/easel';
import { MessageSquarePlusIcon, MessageSquareIcon } from '@canva/easel/icons';
import { useNavigate } from 'react-router-dom';
import {
  todayChats,
  thisWeekChats,
  thisMonthChats,
  earlierChats,
  type ChatItem,
} from '@/data/data';
import styles from './ContextualNav.module.css';

function Section({ title, items }: { title: string; items: ChatItem[] }) {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/ai/thread/07aCand54d2a-4250-4e64-90b0-efc0a69dfd7a');
  };

  return (
    <Box className={styles.chatSection}>
      <Box
        className={styles.chatSectionHeader}
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        paddingY="0.5u"
      >
        <Text size="small" weight="bold" className={styles.sectionTitle}>
          {title}
        </Text>
      </Box>
      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        {items.map(item => (
          <TreeMenuItem
            key={item.id}
            label={item.title}
            start={
              <Box className={styles.itemIcon}>
                <MessageSquareIcon size="medium" />
              </Box>
            }
            onClick={handleChatClick}
          />
        ))}
      </TreeMenu>
    </Box>
  );
}

export default function CanvaAIContextualNav(): React.ReactNode {
  const navigate = useNavigate();

  const handleStartNewChat = () => {
    navigate('/ai');
  };

  return (
    <>
      <Box className={styles.chatButtonContainer}>
        <Button
          variant="primary"
          icon={MessageSquarePlusIcon}
          className={styles.chatButton}
          onClick={handleStartNewChat}
        >
          Start new chat
        </Button>
      </Box>
      <Section title="Today" items={todayChats} />
      <Section title="This Week" items={thisWeekChats} />
      <Section title="This Month" items={thisMonthChats} />
      <Section title="Earlier" items={earlierChats} />
    </>
  );
}
