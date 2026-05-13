import { MobileSocialMediaFilledIcon, VideoCameraFilledIcon } from '@canva/easel/icons';
import type { ComponentType } from 'react';
import businessIconUrl from '@/assets/category-icons/business.svg';
import styles from './CategoryPills.module.css';

type PillIcon = ComponentType<{ size?: 'xsmall' | 'small' | 'medium' | 'large' }>;

const LearnGridIcon: PillIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="2.5 3.5 19 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.506 8.322v9.285c0 .21.244.324.406.19a8.467 8.467 0 0 1 5.238-1.95.747.747 0 0 0 .73-.747V5.752a.748.748 0 0 0-.722-.748 6.502 6.502 0 0 0-3.286.743 6.458 6.458 0 0 0-2.1 1.788 1.299 1.299 0 0 0-.266.787Z"
      fill="currentColor"
    />
    <path
      d="M20.134 6.856a.272.272 0 0 0-.279.271v8.611a.971.971 0 0 1-.271.67c-.29.293-.718.294-.933.299-1.183.026-2.348.33-2.952.546a8.222 8.222 0 0 0-1.446.704s-.107.067-.903.6c1.946-1.314 5.791-.219 6.775-.234.487-.008.875-.295.875-.645V7.5c0-.348-.383-.633-.866-.645ZM11.494 8.322v9.285c0 .21-.244.324-.405.19a8.47 8.47 0 0 0-5.239-1.95.747.747 0 0 1-.729-.747V5.752c0-.403.32-.733.722-.748a6.502 6.502 0 0 1 3.285.743 6.457 6.457 0 0 1 2.1 1.788c.172.226.266.503.266.787Z"
      fill="currentColor"
    />
    <path
      d="M3.867 6.856a.272.272 0 0 1 .278.271v8.611a.97.97 0 0 0 .271.67c.291.293.718.294.934.299 1.182.026 2.347.33 2.951.546.735.263 1.376.66 1.446.704 0 0 .107.067.903.6-1.945-1.314-5.79-.219-6.775-.234-.487-.008-.875-.295-.875-.646V7.501c0-.348.383-.633.867-.645Z"
      fill="currentColor"
    />
  </svg>
);

interface CategoryPill {
  id: string;
  label: string;
  /** Component rendering an SVG that uses currentColor, tinted via `color`. */
  Icon?: PillIcon;
  /** URL of a standalone SVG with its own colors baked in (e.g. Business). */
  imageUrl?: string;
  /** Tint applied to currentColor icons. Ignored for `imageUrl`. */
  color?: string;
}

// Icons sourced from the monorepo marketplace category grouping pills
// (see /Users/jude/work/canva/web/src/pages/home/browse_templates/category_grouping_navigation/).
const pills: CategoryPill[] = [
  { id: 'business', label: 'Business', imageUrl: businessIconUrl },
  {
    id: 'social-media',
    label: 'Social media',
    Icon: MobileSocialMediaFilledIcon,
    color: '#FF3355',
  },
  { id: 'video', label: 'Video', Icon: VideoCameraFilledIcon, color: '#B966FF' },
  { id: 'learn-grid', label: 'Learn Grid', Icon: LearnGridIcon, color: '#C8457B' },
];

export default function CategoryPills(): React.ReactNode {
  return (
    <div className={styles.wrapper}>
      {pills.map(({ id, label, Icon, imageUrl, color }) => (
        <button key={id} type="button" className={styles.pill}>
          <span className={styles.icon} style={color ? { color } : undefined}>
            {imageUrl ? <img src={imageUrl} alt="" /> : Icon ? <Icon size="medium" /> : null}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
