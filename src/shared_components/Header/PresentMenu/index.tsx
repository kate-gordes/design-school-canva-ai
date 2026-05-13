import React from 'react';
import { FlyoutMenu } from '@canva/easel/flyout_menu';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PresentIcon,
  StickyNoteIcon,
  VideoCameraIcon,
  PlayIcon,
} from '@canva/easel/icons';
import styles from './PresentMenu.module.css';

type PresentOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: string }>;
  hasSubmenu?: boolean;
};

export const PresentMenu: React.FC = () => {
  const presentOptions: PresentOption[] = [
    {
      id: 'full-screen',
      title: 'Full screen',
      description: 'Present in full screen',
      icon: PresentIcon,
    },
    {
      id: 'presenter-view',
      title: 'Presenter view',
      description: 'View notes and upcoming slides',
      icon: StickyNoteIcon,
    },
    {
      id: 'present-record',
      title: 'Present and record',
      description: 'Record yourself as you present',
      icon: VideoCameraIcon,
      hasSubmenu: true,
    },
    {
      id: 'autoplay',
      title: 'Autoplay',
      description: 'Set speed to automatically play',
      icon: PlayIcon,
    },
  ];

  const handleOptionSelect = (optionId: string) => {
    console.log(`Present option clicked: ${optionId}`);
  };

  const handlePresent = () => {
    console.log('Present full screen');
  };

  return (
    <FlyoutMenu
      trigger={props => (
        // Plain div: .presentSplit is a split-button pill with a translucent
        // white border on the purple gradient; Easel Box's reset_f88b8e
        // would wipe the border + overflow:hidden shape.
        <div
          className={styles.presentSplit}
          aria-haspopup={props.ariaHasPopup}
          aria-controls={props.ariaControls}
        >
          {/* Plain buttons: the two halves of the split button share custom
              header-chrome styling (transparent bg, white text, rgba hover);
              Easel Button would override them. */}
          <button type="button" className={styles.presentMain} onClick={handlePresent}>
            Present
          </button>
          {/* Plain div: vertical rule painted via .presentDivider background. */}
          <div className={styles.presentDivider} />
          <button
            type="button"
            className={styles.presentChevron}
            onClick={props.onClick}
            aria-label="All present modes"
          >
            <ChevronDownIcon size="medium" />
          </button>
        </div>
      )}
    >
      {/* Plain div: flyout panel padding/gap container — kept as div for
          consistency with the other FlyoutMenu contents in this directory. */}
      <div className={styles.presentMenuContent}>
        {presentOptions.map(option => {
          const Icon = option.icon;
          return (
            // Plain button: .presentOption uses custom row chrome (gap,
            // radius, hover bg) that Easel Button would override.
            <button
              key={option.id}
              type="button"
              className={styles.presentOption}
              onClick={() => handleOptionSelect(option.id)}
            >
              {/* Plain spans: pure layout wrappers for icon + title/desc
                  columns — no semantics; keeping them as spans avoids the
                  margin/background reset that Easel Box applies. */}
              <span className={styles.optionIcon}>
                <Icon size="medium" />
              </span>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{option.title}</span>
                <span className={styles.optionDescription}>{option.description}</span>
              </span>
              {option.hasSubmenu && (
                <span className={styles.optionChevron}>
                  <ChevronRightIcon size="small" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </FlyoutMenu>
  );
};
