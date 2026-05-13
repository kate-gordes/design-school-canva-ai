import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Text, Container, Scrollable, Rows } from '@canva/easel';
import { HouseIcon, DockLeftIcon } from '@canva/easel/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import MagicAssistantInput from './components/MagicAssistantInput';
import MobileMagicAssistantInput from './components/MagicAssistantInput/MobileMagicAssistantInput';
import { AssistantMessage } from './AssistantMessage';
import { BrandedShimmeringText } from './BrandedShimmeringText';
import { UserMessage } from './UserMessage';
import MobileRecentChats from '../MobileRecentChats';
import styles from './CanvaAIChat.module.css';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { LLMStreamService, setupAuth } from '@canva-ct/genai';

interface Message {
  type: 'user' | 'assistant';
  message: string;
}

const CHAT_MODEL = 'openai/gpt-4o';

const SYSTEM_PROMPT =
  'You are Canva AI, a helpful creative assistant built into Canva. You help users create beautiful designs, presentations, social media posts, videos, and more. Be concise, friendly, and design-focused. When suggesting layouts, colors, or content, be specific and actionable.';

export default function CanvaAIChat(): React.ReactNode {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showRecentChats, setShowRecentChats] = useState(false);
  const llm = useRef(new LLMStreamService());
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef(false);

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
    setupAuth().catch(console.error);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  const handleSend = useCallback(
    async (userText: string) => {
      const userMessage: Message = { type: 'user', message: userText };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsStreaming(true);
      setStreamingContent('');

      const openRouterMessages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...nextMessages.map(m => ({
          role: m.type === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.message,
        })),
      ];

      let accumulated = '';

      try {
        await llm.current.invoke(
          {
            messages: openRouterMessages,
            model: CHAT_MODEL,
            temperature: 0.7,
            max_tokens: 1024,
            tools: [],
          },
          {
            onMessage(msg) {
              if (msg.type === 'on_chat_model_stream' && typeof msg.content === 'string') {
                accumulated += msg.content;
                setStreamingContent(accumulated);
              }
            },
            onError(err) {
              console.error('LLM stream error', err);
              setIsStreaming(false);
              setStreamingContent('');
            },
            onComplete() {
              setMessages(prev => [...prev, { type: 'assistant', message: accumulated }]);
              setStreamingContent('');
              setIsStreaming(false);
            },
          },
        );
      } catch (err) {
        console.error('LLM invoke failed', err);
        setIsStreaming(false);
        setStreamingContent('');
      }
    },
    [messages],
  );

  // Auto-send a message passed from the Wonderbox on the /ai page
  useEffect(() => {
    const initialMessage = (location.state as { initialMessage?: string } | null)?.initialMessage;
    if (initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      handleSend(initialMessage);
    }
    // Only run on mount — handleSend is stable for the empty-messages case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <Box
      width="full"
      height="full"
      className={`${styles.defaultBackground} ${isMobile ? styles.mobileBackground : ''}`}
      shadow={isMobile ? undefined : 'elevationSurfaceRaised'}
      borderRadius={isMobile ? undefined : 'containerLarge'}
    >
      {isMobile && (
        <>
          <div className={styles.mobileHeader}>
            <button
              type="button"
              className={styles.mobileHeaderButton}
              aria-label="Home"
              onClick={() => navigate('/ai')}
            >
              <HouseIcon size="medium" />
            </button>
            <button
              type="button"
              className={styles.mobileHeaderButton}
              aria-label="Chat history"
              onClick={() => setShowRecentChats(true)}
            >
              <DockLeftIcon size="medium" />
            </button>
          </div>
          <MobileRecentChats open={showRecentChats} onClose={() => setShowRecentChats(false)} />
        </>
      )}
      <Box display="flex" flexDirection="column" height="full">
        <Box
          height="full"
          minHeight="0"
          paddingX={isMobile ? '0' : '4u'}
          paddingBottom="2u"
          className={`${styles.conversationArea} ${isMobile ? styles.mobileConversationArea : ''}`}
        >
          <Scrollable>
            <Container width="medium">
              <Rows spacing="2u">
                {messages.length === 0 && !isStreaming && (
                  <Text tone="secondary" alignment="center">
                    Ask me anything about design, presentations, or how to use Canva.
                  </Text>
                )}
                {messages.map((msg, index) =>
                  msg.type === 'user' ? (
                    <UserMessage key={index} message={msg.message} />
                  ) : (
                    <AssistantMessage key={index} message={msg.message} />
                  ),
                )}
                {isStreaming && streamingContent === '' && <BrandedShimmeringText />}
                {streamingContent !== '' && <AssistantMessage message={streamingContent} />}
                <div ref={bottomRef} />
              </Rows>
            </Container>
          </Scrollable>
        </Box>

        <Container width="medium">
          {isMobile ? (
            <MobileMagicAssistantInput onSubmit={handleSend} disabled={isStreaming} />
          ) : (
            <MagicAssistantInput onSubmit={handleSend} disabled={isStreaming} />
          )}
        </Container>
      </Box>
    </Box>
  );
}
