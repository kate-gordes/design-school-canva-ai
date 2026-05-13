import React from 'react';
import { Button } from '@canva/easel';
import { FlyoutMenu, FlyoutMenuItem } from '@canva/easel';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import styles from './Banner.module.css';
import classNames from 'classnames';

export type OverlayAlignment = 'start' | 'center' | 'bottom-start';
export type BannerSize = 'default' | 'small' | 'medium' | 'large';

type OverflowMenuItem = {
  key: string;
  text: string;
  onClick(): void;
};

type ButtonActionItemType = {
  type: 'button';
  key: string;
  label: string;
  onClick: () => void;
};

type OverflowMenuActionItemType = {
  type: 'overflow-menu';
  overflowItems: OverflowMenuItem[];
};

type ComponentActionItemType = {
  type: 'component';
  key: string;
  Component: React.ComponentType;
};

type ActionItemType = ButtonActionItemType | OverflowMenuActionItemType | ComponentActionItemType;
type BannerActionsType =
  | readonly [ButtonActionItemType | ComponentActionItemType, ActionItemType]
  | readonly [ActionItemType];

type OverlayProps = {
  overlayAlignment?: OverlayAlignment;
  actions?: BannerActionsType;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  imageCredit?: React.ReactNode;
  searchBar?: React.ReactNode;
};

export type BackgroundProps = {
  display: BannerSize;
};

export type BannerCore = {
  overlayAlignment?: OverlayAlignment;
  actions?: BannerActionsType;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  imageCredit?: React.ReactNode;
  searchBar?: React.ReactNode;
  Background?: React.ComponentType<BackgroundProps>;
  BannerClickableWrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

type SingleBannerProps = OverlayProps & {
  display: BannerSize;
  Background?: React.ComponentType<BackgroundProps>;
  BannerClickableWrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

export type BannerProps = {
  type: 'hero' | 'tabs-selector' | 'split';
  display: BannerSize;
  onMount?: () => void;
} & BannerCore;

const Overlay = React.memo(
  ({
    actions,
    overlayAlignment = 'center',
    title,
    subtitle,
    badge,
    imageCredit,
    searchBar,
  }: OverlayProps) => (
    <div
      className={classNames(styles.overlay, {
        [styles.alignStart]: overlayAlignment === 'start',
        [styles.alignBottomStart]: overlayAlignment === 'bottom-start',
      })}
    >
      {actions && <BannerActions actions={actions} />}
      {badge && <div className={styles.badge}>{badge}</div>}
      {title && <div className={styles.title}>{title}</div>}
      {searchBar && <div className={styles.searchBar}>{searchBar}</div>}
      {subtitle && (
        <div className={classNames(styles.subtitle, { [styles.withCredit]: !!imageCredit })}>
          {subtitle}
        </div>
      )}
      {imageCredit && <div className={styles.credit}>{imageCredit}</div>}
    </div>
  ),
);

const BannerActions = React.memo(({ actions }: { actions: BannerActionsType }) => (
  <div className={styles.actions}>
    {actions.map(action => {
      switch (action.type) {
        case 'button':
          return (
            <div key={action.key} className={styles.actionItem}>
              <Button variant="primary" onClick={action.onClick}>
                {action.label}
              </Button>
            </div>
          );
        case 'overflow-menu':
          return (
            <div key="overflow-menu-button" className={styles.actionItem}>
              <OverflowMenuButton items={action.overflowItems} />
            </div>
          );
        case 'component':
          return (
            <div key={action.key} className={styles.actionItem}>
              <action.Component />
            </div>
          );
        default:
          throw new Error(`Unknown action type: ${(action as Record<string, unknown>).type}`);
      }
    })}
  </div>
));

const OverflowMenuButton = React.memo(({ items }: { items: OverflowMenuItem[] }) => {
  return (
    <FlyoutMenu
      trigger={props => (
        <Button {...props} variant="primary" icon={MoreHorizontalIcon} aria-label="More options" />
      )}
    >
      {items.map(item => (
        <FlyoutMenuItem key={item.key} onClick={item.onClick}>
          {item.text}
        </FlyoutMenuItem>
      ))}
    </FlyoutMenu>
  );
});

const SingleBanner = React.memo(
  ({
    display,
    overlayAlignment,
    actions,
    title,
    subtitle,
    imageCredit,
    badge,
    searchBar,
    Background,
    BannerClickableWrapper,
  }: SingleBannerProps) => {
    const content = (
      <>
        {Background && (
          <div className={styles.background}>
            <Background display={display} />
          </div>
        )}
        <Overlay
          overlayAlignment={overlayAlignment}
          actions={actions}
          title={title}
          subtitle={subtitle}
          imageCredit={imageCredit}
          badge={badge}
          searchBar={searchBar}
        />
      </>
    );
    return BannerClickableWrapper ? (
      <BannerClickableWrapper>{content}</BannerClickableWrapper>
    ) : (
      content
    );
  },
);

export const Banner = React.memo(
  ({
    overlayAlignment = 'center',
    Background,
    actions,
    title,
    subtitle,
    badge,
    imageCredit,
    searchBar,
    BannerClickableWrapper,
    display,
    type,
    onMount,
  }: BannerProps) => {
    React.useEffect(() => {
      if (onMount) {
        onMount();
      }
    }, [onMount]);

    return (
      <div
        className={classNames(styles.banner, {
          [styles.hero]: type === 'hero',
          [styles.split]: type === 'split',
          [styles.tabsSelector]: type === 'tabs-selector',
          [styles.hasSearch]: searchBar != null,
          [styles.default]: display === 'default',
          [styles.small]: display === 'small',
          [styles.medium]: display === 'medium',
          [styles.large]: display === 'large',
        })}
      >
        <SingleBanner
          display={display}
          overlayAlignment={overlayAlignment}
          actions={actions}
          title={title}
          subtitle={subtitle}
          badge={badge}
          imageCredit={imageCredit}
          searchBar={searchBar}
          Background={Background}
          BannerClickableWrapper={BannerClickableWrapper}
        />
      </div>
    );
  },
);

export default Banner;
