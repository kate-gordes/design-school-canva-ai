import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill } from '@canva/easel';
import { Carousel, CarouselItem, ChevronScrollButton } from '@canva/easel/carousel';
import { Button } from '@canva/easel/button';
import {
  MagicIcon,
  MagicPhotoIcon,
  MagicPencilIcon,
  CodeIcon,
  MagicVideoIcon,
  DockLeftIcon,
  PlusIcon,
  MicrophoneIcon,
} from '@canva/easel/icons';
import GradientBanner from '@/shared_components/GradientBanner';
import MobileHomeHeader from '@/pages/Home/components/MobileHomeHeader';
import MobileRecentChats from './MobileRecentChats';
import canvaAiLogoUrl from '@/assets/canva-ai-logo.svg';
import styles from './MobileCanvaAI.module.css';

export default function MobileCanvaAI(): React.ReactNode {
  const navigate = useNavigate();
  const [selectedPill, setSelectedPill] = React.useState('');
  const [showRecentChats, setShowRecentChats] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const query = inputValue.trim();
    if (!query) return;
    navigate('/ai/chat', { state: { initialMessage: query } });
  };

  const pills = [
    { id: 'design', label: 'Design', icon: <MagicIcon size="small" /> },
    { id: 'image', label: 'Image', icon: <MagicPhotoIcon size="small" /> },
    { id: 'doc', label: 'Doc', icon: <MagicPencilIcon size="small" /> },
    { id: 'code', label: 'Code', icon: <CodeIcon size="small" /> },
    { id: 'video', label: 'Video clip', icon: <MagicVideoIcon size="small" /> },
  ];

  return (
    <>
      <MobileHomeHeader
        showAvatar={false}
        leftButton={
          <button
            type="button"
            className={styles.panelButton}
            aria-label="Chat history"
            onClick={() => setShowRecentChats(true)}
          >
            <DockLeftIcon size="medium" />
          </button>
        }
      />

      <MobileRecentChats open={showRecentChats} onClose={() => setShowRecentChats(false)} />

      <div className={styles.container}>
        <GradientBanner />

        <div className={styles.contentWrapper}>
          <div className={styles.brandRow}>
            <img src={canvaAiLogoUrl} alt="Canva AI 2.0" className={styles.logo} />
          </div>

          <h1 className={styles.heroTitle}>
            What will we
            <br />
            design today?
          </h1>

          <form
            className={styles.chatBox}
            onSubmit={handleSubmit}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              name="message"
              className={styles.chatInput}
              placeholder="Describe your idea"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              autoComplete="off"
            />
            <div className={styles.chatActions}>
              <Button
                variant="tertiary"
                icon={PlusIcon}
                onClick={() => {}}
                tooltipLabel="Insert file for reference"
              />
              <Button
                variant="tertiary"
                icon={MicrophoneIcon}
                onClick={() => {}}
                tooltipLabel="Chat using voice"
              />
            </div>
          </form>

          <div className={styles.pillsRow}>
            <Carousel
              ariaLabel="Suggestions"
              gap="1u"
              fadeSize="0"
              itemWidth="intrinsic"
              scrollButton={props => <ChevronScrollButton {...props} />}
            >
              {pills.map(pill => (
                <CarouselItem key={pill.id}>
                  <Pill
                    size="medium"
                    text={pill.label}
                    start={pill.icon}
                    selected={selectedPill === pill.id}
                    onClick={() => setSelectedPill(pill.id)}
                  />
                </CarouselItem>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}
