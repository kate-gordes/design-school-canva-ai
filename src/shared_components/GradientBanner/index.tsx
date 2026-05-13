import styles from './GradientBanner.module.css';

interface GradientBannerProps {
  /** Height of the gradient banner. Defaults to 278px. */
  height?: number;
  /** Top offset of the gradient banner. Defaults to 0. Use negative values to move up. */
  top?: number;
}

/**
 * Shared gradient banner component for home pages.
 * Displays a gradient at the top of the page container.
 * Should be used inside a relatively positioned container.
 */
export default function GradientBanner({
  height = 278,
  top = 0,
}: GradientBannerProps): React.ReactNode {
  // Raw <div>: this element paints the page-level radial/linear gradient stack
  // that bleeds into the hero. Easel Box's reset_f88b8e wipes the background,
  // so a Box would paint transparent. height/top are data-driven, but because
  // the element must stay a plain <div> for the gradient to render, we inject
  // them as normal inline styles here.
  return (
    <div className={styles.gradientContainer} style={{ height: `${height}px`, top: `${top}px` }} />
  );
}
