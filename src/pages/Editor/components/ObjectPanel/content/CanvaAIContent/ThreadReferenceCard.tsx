import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSignals } from '@preact/signals-react/runtime';
import { elementThreads, showExpandThread, showExpandThreadMobile } from '@/store';
import type { ChatMessage } from '@/store';
import { MiniCanvas } from '@/pages/Editor/components/PageNavigator/MiniCanvas';

interface ThreadReferenceCardProps {
  threadRef: NonNullable<ChatMessage['threadRef']>;
  onGoToThread: (threadId: string) => void;
  compact?: boolean;
}

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className={`thread-ref-chevron ${expanded ? 'thread-ref-chevron--expanded' : ''}`}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ELEMENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  text: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M4 12h10M4 18h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  shape: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  video: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  html: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 8l-4 4 4 4M17 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function ThreadReferenceCard({
  threadRef,
  onGoToThread,
  compact = false,
}: ThreadReferenceCardProps): React.ReactNode {
  useSignals();
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const effectiveCompact = compact ? !showExpandThreadMobile.value : !showExpandThread.value;

  useEffect(() => {
    if (expanded && cardRef.current) {
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }, [expanded]);

  // Read live messages from the referenced thread
  const threadMessages = elementThreads.value[threadRef.threadId]?.messages ?? [];

  const renderThumbnail = () => {
    // Image elements — show the actual image thumbnail
    if (threadRef.thumbnailUrl) {
      return (
        <img
          src={threadRef.thumbnailUrl}
          alt={threadRef.elementLabel}
          className="thread-ref-thumbnail"
        />
      );
    }

    // Page threads — show MiniCanvas preview
    if (threadRef.elementType === 'page' && threadRef.pageNumber) {
      return (
        <div className="thread-ref-thumbnail thread-ref-thumbnail--page">
          <MiniCanvas pageNumber={threadRef.pageNumber} doctype="presentation" />
        </div>
      );
    }

    // Other element types — show icon fallback
    const icon = ELEMENT_TYPE_ICONS[threadRef.elementType];
    return (
      <div className="thread-ref-thumbnail thread-ref-thumbnail--icon">
        {icon ?? ELEMENT_TYPE_ICONS.shape}
      </div>
    );
  };

  return (
    <div ref={cardRef} className={`thread-ref-card${compact ? ' thread-ref-card--mobile' : ''}`}>
      <div
        className="thread-ref-header"
        onClick={
          effectiveCompact ? () => onGoToThread(threadRef.threadId) : () => setExpanded(!expanded)
        }
      >
        {renderThumbnail()}
        <div className="thread-ref-info">
          <span className="thread-ref-label">{threadRef.elementLabel}</span>
          <button
            type="button"
            className="thread-ref-go-link"
            onClick={e => {
              e.stopPropagation();
              onGoToThread(threadRef.threadId);
            }}
          >
            Go to thread
          </button>
        </div>
        {!effectiveCompact && <ChevronIcon expanded={expanded} />}
      </div>
      {!effectiveCompact && expanded && threadMessages.length > 0 && (
        <div className="thread-ref-messages">
          {threadMessages.map(msg => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="thread-ref-msg thread-ref-msg--user">
                  <div className="thread-ref-msg-bubble">
                    {msg.content}
                    {msg.elementSnapshot?.thumbnailUrl && (
                      <img
                        src={msg.elementSnapshot.thumbnailUrl}
                        alt={msg.elementSnapshot.label}
                        className="thread-ref-msg-thumb"
                      />
                    )}
                  </div>
                </div>
              );
            }
            if (msg.role === 'assistant') {
              return (
                <div key={msg.id} className="thread-ref-msg thread-ref-msg--assistant">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
