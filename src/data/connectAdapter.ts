import type { CanvaDesign, CanvaFolder } from '@canva-ct/connect';
import type { RecentDesign } from './data';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

function relativeTime(iso?: string): string {
  if (!iso) return 'Recently edited';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Recently edited';
  const diff = Date.now() - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  if (diff < minute) return 'Edited just now';
  if (diff < hour) return `Edited ${Math.round(diff / minute)} minutes ago`;
  if (diff < day) {
    const n = Math.round(diff / hour);
    return `Edited ${n} ${n === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diff < week) {
    const n = Math.round(diff / day);
    return `Edited ${n} ${n === 1 ? 'day' : 'days'} ago`;
  }
  if (diff < month) {
    const n = Math.round(diff / week);
    return `Edited ${n} ${n === 1 ? 'week' : 'weeks'} ago`;
  }
  const n = Math.round(diff / month);
  return `Edited ${n} ${n === 1 ? 'month' : 'months'} ago`;
}

// Connect API doesn't expose a doctype; fall back to a generic bucket that
// the existing card/row components handle. "Image" renders a square-ish card
// without chrome we can't populate.
export function connectDesignToRecent(d: CanvaDesign): RecentDesign {
  return {
    id: d.id,
    title: d.title || 'Untitled design',
    doctype: 'Image',
    editedTime: relativeTime(d.updated_at ?? d.created_at),
    thumbnailUrl: d.thumbnail?.url,
  };
}

export function connectDesignsToRecents(designs: CanvaDesign[]): RecentDesign[] {
  return designs.map(connectDesignToRecent);
}

// Connect API's CanvaFolder doesn't expose isPrivate or itemCount, so we
// default to non-private / zero items. The UI tolerates both.
export function connectFolderToFolderData(f: CanvaFolder): FolderData {
  return {
    id: f.id,
    name: f.name || 'Untitled folder',
    isPrivate: false,
    itemCount: 0,
  };
}

export function connectFoldersToFolderData(folders: CanvaFolder[]): FolderData[] {
  return folders.map(connectFolderToFolderData);
}
