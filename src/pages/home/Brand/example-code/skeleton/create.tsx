import { OfflineStatus } from 'base/offline_status/offline_status_store';
import type { OfflineStatusStore } from 'base/offline_status/offline_status_store';
import type { IComputedValue } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ContentsWithFooterProps } from 'pages/Editor/search/ui/footer/contents_with_footer/contents_with_footer';
import * as React from 'react';
import { Box } from 'ui/base/box/box';
import { Rows } from 'ui/base/layout/layout';
import type { PageLayoutStore } from 'ui/base/page_layout/page_layout';
import { PageLayout } from 'ui/base/page_layout/page_layout';
import { Scrollable } from 'ui/base/scrollable/scrollable';
import type { ViewStackProps } from 'ui/base/view_stack/view_stack';
import { OfflineEmptyState } from 'ui/offline/ui/offline_empty_state/offline_empty_state';
import type { ScreenMode } from './brand_tab_skeleton';
import { BrandTabSkeleton } from './brand_tab_skeleton';

type CreateBrandTabSkeletonOpts = {
  searchInputConfiguration:
    | {
        SearchInput: React.ComponentType;
      }
    | undefined;
  pageLayoutStore: PageLayoutStore;
  isTablet: IComputedValue<boolean>;
  detailViewStack: {
    ViewStackHeader: React.ComponentType<ViewStackProps>;
    ViewStackBody: React.ComponentType<ViewStackProps>;
    viewStackController: {
      stackLength: number;
    };
  };
  BrandKitSwitcher: React.ComponentType;
  ContextualNav: React.ComponentType;
  ContentsWithFooter: React.ComponentType<ContentsWithFooterProps>;
  footer: IComputedValue<React.ReactNode>;
  offlineStatusStore: OfflineStatusStore;
};

export function createBrandTabSkeleton({
  searchInputConfiguration,
  pageLayoutStore,
  isTablet,
  detailViewStack,
  BrandKitSwitcher,
  ContextualNav,
  ContentsWithFooter,
  footer,
  offlineStatusStore,
}: CreateBrandTabSkeletonOpts): React.ComponentType {
  const SkeletonContextualNav = () => (
    <Box padding="2u" paddingEnd="0" height="full" display="flex" flexDirection="column">
      {searchInputConfiguration?.SearchInput != null && (
        <Box paddingBottom="1u" flex="none">
          <searchInputConfiguration.SearchInput />
        </Box>
      )}
      <Scrollable>
        <Rows spacing="1u">
          <BrandKitSwitcher />
          <ContextualNav />
        </Rows>
      </Scrollable>
    </Box>
  );

  const SkeletonDetailView = observer(() => {
    if (offlineStatusStore.status === OfflineStatus.OFFLINE) {
      return (
        <Box height="full" display="flex" flexDirection="column" justifyContent="center">
          <Box display="block">
            <OfflineEmptyState />
          </Box>
        </Box>
      );
    }
    return (
      <ContentsWithFooter footerContent={footer.get()} isFooterVisible={footer.get() != null}>
        <Box padding="0" display="flex" flexDirection="column" height="full" width="full">
          <Box paddingBottom="0" flex="none">
            <detailViewStack.ViewStackHeader />
          </Box>
          <detailViewStack.ViewStackBody />
        </Box>
      </ContentsWithFooter>
    );
  });

  const Skeleton = observer(() => {
    const screenMode: ScreenMode =
      pageLayoutStore.layout === PageLayout.PORTRAIT
        ? 'mobile'
        : isTablet.get()
          ? 'tablet'
          : 'desktop';

    return (
      <BrandTabSkeleton
        screenMode={screenMode}
        contextualNav={<SkeletonContextualNav />}
        showDetailPane={detailViewStack.viewStackController.stackLength > 0}
        detailPane={<SkeletonDetailView />}
      />
    );
  });
  return Skeleton;
}
