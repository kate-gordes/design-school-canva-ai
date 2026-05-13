// @formatter:off
// Copyright Canva Inc. All Rights Reserved.
// Generated from pages/seo_landing_page/skeleton/skeleton_bootstrap.proto.

import { Proto } from 'base/proto/proto';
import type { EnumUtil } from 'base/proto/proto';

export const enum DeviceType {
  MOBILE = 1,
  TABLET,
  DESKTOP,
}

export const DeviceTypeUtil: EnumUtil<DeviceType> = Proto.createEnumUtil<DeviceType>(() => [
  /* B */ 1, /* C */ 2, /* D */ 3,
]);

export interface SkeletonBootstrap {
  /**
   * Device type associated with the request. MOBILE, DESKTOP, TABLET.
   * This is used to suggest the best size breakpoint during SSR. NO OTHER usages are expected.
   */
  readonly deviceType: DeviceType;
}

/**
 * *
 * Information needed by the Skeleton frontend component of the SEO page. This may include:
 * - Device and resolution values useful to the frontend during SSR render, when client info is
 * not available
 */
export const SkeletonBootstrap: {
  new (opts: {
    /**
     * Device type associated with the request. MOBILE, DESKTOP, TABLET.
     * This is used to suggest the best size breakpoint during SSR. NO OTHER usages are expected.
     */
    deviceType: DeviceType;
  }): SkeletonBootstrap;

  serialize(m: SkeletonBootstrap): object;
  deserialize(o: object): SkeletonBootstrap;
} = Proto.createMessage(() => ({
  deviceType: Proto.requiredStringEnum(/* A */ 1, DeviceTypeUtil),
}));
