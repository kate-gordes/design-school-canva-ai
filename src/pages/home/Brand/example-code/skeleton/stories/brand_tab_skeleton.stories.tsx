import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import type { Meta, StoryObj } from '@storybook/react';
import { FakeOfflineStatusStore } from 'base/offline_status/fake/fake_offline_status_store';
import { OfflineStatus } from 'base/offline_status/offline_status_proto';
import { range } from 'base/range';
import { computed } from 'mobx';
import { createBrandTabFooter } from 'pages/Editor/search/brand_tab/ui/brand_tab_footer/create';
import { EditButton } from 'pages/Editor/search/brand_tab/ui/edit_button/edit_button';
import { SaveCancelButtons } from 'pages/Editor/search/brand_tab/ui/save_cancel_buttons/save_cancel_buttons';
import { TabHeader } from 'pages/Editor/search/brand_tab/ui/tab_header/tab_header';
import { createContentsWithFooter } from 'pages/Editor/search/ui/footer/contents_with_footer/create';
import { ObjectPanelScrollContainer } from 'pages/Editor/search/ui/scroll_container/object_panel_scroll_container';
import { createFakeObjectPanel } from 'pages/Editor/surfaces/object_panel/fake/fake';
import { Box } from 'ui/base/box/box';
import { Button } from 'ui/base/button/button';
import { TextInput } from 'ui/base/form/text_input/text_input';
import { BrandKitIcon } from 'ui/base/icons/brand_kit/icon';
import { SearchIcon } from 'ui/base/icons/search/icon';
import { Grid } from 'ui/base/layout/layout';
import { Menu, MenuItem } from 'ui/base/menu/menu';
import { PageLayout } from 'ui/base/page_layout/page_layout';
import { Placeholder } from 'ui/base/placeholder/placeholder';
import { Text } from 'ui/base/typography/typography';
import { createViewStack } from 'ui/base/view_stack/view_stack';
import type { ScreenMode } from '@/pages/home/Brand/example-code/skeleton/brand_tab_skeleton';
import { BrandTabRootWrapper } from '@/pages/home/Brand/example-code/skeleton/brand_tab_skeleton';
import { createBrandTabSkeleton } from '@/pages/home/Brand/example-code/skeleton/create';

export default {
  title: 'pages/Editor/search/brand_tab/skeleton/brand_tab_skeleton',
} satisfies Meta as Meta;

export const BrandTabSkeletonDesktop: StoryObj = {
  name: 'Screen: desktop',

  render: () => renderStory('desktop'),
};

export const BrandTabSkeletonTablet: StoryObj = {
  name: 'Screen: tablet',

  render: () => renderStory('tablet'),
};

export const BrandTabSkeletonMobile: StoryObj = {
  name: 'Screen: mobile',

  parameters: {
    visreg: false,
    viewport: {
      defaultViewport: 'mobile',
    },
  },

  render: () => renderStory('mobile'),
};

function renderStory(screenMode: ScreenMode) {
  footerController.hideFooter();

  showDetailView();

  const pageLayoutStore = {
    layout: screenMode === 'mobile' ? PageLayout.PORTRAIT : PageLayout.LANDSCAPE,
  };

  const offlineStatus = select(
    'Offline status',
    { Online: OfflineStatus.ONLINE, Offline: OfflineStatus.OFFLINE },
    OfflineStatus.ONLINE,
  );
  offlineStatusStore.setStatus(offlineStatus);

  const BrandTabSkeleton = createBrandTabSkeleton({
    ContextualNav: FakeContextualNav,
    pageLayoutStore,
    isTablet: computed(() => screenMode === 'tablet'),
    searchInputConfiguration: {
      SearchInput: FakeSearchInput,
    },
    BrandKitSwitcher: FakeBrandKitSwitcher,
    ContentsWithFooter,
    detailViewStack,
    footer,
    offlineStatusStore,
  });

  const ObjectPanel = createFakeObjectPanel({
    pageLayoutStore,
    installTabs: objectPanelController => {
      const rootViewStack = createViewStack();

      rootViewStack.viewStackController.openView({
        body: <BrandTabSkeleton />,
      });

      const tabItem = objectPanelController.registerTab('basic', {
        icon: <BrandKitIcon size="medium" />,
        activeIcon: <BrandKitIcon size="medium" />,
        iconColor: 'turquoise',
        name: 'Click',
        displayOptions: {
          drawer: {
            width: 'auto',
          },
        },
      });

      tabItem?.init(() => {
        return {
          body: (
            <BrandTabRootWrapper pageLayoutStore={pageLayoutStore}>
              <rootViewStack.ViewStackBody />
            </BrandTabRootWrapper>
          ),
        };
      });

      tabItem?.activate({});
    },
  });
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ObjectPanel />
    </div>
  );
}

const offlineStatusStore = new FakeOfflineStatusStore();

const { footer, footerController } = createBrandTabFooter();

const detailViewStack = createViewStack({ transitionVariant: 'none' });

function showDetailView() {
  if (!detailViewStack.viewStackController.stackLength) {
    detailViewStack.viewStackController.openView({
      body: <FakeDetailPane />,
      header: <FakeDetailHeader />,
    });
  }
}

function hideDetailView() {
  detailViewStack.viewStackController.clear();
}
const { ContentsWithFooter, FooterSiblingContainer } = createContentsWithFooter();

function FakeContextualNav() {
  return (
    <Box padding="0" background="feedbackInfoSubtle">
      <Text>Contextual Menu</Text>
      <Menu role="menu">
        {range(20).map(index => (
          <MenuItem key={index} onClick={showDetailView}>
            Menu Item {index}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

function FakeSearchInput() {
  return <TextInput placeholder="Search" start={<SearchIcon />} />;
}

function FakeBrandKitSwitcher() {
  return <Button variant="secondary">BK Switcher</Button>;
}

function onClickEdit() {
  footerController.showFooter(() => (
    <SaveCancelButtons
      loading={false}
      onSave={action('onSave')}
      onCancel={() => footerController.hideFooter()}
    />
  ));
}

function FakeDetailHeader() {
  return (
    <TabHeader
      header={{
        title: 'Click for footer ->',
        goBack: hideDetailView,
        endButtons: [<EditButton key="edit" onClick={onClickEdit} />],
      }}
    />
  );
}

function FakeDetailPane() {
  return (
    <Box height="full" width="full" paddingEnd="2u">
      <ObjectPanelScrollContainer>
        <FooterSiblingContainer>
          <Box padding="2u" background="feedbackPositiveSubtle" height="full">
            <Text>Detail Pane</Text>
            <Grid columns={3} spacing="0.5u">
              {range(100).map(index => (
                <FakeCarouselItem key={index} />
              ))}
            </Grid>
          </Box>
        </FooterSiblingContainer>
      </ObjectPanelScrollContainer>
    </Box>
  );
}

function FakeCarouselItem() {
  return (
    <div style={{ width: '100%', height: '100px' }}>
      <Placeholder shape="rectangle" disableAnimations={true} />
    </div>
  );
}
