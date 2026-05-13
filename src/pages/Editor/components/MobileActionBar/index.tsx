import React from 'react';
import { Box, Text } from '@canva/easel';
import {
  ClockIcon,
  CheckIcon,
  MagicFilledGradientIcon,
  KeyboardIcon,
  FontIcon,
  HeadingIcon,
  TextSizeIcon,
  CircleSquareIcon,
  LineWeightsIcon,
  ChartCornerRoundingIcon,
  TextFormatIcon,
  AdvancedTextFormattingIcon,
  ShadowIcon,
  AnimationMoveIcon,
  TransparencyIcon,
  LayersIcon,
  PositionIcon,
  MoveLayerUpIcon,
  MoreHorizontalIcon,
  TransitionIcon,
  PagePlusIcon,
  CopyPlusIcon,
  TrashIcon,
  NotesIcon,
} from '@canva/easel/icons';
import { NavCanvaAIIconActive } from '@/shared_components/icons';
import styles from './MobileActionBar.module.css';

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface MobileToolbarProps {
  selectedType?: string;
  selectionSource?: 'none' | 'canvas' | 'thumbnail';
  onDone?: () => void;
}

/** Shared trailing actions for element toolbars (text & shape) */
const sharedElementActions: ActionItem[] = [
  {
    id: 'animate',
    label: 'Animate',
    icon: <AnimationMoveIcon size="medium" />,
    onClick: () => console.log('Animate'),
  },
  {
    id: 'transparency',
    label: 'Transparency',
    icon: <TransparencyIcon size="medium" />,
    onClick: () => console.log('Transparency'),
  },
  {
    id: 'layers',
    label: 'Layers',
    icon: <LayersIcon size="medium" />,
    onClick: () => console.log('Layers'),
  },
  {
    id: 'position',
    label: 'Position',
    icon: <PositionIcon size="medium" />,
    onClick: () => console.log('Position'),
  },
  {
    id: 'nudge',
    label: 'Nudge',
    icon: <MoveLayerUpIcon size="medium" />,
    onClick: () => console.log('Nudge'),
  },
  {
    id: 'more',
    label: 'More',
    icon: <MoreHorizontalIcon size="medium" />,
    onClick: () => console.log('More'),
  },
];

/**
 * Toolbar shown at the bottom of the mobile editor when a canvas element or page is selected.
 * Shows contextual actions based on the selected element type.
 */
export default function MobileToolbar({
  selectedType = 'page',
  selectionSource = 'canvas',
  onDone,
}: MobileToolbarProps): React.ReactNode {
  const textActions: ActionItem[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <KeyboardIcon size="medium" />,
      onClick: () => console.log('Edit'),
    },
    {
      id: 'font',
      label: 'Font',
      icon: <FontIcon size="medium" />,
      onClick: () => console.log('Font'),
    },
    {
      id: 'text-styles',
      label: 'Text styles',
      icon: <HeadingIcon size="medium" />,
      onClick: () => console.log('Text styles'),
    },
    {
      id: 'font-size',
      label: 'Font size',
      icon: <TextSizeIcon size="medium" />,
      onClick: () => console.log('Font size'),
    },
    {
      id: 'color',
      label: 'Color',
      icon: (
        <span className={styles.colorIconText}>
          A
          <span className={styles.colorBar} />
        </span>
      ),
      onClick: () => console.log('Color'),
    },
    {
      id: 'format',
      label: 'Format',
      icon: <TextFormatIcon size="medium" />,
      onClick: () => console.log('Format'),
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: <AdvancedTextFormattingIcon size="medium" />,
      onClick: () => console.log('Advanced'),
    },
    {
      id: 'effects',
      label: 'Effects',
      icon: <ShadowIcon size="medium" />,
      onClick: () => console.log('Effects'),
    },
    ...sharedElementActions,
  ];

  const shapeActions: ActionItem[] = [
    {
      id: 'shape',
      label: 'Shape',
      icon: <CircleSquareIcon size="medium" />,
      onClick: () => console.log('Shape'),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <KeyboardIcon size="medium" />,
      onClick: () => console.log('Edit'),
    },
    {
      id: 'color',
      label: 'Color',
      // Plain span: shape-fill color swatch; Easel Pill/Swatch don't expose raw color-only
      // chrome with the required 22x22 round shape.
      icon: <span className={styles.shapeColorSwatch} />,
      onClick: () => console.log('Color'),
    },
    {
      id: 'style',
      label: 'Style',
      icon: <LineWeightsIcon size="medium" />,
      onClick: () => console.log('Style'),
    },
    {
      id: 'corners',
      label: 'Corners',
      icon: <ChartCornerRoundingIcon size="medium" />,
      onClick: () => console.log('Corners'),
    },
    ...sharedElementActions,
  ];

  const pageActions: ActionItem[] = [
    {
      id: 'ask-canva',
      label: 'Ask Canva',
      icon: <NavCanvaAIIconActive size={24} />,
      onClick: () => console.log('Ask Canva'),
    },
    {
      id: 'replace',
      label: 'Replace',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 16v-4.25a.75.75 0 0 1 1.5 0V16a3.5 3.5 0 0 0 3.5 3.5h3.25a.75.75 0 0 1 0 1.5H9.5a5 5 0 0 1-5-5ZM17.75 13a.75.75 0 0 0 .75-.75V8a5 5 0 0 0-5-5h-3.25a.75.75 0 0 0 0 1.5h3.25A3.5 3.5 0 0 1 17 8v4.25c0 .414.336.75.75.75Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.28 13.573a.75.75 0 0 1-1.06 0l-1.97-1.97-1.97 1.97a.75.75 0 0 1-1.06-1.06l2.145-2.146a1.253 1.253 0 0 1 1.77 0l2.145 2.146a.75.75 0 0 1 0 1.06ZM14.72 10.22a.75.75 0 0 1 1.06 0l1.97 1.97 1.97-1.97a.75.75 0 1 1 1.06 1.06l-2.145 2.146a1.254 1.254 0 0 1-1.364.271 1.248 1.248 0 0 1-.406-.271L14.72 11.28a.75.75 0 0 1 0-1.06Z"
            fill="currentColor"
          />
        </svg>
      ),
      onClick: () => console.log('Replace'),
    },
    {
      id: 'magic-bg',
      label: 'Magic BG',
      icon: <MagicFilledGradientIcon size="medium" />,
      onClick: () => console.log('Magic BG'),
    },
    {
      id: 'color',
      label: 'Color',
      // Plain span: rainbow conic-gradient color swatch; Easel Swatch doesn't expose this
      // gradient chrome with the required 22x22 round shape.
      icon: <span className={styles.rainbowSwatch} />,
      onClick: () => console.log('Color'),
    },
    {
      id: 'duration',
      label: '5.0s',
      icon: <ClockIcon size="medium" />,
      onClick: () => console.log('Duration'),
    },
    {
      id: 'transition',
      label: 'Transition',
      icon: <TransitionIcon size="medium" />,
      onClick: () => console.log('Transition'),
    },
    {
      id: 'layers',
      label: 'Layers',
      icon: <LayersIcon size="medium" />,
      onClick: () => console.log('Layers'),
    },
    {
      id: 'more',
      label: 'More',
      icon: <MoreHorizontalIcon size="medium" />,
      onClick: () => console.log('More'),
    },
  ];

  const thumbnailActions: ActionItem[] = [
    {
      id: 'add-page',
      label: 'Add page',
      icon: <PagePlusIcon size="medium" />,
      onClick: () => console.log('Add page'),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <CopyPlusIcon size="medium" />,
      onClick: () => console.log('Duplicate'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <TrashIcon size="medium" />,
      onClick: () => console.log('Delete'),
    },
    {
      id: 'color',
      label: 'Color',
      // Plain span: rainbow conic-gradient color swatch; Easel Swatch doesn't expose this
      // gradient chrome with the required 22x22 round shape.
      icon: <span className={styles.rainbowSwatch} />,
      onClick: () => console.log('Color'),
    },
    {
      id: 'duration',
      label: '5.0s',
      icon: <ClockIcon size="medium" />,
      onClick: () => console.log('Duration'),
    },
    {
      id: 'transition',
      label: 'Transition',
      icon: <TransitionIcon size="medium" />,
      onClick: () => console.log('Transition'),
    },
    {
      id: 'layers',
      label: 'Layers',
      icon: <LayersIcon size="medium" />,
      onClick: () => console.log('Layers'),
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <NotesIcon size="medium" />,
      onClick: () => console.log('Notes'),
    },
    {
      id: 'more',
      label: 'More',
      icon: <MoreHorizontalIcon size="medium" />,
      onClick: () => console.log('More'),
    },
  ];

  let actions: ActionItem[];
  if (selectedType === 'text') {
    actions = textActions;
  } else if (selectedType === 'shape') {
    actions = shapeActions;
  } else if (selectedType === 'page' && selectionSource === 'thumbnail') {
    actions = thumbnailActions;
  } else {
    actions = pageActions;
  }

  return (
    // Plain div: fixed-position safe-area-aware bottom bar wrapper; Easel Box reset
    // would wipe the pointer-events:none transparent overlay chrome.
    <div className={styles.actionBar}>
      <Box className={styles.actionBarInner} display="flex" alignItems="center">
        {/* Plain div: horizontal touch scroll container; uses -webkit-overflow-scrolling
            and scrollbar-width which Easel Box does not forward. */}
        <div className={styles.scrollArea}>
          {actions.map(action => (
            // Plain button: bespoke flex-column icon+label tap target; Easel Button
            // doesn't support the 2-line stacked icon/label layout with min-width 44px.
            <button
              key={action.id}
              className={styles.actionButton}
              onClick={action.onClick}
              aria-label={action.label || action.id}
            >
              <span className={styles.actionIcon}>{action.icon}</span>
              {action.label && (
                <Text size="xsmall" className={styles.actionLabel}>
                  {action.label}
                </Text>
              )}
            </button>
          ))}
        </div>
      </Box>
      {/* Plain button: floating pill-shaped "Done" button with absolute positioning;
          Easel Button doesn't expose this circular 44x44 floating-done chrome. */}
      <button className={styles.doneButton} onClick={onDone} aria-label="Done">
        <CheckIcon size="medium" />
      </button>
    </div>
  );
}
