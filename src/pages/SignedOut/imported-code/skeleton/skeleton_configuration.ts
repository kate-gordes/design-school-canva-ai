// Copyright 2024 Canva Inc. All Rights Reserved.

import * as mobx from 'mobx';
import type * as React from 'react';
import type { HeaderProps as RedesignedHeaderProps } from 'ui/nav/header2/create_redesigned_header';

/**
 * Defines the API through which features install their behavior.
 */
export class SkeletonConfiguration {
  // TODO(SEOPL-768): remove once content spacing/width is reconciled
  @mobx.observable.ref
  showVisualSuitePageRevamp2025?: boolean = false;

  // TODO(SEOPL-768): remove once content spacing/width is reconciled
  @mobx.observable.ref
  containedPage?: boolean = true;

  @mobx.observable.ref
  Content?: React.ComponentType = undefined;

  @mobx.observable.ref
  Header?: React.ComponentType<RedesignedHeaderProps> = undefined;

  /**
   * PEG-185 Global Nav Redesign experiment
   */
  @mobx.observable.ref
  enableRedesignedHeader?: boolean = false;

  @mobx.observable.ref
  Footer?: React.ComponentType = undefined;

  @mobx.observable.ref
  StickyFooterAction?: React.ComponentType = undefined;

  /**
   * Defines scope where usePageAnalytics can be used to track analytics events.
   */
  @mobx.observable.ref
  PageAnalyticsContextProvider?: React.ComponentType<
    React.PropsWithChildren<Record<string, never>>
  > = undefined;

  /**
   * Defines scope where useAuthDialog can be used to show the auth dialog.
   */
  @mobx.observable.ref
  AuthContextProvider?: React.ComponentType<React.PropsWithChildren<Record<string, never>>> =
    undefined;

  /**
   * Defines scope where useErros can be used for logging.
   */
  @mobx.observable.ref
  ErrorContextProvider?: React.ComponentType<React.PropsWithChildren<Record<string, never>>> =
    undefined;

  /**
   * Defines scope where useServices can be used to install different services.
   */
  @mobx.observable.ref
  ServicesContextProvider?: React.ComponentType<React.PropsWithChildren<Record<string, never>>> =
    undefined;

  /**
   * Defines scope where bootstrap data can be extract via hooks like useSession and useLocale
   */
  @mobx.observable.ref
  BootstrapContextProvider?: React.ComponentType<React.PropsWithChildren<Record<string, never>>> =
    undefined;

  /**
   * Defines scope where useVisibilityObserver can be used to track component visibility
   */
  @mobx.observable.ref
  VisibilityObserverContextProvider?: React.ComponentType<
    React.PropsWithChildren<Record<string, never>>
  > = undefined;

  /**
   * Defines scope where media hooks can be used to control audio and video playback
   */
  @mobx.observable.ref
  MediaContextProvider?: React.ComponentType<React.PropsWithChildren<Record<string, never>>> =
    undefined;

  /**
   * Auth Pop Up appears on page load, if Google One Tap is not showing, providing user
   * a small auth panel to authenticate.
   */
  @mobx.observable.ref
  AuthPopUp?: React.ComponentType = undefined;

  /**
   * A plugin point for modals that appear above the page and lightbox, for example the signup or
   * the subscription modals.
   * It is the responsibility of the assigned ComponentType to create a modal, for example by using
   * a Layer.
   */
  @mobx.observable.ref
  ModalLayer?: React.ComponentType = undefined;

  /**
   * A plugin point for toast notifications
   */
  @mobx.observable.ref
  NotificationLayer?: React.ComponentType = undefined;

  /**
   * A plugin point for Ask Canva / AI Help Assistant button
   */
  @mobx.observable.ref
  Assistant?: React.ComponentType = undefined;

  @mobx.observable.ref
  DndContext?: React.ComponentType = undefined;
}
