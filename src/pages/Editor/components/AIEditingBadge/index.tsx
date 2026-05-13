import './AIEditingBadge.css';

interface AIEditingBadgeProps {
  position: 'element' | 'canvas';
  canvasScale: number;
}

export default function AIEditingBadge({
  position,
  canvasScale,
}: AIEditingBadgeProps): React.ReactNode {
  const counterScale = 1 / canvasScale;

  return (
    // Plain div: Easel Box's reset_f88b8e would wipe the solid purple background
    // set by .ai-editing-badge. Transform is dynamic (counter-scales canvas zoom).
    <div
      className={`ai-editing-badge ai-editing-badge--${position}`}
      style={{ transform: `scale(${counterScale})` }}
    >
      {/* Plain span: font-family/size/weight custom-set for badge chrome. */}
      <span className="ai-editing-badge__label">Canva AI</span>
    </div>
  );
}
