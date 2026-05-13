import classNames from 'classnames';
import * as React from 'react';
import styles from './BannerBackground.module.css';
import splitBannerLarge from './assets/split_banner_background_large.jpg';

type BackgroundWrapperProps = {
  backgroundColor?: string;
  background?: string;
  corner?: 'rounded' | 'squared';
};

export const BannerBackground = ({
  backgroundColor,
  background,
  corner,
}: BackgroundWrapperProps) => {
  return (
    <div
      style={{ backgroundColor, background }}
      className={classNames(styles.background, {
        [styles.rounded]: corner === 'rounded',
      })}
    />
  );
};

// Default image background for Projects page
export const ProjectsBannerBackground = () => (
  <BannerBackground background={`url(${splitBannerLarge})`} corner="rounded" />
);
