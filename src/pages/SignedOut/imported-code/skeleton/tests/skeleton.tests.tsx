// Copyright 2024 Canva Inc. All Rights Reserved.

import '@testing-library/jest-dom';
import * as React from 'react';
import type { Span } from 'services/telemetry/tracing';
import type { TracingTestUtils } from 'services/telemetry/tracing_implementation/tests/helpers';
import { createTracingTestUtils } from 'services/telemetry/tracing_implementation/tests/helpers';
import * as screenCapabilities from 'ui/base/device_capabilities/screen';
import { ErrorBoundary } from 'ui/base/error_boundary/error_boundary';
import { render } from 'ui/base/testing/testing';
import { installSkeleton } from '@/pages/SignedOut/imported-code/skeleton/install';
import { Skeleton } from '@/pages/SignedOut/imported-code/skeleton/skeleton';
import { SkeletonConfiguration } from '@/pages/SignedOut/imported-code/skeleton/skeleton_configuration';

export const ComponentWithChildren: React.ComponentType<React.PropsWithChildren> = ({ children }) =>
  children;

const setContextProviders = (args: {
  skeleton: SkeletonConfiguration;
  AuthContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
  ErrorContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
  PageAnalyticsContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
  ServicesContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
  BootstrapContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
  VisibilityObserverContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
  MediaContextProvider?: React.ComponentType<React.PropsWithChildren> | undefined;
}) => {
  const {
    skeleton,
    AuthContextProvider,
    ErrorContextProvider,
    PageAnalyticsContextProvider,
    ServicesContextProvider,
    BootstrapContextProvider,
    VisibilityObserverContextProvider,
    MediaContextProvider,
  } = args;
  skeleton.AuthContextProvider =
    'AuthContextProvider' in args ? AuthContextProvider : ComponentWithChildren;
  skeleton.ErrorContextProvider =
    'ErrorContextProvider' in args ? ErrorContextProvider : ComponentWithChildren;
  skeleton.PageAnalyticsContextProvider =
    'PageAnalyticsContextProvider' in args ? PageAnalyticsContextProvider : ComponentWithChildren;
  skeleton.ServicesContextProvider =
    'ServicesContextProvider' in args ? ServicesContextProvider : ComponentWithChildren;
  skeleton.BootstrapContextProvider =
    'BootstrapContextProvider' in args ? BootstrapContextProvider : ComponentWithChildren;
  skeleton.VisibilityObserverContextProvider =
    'VisibilityObserverContextProvider' in args
      ? VisibilityObserverContextProvider
      : ComponentWithChildren;
  skeleton.MediaContextProvider =
    'MediaContextProvider' in args ? MediaContextProvider : ComponentWithChildren;
};

describe('skeleton', () => {
  it('renders high-level page structure', async () => {
    const config = new SkeletonConfiguration();
    config.Header = () => <div>header</div>;
    config.Content = () => <div>content</div>;
    config.Footer = () => <div>footer</div>;
    config.StickyFooterAction = () => <div>sticky CTA</div>;
    setContextProviders({
      skeleton: config,
      ErrorContextProvider: ({ children }) => <div>error provider {children}</div>,
      PageAnalyticsContextProvider: ({ children }) => <div>analytics provider {children}</div>,
      AuthContextProvider: ({ children }) => <div>auth provider {children}</div>,
      ServicesContextProvider: ({ children }) => <div>services provider {children}</div>,
      BootstrapContextProvider: ({ children }) => <div>session provider {children}</div>,
      VisibilityObserverContextProvider: ({ children }) => (
        <div>visibility observer provider {children}</div>
      ),
      MediaContextProvider: ({ children }) => <div>media provider {children}</div>,
    });

    expect(<Skeleton config={config} onMount={jest.fn()} />).toMatchRenderedSnapshot();
  });

  it('renders high-level page structure for non-contained page', async () => {
    const config = new SkeletonConfiguration();
    config.Header = () => <div>header</div>;
    config.Content = () => <div>content</div>;
    config.Footer = () => <div>footer</div>;
    config.StickyFooterAction = () => <div>sticky CTA</div>;
    config.containedPage = false;
    setContextProviders({
      skeleton: config,
      ErrorContextProvider: ({ children }) => <div>error provider {children}</div>,
      PageAnalyticsContextProvider: ({ children }) => <div>analytics provider {children}</div>,
      AuthContextProvider: ({ children }) => <div>auth provider {children}</div>,
      ServicesContextProvider: ({ children }) => <div>services provider {children}</div>,
      BootstrapContextProvider: ({ children }) => <div>session provider {children}</div>,
      VisibilityObserverContextProvider: ({ children }) => (
        <div>visibility observer provider {children}</div>
      ),
      MediaContextProvider: ({ children }) => <div>media provider {children}</div>,
    });

    expect(<Skeleton config={config} onMount={jest.fn()} />).toMatchRenderedSnapshot();
  });

  it('throws when rendering without ErrorContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, ErrorContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('ErrorContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('throws when rendering without AuthContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, AuthContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('AuthContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('throws when rendering without PageAnalyticsContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, PageAnalyticsContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('PageAnalyticsContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('throws when rendering without ServicesContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, ServicesContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('ServicesContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('throws when rendering without BootstrapContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, BootstrapContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('BootstrapContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('throws when rendering without VisibilityObserverContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, VisibilityObserverContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('VisibilityObserverContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('throws when rendering without MediaContextProvider', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config, MediaContextProvider: undefined });
    const errorCollector = jest.fn();

    render(
      <ErrorBoundary errorCollector={errorCollector}>
        <Skeleton config={config} onMount={jest.fn()} />{' '}
      </ErrorBoundary>,
    );

    expect(errorCollector).toHaveBeenCalledWith(
      new Error('MediaContextProvider must be provided'),
      expect.anything(),
    );
  });

  it('renders Auth popup', async () => {
    const config = new SkeletonConfiguration();
    config.Header = () => <div>header</div>;
    config.Content = () => <div>content</div>;
    config.Footer = () => <div>footer</div>;
    config.AuthPopUp = () => <div>Auth popup</div>;
    setContextProviders({ skeleton: config });

    expect(<Skeleton config={config} onMount={jest.fn()} />).toMatchRenderedSnapshot();
  });

  it('renders Assistant button and Notifications', async () => {
    const config = new SkeletonConfiguration();
    config.Header = () => <div>header</div>;
    config.Content = () => <div>content</div>;
    config.Footer = () => <div>footer</div>;
    config.Assistant = () => <div>Assistant button</div>;
    config.NotificationLayer = () => <div>Notification layer</div>;
    setContextProviders({ skeleton: config });

    expect(<Skeleton config={config} onMount={jest.fn()} />).toMatchRenderedSnapshot();
  });

  it('calls onMount when mounted', async () => {
    const config = new SkeletonConfiguration();
    setContextProviders({ skeleton: config });
    const onMount = jest.fn();

    render(<Skeleton config={config} onMount={onMount} />);

    expect(onMount).toHaveBeenCalled();
  });

  describe('install', () => {
    let tracingTestUtils: TracingTestUtils;
    let testRootSpan: Span;

    beforeEach(() => {
      tracingTestUtils = createTracingTestUtils();
      const testTracer = tracingTestUtils.tracerProvider.getTracer('skeleton_install_tracer');
      testRootSpan = testTracer.startRootSpan('test_root_span');
    });

    it('records OTEL span and closes the span when mounted', async () => {
      let Skeleton: (() => React.JSX.Element) | undefined;
      const mockApp = {
        set: jest.fn(fn => {
          Skeleton = fn;
        }),
        get: jest.fn(),
      };
      const { skeleton } = installSkeleton({
        app: mockApp,
        bootstrap: undefined,
        tracerProvider: tracingTestUtils.tracerProvider,
        parentSpan: testRootSpan,
        containedPage: false,
      });
      setContextProviders({ skeleton });

      if (Skeleton) {
        render(<Skeleton />);
      }

      //the test root span was created manually and so needs to be ended manually
      testRootSpan.end();
      await tracingTestUtils.expectAllSpansEnded();

      //check the last captured span
      const capturedSpans = tracingTestUtils.captured.spans;
      const [span] = capturedSpans;
      expect(span.name).toEqual('skeleton_render');
    });

    it('installs with ModalLayer empty', async () => {
      const { skeleton } = installSkeleton({
        app: { get: jest.fn(), set: jest.fn() },
        bootstrap: undefined,
        tracerProvider: tracingTestUtils.tracerProvider,
        parentSpan: testRootSpan,
        containedPage: false,
      });

      expect(skeleton.ModalLayer).toBeUndefined();
    });

    it('adds Modal to ModalLayer slot on showDialog', async () => {
      const { skeleton, showDialog } = installSkeleton({
        app: { get: jest.fn(), set: jest.fn() },
        bootstrap: undefined,
        tracerProvider: tracingTestUtils.tracerProvider,
        parentSpan: testRootSpan,
        containedPage: false,
      });

      showDialog(() => <div role="dialog" />);

      expect(skeleton.ModalLayer).toBeDefined();
      const utils = render(skeleton.ModalLayer && <skeleton.ModalLayer />);
      expect(utils.getByRole('dialog')).toBeInTheDocument();
    });

    it('clears ModalLayer slot on dialog close', async () => {
      const { skeleton, showDialog } = installSkeleton({
        app: { get: jest.fn(), set: jest.fn() },
        bootstrap: undefined,
        tracerProvider: tracingTestUtils.tracerProvider,
        parentSpan: testRootSpan,
        containedPage: false,
      });

      showDialog((props: { onClose(): void }) => (
        <div role="dialog">
          <button onClick={props.onClose} />
        </div>
      ));

      const utils = render(skeleton.ModalLayer && <skeleton.ModalLayer />);
      utils.getByRole('button').click();

      expect(skeleton.ModalLayer).toBeUndefined();
    });

    it('clears ModalLayer slot on dismissDialog when in portrait mobile screen', async () => {
      jest.spyOn(screenCapabilities, 'isPortraitMobileScreen').mockReturnValue(true);

      const { skeleton, showDialog, dismissDialog } = installSkeleton({
        app: { get: jest.fn(), set: jest.fn() },
        bootstrap: undefined,
        tracerProvider: tracingTestUtils.tracerProvider,
        parentSpan: testRootSpan,
        containedPage: false,
      });

      expect(dismissDialog).toBeDefined();

      showDialog(() => <div />);
      expect(skeleton.ModalLayer).toBeDefined();
      if (dismissDialog) {
        dismissDialog();
      }

      expect(skeleton.ModalLayer).toBeUndefined();
    });

    it('returns undefined dismissDialog when not in portrait mobile screen', async () => {
      jest.spyOn(screenCapabilities, 'isPortraitMobileScreen').mockReturnValue(false);

      const { dismissDialog } = installSkeleton({
        app: { get: jest.fn(), set: jest.fn() },
        bootstrap: undefined,
        tracerProvider: tracingTestUtils.tracerProvider,
        parentSpan: testRootSpan,
        containedPage: false,
      });

      expect(dismissDialog).toBeUndefined();
    });
  });
});
