// Copyright 2024 Canva Inc. All Rights Reserved.

import { getAppearance } from '@/identity/profile/api/profile/ts/appearance';
import type { AppearanceTheme } from '@/identity/profile/api/profile/ts/profile_proto';
import { disableInputZoom } from 'base/platform_quirks/disable_input_zoom';
import { action } from 'mobx';
import type * as mobx from 'mobx';
import * as React from 'react';
import type { Span, TracerProvider } from 'services/telemetry/tracing';
import { isPortraitMobileScreen } from 'ui/base/device_capabilities/screen';
import { Breakpoint } from 'ui/base/metrics/metrics';
import { setSsrBreakpoint } from 'ui/base/responsive/configure';
import { Skeleton } from './skeleton';
import type { SkeletonBootstrap } from './skeleton_bootstrap_proto';
import { DeviceType } from './skeleton_bootstrap_proto';
import { SkeletonConfiguration } from './skeleton_configuration';

const breakpointForDeviceType: Record<DeviceType, Breakpoint> = {
  [DeviceType.MOBILE]: Breakpoint.DEFAULT,
  [DeviceType.TABLET]: Breakpoint.SMALL,
  [DeviceType.DESKTOP]: Breakpoint.MEDIUM,
};

export type ShowDialog = (DialogComponent: React.ComponentType<{ onClose(): void }>) => void;

export function installSkeleton({
  app,
  appearanceTheme,
  bootstrap,
  tracerProvider,
  parentSpan,
  containedPage,
}: {
  app: mobx.IObservableValue<React.ComponentType<Record<string, never>>>;
  appearanceTheme?: AppearanceTheme;
  bootstrap: SkeletonBootstrap | undefined;
  tracerProvider: TracerProvider;
  parentSpan: Span;
  containedPage: boolean;
}): {
  skeleton: SkeletonConfiguration;
  showDialog: ShowDialog;
  dismissDialog: (() => void) | undefined;
} {
  setSsrBreakpoint(breakpointForDeviceType[bootstrap?.deviceType ?? DeviceType.MOBILE]);
  disableInputZoom();

  const tracer = tracerProvider.getTracer('seo_landing_page.skeleton');
  const renderSkeletonSpan = tracer.startSpan('skeleton_render', parentSpan);
  const onMount = () => {
    renderSkeletonSpan.end();
  };

  const skeleton = new SkeletonConfiguration();
  skeleton.containedPage = containedPage;

  const showDialog: ShowDialog = action((Modal: React.ComponentType<{ onClose(): void }>) => {
    const Dialog = () => <Modal onClose={uninstallDialog} />;
    const uninstallDialog = action(() => {
      // only unset Layer if set by this showDialog.
      if (skeleton.ModalLayer === Dialog) {
        skeleton.ModalLayer = undefined;
      }
    });
    skeleton.ModalLayer = Dialog;
  });

  // Used to dismiss the full-screen mobile auth flyout [not part of SSR snapshot]
  // Notably if a user starts in landscape and then rotates to portrait,
  // they will be left without a close button available.
  const dismissDialog = isPortraitMobileScreen()
    ? action(() => {
        skeleton.ModalLayer = undefined;
      })
    : undefined;

  const appearance = getAppearance(appearanceTheme);

  app.set(() => <Skeleton config={skeleton} appearance={appearance} onMount={onMount} />);
  return { skeleton, showDialog, dismissDialog };
}
