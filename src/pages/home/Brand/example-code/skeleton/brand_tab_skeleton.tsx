import { UnreachableError } from 'base/preconditions';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Box } from 'ui/base/box/box';
import type { PageLayoutStore } from 'ui/base/page_layout/page_layout';
import { PageLayout } from 'ui/base/page_layout/page_layout';
import styles from './brand_tab_skeleton.css';

export type ScreenMode = 'mobile' | 'tablet' | 'desktop';

/**
 * The skeleton layout component that composes the brand tab view
 * It responds to contextual changes in selection and screen size
 *
 * Note: No padding is added here, that's done in the props passed in
 */
export function BrandTabSkeleton({
  screenMode,
  contextualNav,
  detailPane,
  showDetailPane,
}: {
  screenMode: ScreenMode;
  contextualNav: React.ReactNode;
  detailPane: React.ReactNode | undefined;
  showDetailPane: boolean;
}): React.JSX.Element {
  const isDesktop = screenMode === 'desktop';
  const showContextualNav = isDesktop || !showDetailPane;
  const skeletonClassNames = getClassNames(screenMode, showDetailPane);

  return (
    <Box height="full" display={isDesktop ? 'flex' : 'block'}>
      {/* NAV SLOT — always mounted, to keep scroll position */}
      <Box
        height="full"
        display={showContextualNav ? 'block' : 'none'}
        className={skeletonClassNames.contextualNav}
      >
        {contextualNav}
      </Box>

      {/* DETAIL SLOT — mounted only when needed; nav never re-parents */}
      <Box
        height="full"
        display={showDetailPane ? 'block' : 'none'}
        className={skeletonClassNames.detailView}
      >
        {showDetailPane ? detailPane : null}
      </Box>
    </Box>
  );
}

function getClassNames(
  screenMode: ScreenMode,
  showDetailPane: boolean,
): {
  contextualNav: string;
  detailView: string;
} {
  switch (screenMode) {
    case 'desktop':
      return {
        contextualNav: classNames(styles.contextualNavWidth, {
          [styles.detailViewOpen]: showDetailPane,
        }),
        detailView: styles.detailViewWidth,
      };
    case 'tablet':
      return {
        contextualNav: styles.contextualNavWidth,
        detailView: styles.detailViewWidth,
      };
    case 'mobile':
      return {
        contextualNav: styles.fullWidth,
        detailView: styles.fullWidth,
      };
    default:
      throw new UnreachableError(screenMode);
  }
}

/**
 * The root wrapper of the brand tab
 */
export const BrandTabRootWrapper: React.ComponentType<{
  children: React.ReactNode;
  pageLayoutStore: PageLayoutStore;
}> = observer((props: { children: React.ReactNode; pageLayoutStore: PageLayoutStore }) => {
  return (
    <div
      className={classNames(styles.rootWrapper, {
        [styles.sheet]: props.pageLayoutStore.layout === PageLayout.PORTRAIT,
      })}
    >
      {props.children}
    </div>
  );
});

/**
 * A wrapper to reset the width of the brand tab to the original object panel width
 */
export function BrandTabResetWidthWrapper(props: { children: React.ReactNode }): React.JSX.Element {
  return <div className={styles.resetObjectPanelWidth}>{props.children}</div>;
}
