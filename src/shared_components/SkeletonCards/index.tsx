import React from 'react';
import { Placeholder, Rows } from '@canva/easel';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';

// Placeholder stack matching a DesignCard's thumbnail + title + meta rows.
// Used while the Connect API snapshot is hydrating so consumers stop showing
// fixture data under a real user's identity.
//
// Plain divs: Placeholder measures its parent box — Easel Box only accepts
// "unset" | "full" for width/height, so we need inline style containers to
// pin the thumbnail aspect ratio and text-row heights.
export function SkeletonDesignCard({ index = 0 }: { index?: number }): React.ReactNode {
  return (
    <div style={{ width: '100%' }}>
      <Rows spacing="1u">
        <div style={{ width: '100%', aspectRatio: '4 / 3' }}>
          <Placeholder shape="rectangle" index={index} />
        </div>
        <div style={{ width: '70%', height: 16 }}>
          <Placeholder shape="textRectangle" index={index} />
        </div>
        <div style={{ width: '40%', height: 12 }}>
          <Placeholder shape="textRectangle" index={index + 1} />
        </div>
      </Rows>
    </div>
  );
}

// Placeholder stack matching a FolderCard (horizontal on desktop: square
// thumbnail + two short text rows alongside).
export function SkeletonFolderCard({ index = 0 }: { index?: number }): React.ReactNode {
  return (
    <div
      style={{
        width: '100%',
        padding: 'calc(var(--base-unit, 8px) * 1)',
        display: 'flex',
        alignItems: 'center',
        gap: 'calc(var(--base-unit, 8px) * 2)',
      }}
    >
      <div style={{ width: 56, height: 56, flexShrink: 0 }}>
        <Placeholder shape="square" index={index} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Rows spacing="1u">
          <div style={{ width: '60%', height: 14 }}>
            <Placeholder shape="textRectangle" index={index} />
          </div>
          <div style={{ width: '40%', height: 12 }}>
            <Placeholder shape="textRectangle" index={index + 1} />
          </div>
        </Rows>
      </div>
    </div>
  );
}

export function SkeletonDesignGrid({ count = 12 }: { count?: number }): React.ReactNode {
  return (
    <ResponsiveCardGrid spacing="3u">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonDesignCard key={i} index={i} />
      ))}
    </ResponsiveCardGrid>
  );
}

export function SkeletonFolderGrid({ count = 6 }: { count?: number }): React.ReactNode {
  return (
    <ResponsiveCardGrid spacing="2u">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonFolderCard key={i} index={i} />
      ))}
    </ResponsiveCardGrid>
  );
}
