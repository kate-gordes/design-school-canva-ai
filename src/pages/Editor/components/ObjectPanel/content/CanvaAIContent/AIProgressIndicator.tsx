import React from 'react';
import type { DesignProgress, ChatMessage } from '@/store/signals/chat';
import { toggleDesignProgressExpanded } from '@/store/signals/chat';
import canvaAiLogo from '@/assets/icons/side-menu-icons/canva-ai-logo.svg';
import { BrandedShimmeringText } from '@/pages/home/CanvaAI/CanvaAIChat/BrandedShimmeringText';

interface AIProgressIndicatorProps {
  designProgress: DesignProgress | null;
  designSummary?: ChatMessage['designSummary'];
  isStreaming: boolean;
  threadId: string;
}

export const AIProgressIndicator: React.FC<AIProgressIndicatorProps> = ({
  designProgress,
  designSummary,
  isStreaming,
  threadId,
}) => {
  // Phase 3: Completed (persisted on message)
  if (designSummary) {
    return (
      <div className="ai-progress-indicator">
        <div className="ai-progress-header">
          <CanvaAIIcon />
          <span className="ai-progress-completed-title">
            Designed for {designSummary.durationSeconds}s
          </span>
          <span className="ai-progress-subtitle">
            {designSummary.actionCount} action{designSummary.actionCount !== 1 ? 's' : ''} completed
          </span>
        </div>
      </div>
    );
  }

  // Phase 2: Active designing (tools executing)
  if (designProgress && designProgress.actions.length > 0) {
    const currentAction = designProgress.actions[designProgress.actions.length - 1];
    const isExpanded = designProgress.isExpanded;

    return (
      <div className="ai-progress-indicator">
        <div
          className="ai-progress-header ai-progress-header--clickable"
          onClick={() => toggleDesignProgressExpanded(threadId)}
        >
          <CanvaAIIcon animating />
          <span className="ai-progress-title canva-ai-designing-text">Designing...</span>
          <span className="ai-progress-subtitle">{currentAction.displayName}</span>
          <ChevronIcon expanded={isExpanded} />
        </div>
        {isExpanded && (
          <div className="ai-progress-actions">
            {designProgress.actions.map(action => (
              <div key={action.id} className="ai-progress-action">
                {action.status === 'completed' ? <CheckIcon /> : <SpinnerIcon />}
                <span
                  className={
                    action.status === 'completed'
                      ? 'ai-progress-action-done'
                      : 'ai-progress-action-active'
                  }
                >
                  {action.displayName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Phase 1: Thinking (streaming but no tool actions yet)
  if (isStreaming) {
    return <BrandedShimmeringText />;
  }

  return null;
};

// --- Icons ---

const CanvaAIIcon = ({ animating = false }: { animating?: boolean }) => (
  <img
    src={canvaAiLogo}
    alt="Canva AI"
    className={`ai-progress-icon${animating ? ' ai-progress-icon--pulse' : ''}`}
    width={20}
    height={20}
  />
);

const CheckIcon = () => (
  <svg className="ai-progress-check" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 11.08V12a10 10 0 11-5.93-9.14"
      stroke="#00c4cc"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 4L12 14.01l-3-3"
      stroke="#00c4cc"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="ai-progress-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
      stroke="#5a32fa"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    className={`ai-progress-chevron ${expanded ? 'ai-progress-chevron--expanded' : ''}`}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
