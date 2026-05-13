import React, { useEffect, useRef } from 'react';
import { Text, Title } from '@canva/easel';
import { MessageSquareIcon, PencilSquareIcon, BookClosedIcon } from '@canva/easel/icons';
import { useNavigate } from 'react-router-dom';
import {
  todayChats,
  thisWeekChats,
  thisMonthChats,
  earlierChats,
  type ChatItem,
} from '@/data/data';
import styles from './MobileRecentChats.module.css';

interface MobileRecentChatsProps {
  open: boolean;
  onClose: () => void;
}

interface SectionData {
  title: string;
  items: ChatItem[];
}

export default function MobileRecentChats({
  open,
  onClose,
}: MobileRecentChatsProps): React.ReactNode {
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && sheetRef.current) {
      sheetRef.current.scrollTop = 0;
    }
  }, [open]);

  if (!open) return null;

  const handleChatClick = (chatId: string) => {
    onClose();
    navigate(`/ai/thread/${chatId}`);
  };

  const sections: SectionData[] = [
    { title: 'Today', items: todayChats },
    { title: 'This Week', items: thisWeekChats },
    { title: 'This Month', items: thisMonthChats },
    { title: 'Earlier', items: earlierChats },
  ].filter(s => s.items.length > 0);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.sheet} ref={sheetRef}>
        <div className={styles.header}>
          <Title size="small">All chats</Title>
          <button className={styles.composeButton} onClick={onClose} aria-label="New chat">
            <PencilSquareIcon size="medium" />
          </button>
        </div>

        <div className={styles.chatList}>
          {sections.map(section => (
            <div key={section.title} className={styles.section}>
              <div className={styles.sectionTitle}>
                <Text size="small" weight="bold" tone="secondary">
                  {section.title}
                </Text>
              </div>
              <div className={styles.sectionItems}>
                {section.items.map(chat => (
                  <button
                    key={chat.id}
                    className={styles.chatItem}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <MessageSquareIcon size="medium" />
                    <Text size="medium">{chat.title}</Text>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.footerItem} aria-label="Memory">
            <BookClosedIcon size="medium" />
            <Text size="medium">Memory</Text>
          </button>
        </div>
      </div>
    </>
  );
}
