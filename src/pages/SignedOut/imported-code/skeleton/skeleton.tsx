// Copyright 2024 Canva Inc. All Rights Reserved.

import { Preconditions } from 'base/preconditions';
import classNames from 'classnames';
import * as mobxReactLite from 'mobx-react-lite';
import { useEffect } from 'react';
import * as React from 'react';
import { SkipLink } from 'ui/base/a11y/skip_link/skip_link';
import { Box } from 'ui/base/box/box';
import { supportsSafeAreaInsetValues } from 'ui/base/device_capabilities/screen';
import { Layer, LayerLevel } from 'ui/base/layer/layer';
import { RootContainer } from 'ui/base/root_container/root_container';
import type { AdaptiveOrStaticAppearance } from 'ui/base/theme/theme';
import styles from './skeleton.css';
import type { SkeletonConfiguration } from './skeleton_configuration';

export const Skeleton: React.ComponentType<{
  config: SkeletonConfiguration;
  appearance?: AdaptiveOrStaticAppearance;
  onMount: () => void;
}> = mobxReactLite.observer(props => {
  const { config, appearance, onMount } = props;
  const {
    Header,
    enableRedesignedHeader,
    Content,
    Footer,
    StickyFooterAction,
    ModalLayer,
    AuthPopUp,
    ErrorContextProvider: maybeErrorContextProvider,
    PageAnalyticsContextProvider: maybePageAnalyticsContextProvider,
    AuthContextProvider: maybeAuthContextProvider,
    ServicesContextProvider: maybeServicesContextProvider,
    BootstrapContextProvider: maybeBootstrapContextProvider,
    VisibilityObserverContextProvider: maybeVisibilityObserverContextProvider,
    MediaContextProvider: maybeMediaContextProvider,
    NotificationLayer,
    Assistant,
    DndContext: maybeDndContext,
    showVisualSuitePageRevamp2025,
    containedPage,
  } = config;
  const ErrorContextProvider = Preconditions.checkExists(
    maybeErrorContextProvider,
    'ErrorContextProvider must be provided',
  );
  const PageAnalyticsContextProvider = Preconditions.checkExists(
    maybePageAnalyticsContextProvider,
    'PageAnalyticsContextProvider must be provided',
  );
  const AuthContextProvider = Preconditions.checkExists(
    maybeAuthContextProvider,
    'AuthContextProvider must be provided',
  );
  const ServicesContextProvider = Preconditions.checkExists(
    maybeServicesContextProvider,
    'ServicesContextProvider must be provided',
  );
  const BootstrapContextProvider = Preconditions.checkExists(
    maybeBootstrapContextProvider,
    'BootstrapContextProvider must be provided',
  );
  const VisibilityObserverContextProvider = Preconditions.checkExists(
    maybeVisibilityObserverContextProvider,
    'VisibilityObserverContextProvider must be provided',
  );
  const MediaContextProvider = Preconditions.checkExists(
    maybeMediaContextProvider,
    'MediaContextProvider must be provided',
  );

  const withApplyInsets = supportsSafeAreaInsetValues();

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  const mainId = React.useId();

  const DndContext = maybeDndContext ?? React.Fragment;

  const [headerExpanded, setHeaderExpanded] = React.useState<boolean>(true);

  return (
    <RootContainer
      appearance={appearance}
      className={classNames(styles.rootContainer, {
        [styles.rootContainerGradient]: showVisualSuitePageRevamp2025,
      })}
    >
      <ErrorContextProvider>
        <PageAnalyticsContextProvider>
          <AuthContextProvider>
            <ServicesContextProvider>
              <BootstrapContextProvider>
                <VisibilityObserverContextProvider>
                  <MediaContextProvider>
                    <DndContext>
                      <SkipLink to={mainId} variant="skipToMainContent" />
                      {Header && (
                        <div
                          className={classNames(styles.header, {
                            [styles.applyInsets]: withApplyInsets,
                            /**
                             * PEG-185 Global Nav Redesign experiment
                             * The redesigned header manages its own
                             * background color and safe area inset
                             */
                            [styles.redesignedHeader]: enableRedesignedHeader,
                            [styles.collapsed]: !headerExpanded,
                          })}
                        >
                          <Header onExpandedChange={setHeaderExpanded} />
                        </div>
                      )}
                      <Box
                        id={mainId}
                        paddingX={
                          // TODO(SEOPL-768): clean up once content spacing/width is reconciled
                          containedPage ? { default: '2u', mediumUp: '4u' } : '0'
                        }
                        paddingBottom={{ default: '0', smallUp: '2u' }}
                        className={classNames(styles.main, {
                          [styles.contained]: containedPage,
                        })}
                        tagName="main"
                      >
                        {Content && <Content />}
                      </Box>
                      {Footer && (
                        <Box paddingTop={{ default: '6u', smallUp: '8u' }}>
                          <Footer />
                        </Box>
                      )}
                      {StickyFooterAction && (
                        <div
                          className={classNames(styles.stickyContentContainer, {
                            [styles.applyInsets]: withApplyInsets,
                          })}
                        >
                          <StickyFooterAction />
                        </div>
                      )}
                      {Assistant && (
                        <div className={styles.assistant}>
                          <Assistant />
                        </div>
                      )}
                      {ModalLayer && (
                        <Layer open={true} level={LayerLevel.MODALS}>
                          <ModalLayer />
                        </Layer>
                      )}
                      {NotificationLayer && <NotificationLayer />}
                      {AuthPopUp && (
                        <div style={{ zIndex: LayerLevel.PINS }}>
                          <AuthPopUp />
                        </div>
                      )}
                    </DndContext>
                  </MediaContextProvider>
                </VisibilityObserverContextProvider>
              </BootstrapContextProvider>
            </ServicesContextProvider>
          </AuthContextProvider>
        </PageAnalyticsContextProvider>
      </ErrorContextProvider>
    </RootContainer>
  );
});
