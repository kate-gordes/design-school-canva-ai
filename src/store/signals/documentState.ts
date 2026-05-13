import { signal, computed } from '@preact/signals-react';
import { addDebugHistoryEntry } from './debugHistory';
import type { StateSnapshot } from './debugHistory';
import {
  isDocsAIChange,
  currentDocsAIMetadata,
  beginTextChange,
  flushPendingChange,
  captureDocsSnapshot,
} from './docsHistory';

// Block type definitions
export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'quote';

// Block data structure for Notion-like document editor
export interface BlockData {
  blockId: string;
  blockType: BlockType; // Source of truth for formatting
  markdown: string; // Content only, no prefix
}

// Mapping utilities

export function blockTypeToPrefix(blockType: BlockType): string {
  switch (blockType) {
    case 'h1':
      return '# ';
    case 'h2':
      return '## ';
    case 'h3':
      return '### ';
    case 'bullet':
      return '- ';
    case 'numbered':
      return '1. ';
    case 'quote':
      return '> ';
    case 'paragraph':
      return '';
    default:
      return '';
  }
}

export function prefixToBlockType(prefix: string): BlockType {
  switch (prefix.trim()) {
    case '#':
      return 'h1';
    case '##':
      return 'h2';
    case '###':
      return 'h3';
    case '-':
      return 'bullet';
    case '>':
      return 'quote';
    default:
      if (/^\d+\.$/.test(prefix.trim())) return 'numbered';
      return 'paragraph';
  }
}

export function parseMarkdownPrefix(markdown: string): { prefix: string; content: string } {
  if (markdown.startsWith('### ')) return { prefix: '### ', content: markdown.slice(4) };
  if (markdown.startsWith('## ')) return { prefix: '## ', content: markdown.slice(3) };
  if (markdown.startsWith('# ')) return { prefix: '# ', content: markdown.slice(2) };
  if (markdown.startsWith('- ')) return { prefix: '- ', content: markdown.slice(2) };
  if (markdown.startsWith('> ')) return { prefix: '> ', content: markdown.slice(2) };
  if (/^\d+\. /.test(markdown)) {
    const match = markdown.match(/^(\d+\. )/);
    if (match) return { prefix: match[1], content: markdown.slice(match[1].length) };
  }
  return { prefix: '', content: markdown };
}

// Document title for docs mode (separate from presentationTitle)
export const docsTitle = signal<string>('Untitled design - Doc (Digital)');
export const docsTitleGenerated = signal<boolean>(false);

// Single document = array of blocks
export const blocks = signal<BlockData[]>([{ blockId: '1', blockType: 'h1', markdown: '' }]);

// Currently active/focused block
export const activeBlockId = signal<string | null>('1');

// Command menu state
export const commandMenuOpen = signal<boolean>(false);
export const commandMenuBlockId = signal<string | null>(null);

// Counter for generating unique block IDs
let blockIdCounter = 1;

const generateBlockId = (): string => {
  blockIdCounter += 1;
  return String(blockIdCounter);
};

// Computed: get active block
export const activeBlock = computed(() => {
  const id = activeBlockId.value;
  if (!id) return null;
  return blocks.value.find(b => b.blockId === id) ?? null;
});

// Helper to make a document snapshot
const makeDocSnapshot = (data: BlockData[]): StateSnapshot => ({
  type: 'document',
  documentData: data,
});

// Helper to record a discrete (non-debounced) docs history entry
const recordDocsHistoryEntry = (
  before: BlockData[],
  after: BlockData[],
  scope: 'document' | 'block',
  actionType:
    | 'create'
    | 'delete'
    | 'reorder'
    | 'content-change'
    | 'document-replace'
    | 'block-update',
  description: string,
  targetId: string | null = null,
): void => {
  addDebugHistoryEntry({
    affectedScope: scope,
    initiationScope: scope,
    source: isDocsAIChange.value ? 'canva-ai' : 'human',
    actionType,
    targetId,
    targetCanvasId: null,
    targetElementType: null,
    origin: {
      scope,
      canvasId: null,
      elementId: null,
      elementType: null,
    },
    beforeState: makeDocSnapshot(before),
    afterState: makeDocSnapshot(after),
    description,
    ...(isDocsAIChange.value && currentDocsAIMetadata.value
      ? { aiMetadata: currentDocsAIMetadata.value }
      : {}),
  });
};

// Mutations

export const addBlock = (afterBlockId?: string): string => {
  flushPendingChange();
  const before = captureDocsSnapshot();

  const newBlockId = generateBlockId();
  const newBlock: BlockData = { blockId: newBlockId, blockType: 'paragraph', markdown: '' };

  if (!afterBlockId) {
    // Add to end
    blocks.value = [...blocks.value, newBlock];
  } else {
    const index = blocks.value.findIndex(b => b.blockId === afterBlockId);
    if (index === -1) {
      blocks.value = [...blocks.value, newBlock];
    } else {
      const newBlocks = [...blocks.value];
      newBlocks.splice(index + 1, 0, newBlock);
      blocks.value = newBlocks;
    }
  }

  activeBlockId.value = newBlockId;

  recordDocsHistoryEntry(
    before,
    captureDocsSnapshot(),
    'block',
    'create',
    `Added new block`,
    newBlockId,
  );
  return newBlockId;
};

export const updateBlockMarkdown = (blockId: string, markdown: string): void => {
  beginTextChange(blockId);
  blocks.value = blocks.value.map(b => (b.blockId === blockId ? { ...b, markdown } : b));
};

export const updateBlockType = (blockId: string, blockType: BlockType): void => {
  flushPendingChange();
  const before = captureDocsSnapshot();
  blocks.value = blocks.value.map(b => (b.blockId === blockId ? { ...b, blockType } : b));
  recordDocsHistoryEntry(
    before,
    captureDocsSnapshot(),
    'block',
    'block-update',
    `Changed block type to ${blockType}`,
    blockId,
  );
};

export const deleteBlock = (blockId: string): void => {
  flushPendingChange();
  const before = captureDocsSnapshot();

  // Don't delete if it's the only block
  if (blocks.value.length <= 1) {
    // Just clear the content and reset type
    blocks.value = blocks.value.map(b =>
      b.blockId === blockId ? { ...b, blockType: 'paragraph', markdown: '' } : b,
    );
    recordDocsHistoryEntry(
      before,
      captureDocsSnapshot(),
      'block',
      'delete',
      `Cleared block`,
      blockId,
    );
    return;
  }

  const index = blocks.value.findIndex(b => b.blockId === blockId);
  const newBlocks = blocks.value.filter(b => b.blockId !== blockId);
  blocks.value = newBlocks;

  // Focus previous block or first block
  if (activeBlockId.value === blockId) {
    const prevIndex = Math.max(0, index - 1);
    activeBlockId.value = newBlocks[prevIndex]?.blockId ?? null;
  }

  recordDocsHistoryEntry(
    before,
    captureDocsSnapshot(),
    'block',
    'delete',
    `Deleted block`,
    blockId,
  );
};

export const moveBlock = (blockId: string, targetIndex: number): void => {
  const currentIndex = blocks.value.findIndex(b => b.blockId === blockId);
  if (currentIndex === -1 || currentIndex === targetIndex) return;

  flushPendingChange();
  const before = captureDocsSnapshot();

  const newBlocks = [...blocks.value];
  const [movedBlock] = newBlocks.splice(currentIndex, 1);
  newBlocks.splice(targetIndex, 0, movedBlock);
  blocks.value = newBlocks;

  recordDocsHistoryEntry(
    before,
    captureDocsSnapshot(),
    'document',
    'reorder',
    `Moved block from position ${currentIndex + 1} to ${targetIndex + 1}`,
    blockId,
  );
};

export const setActiveBlock = (blockId: string | null): void => {
  activeBlockId.value = blockId;
};

export const focusPreviousBlock = (currentBlockId: string): void => {
  const index = blocks.value.findIndex(b => b.blockId === currentBlockId);
  if (index > 0) {
    activeBlockId.value = blocks.value[index - 1].blockId;
  }
};

export const focusNextBlock = (currentBlockId: string): void => {
  const index = blocks.value.findIndex(b => b.blockId === currentBlockId);
  if (index < blocks.value.length - 1) {
    activeBlockId.value = blocks.value[index + 1].blockId;
  }
};

// Command menu controls
export const openCommandMenu = (blockId: string): void => {
  commandMenuBlockId.value = blockId;
  commandMenuOpen.value = true;
};

export const closeCommandMenu = (): void => {
  commandMenuOpen.value = false;
  commandMenuBlockId.value = null;
};

export const insertMarkdownPrefix = (blockId: string, prefix: string): void => {
  const block = blocks.value.find(b => b.blockId === blockId);
  if (!block) return;

  flushPendingChange();
  const before = captureDocsSnapshot();

  // Derive block type from the prefix
  const blockType = prefixToBlockType(prefix);

  // If block starts with /, remove it before setting content
  let newMarkdown = block.markdown;
  if (newMarkdown.startsWith('/')) {
    newMarkdown = newMarkdown.slice(1).trimStart();
  }

  blocks.value = blocks.value.map(b =>
    b.blockId === blockId ? { ...b, blockType, markdown: newMarkdown } : b,
  );
  closeCommandMenu();

  recordDocsHistoryEntry(
    before,
    captureDocsSnapshot(),
    'block',
    'block-update',
    `Set block type to ${blockType}`,
    blockId,
  );
};

// AI conversion utilities

export const blocksToMarkdown = (): string => {
  return blocks.value
    .map((b, i) => {
      if (b.blockType === 'numbered') {
        // Compute sequential number for consecutive numbered blocks
        let num = 1;
        for (let j = i - 1; j >= 0; j--) {
          if (blocks.value[j].blockType === 'numbered') {
            num++;
          } else {
            break;
          }
        }
        return `${num}. ${b.markdown}`;
      }
      return blockTypeToPrefix(b.blockType) + b.markdown;
    })
    .join('\n\n');
};

export const markdownToBlocks = (markdown: string): void => {
  flushPendingChange();
  const before = captureDocsSnapshot();

  // Split by double newlines (paragraph breaks)
  const parts = markdown.split(/\n\n+/).filter(p => p.trim());

  if (parts.length === 0) {
    // Empty markdown - reset to single empty block
    blockIdCounter = 1;
    blocks.value = [{ blockId: '1', blockType: 'h1', markdown: '' }];
    activeBlockId.value = '1';
  } else {
    // Generate new blocks from markdown parts
    blockIdCounter = 0;
    blocks.value = parts.map(md => {
      const { prefix, content } = parseMarkdownPrefix(md);
      const blockType = prefixToBlockType(prefix);
      return {
        blockId: generateBlockId(),
        blockType,
        markdown: content,
      };
    });
    activeBlockId.value = blocks.value[0]?.blockId ?? null;
  }

  recordDocsHistoryEntry(
    before,
    captureDocsSnapshot(),
    'document',
    'document-replace',
    'Replaced document content',
  );
};

// Docs text selection tracking (for AI panel integration)
export const docsSelectedText = signal<{ text: string; blockId: string } | null>(null);

export const setDocsSelectedText = (text: string, blockId: string): void => {
  docsSelectedText.value = { text, blockId };
};

export const clearDocsSelectedText = (): void => {
  docsSelectedText.value = null;
};

// Mobile docs editing mode — tracks which block has keyboard focus on mobile
export const mobileDocsEditingBlockId = signal<string | null>(null);

export const enterMobileDocsEditing = (blockId: string): void => {
  mobileDocsEditingBlockId.value = blockId;
};

export const exitMobileDocsEditing = (): void => {
  mobileDocsEditingBlockId.value = null;
};

// Mobile docs actions sheet (block type picker)
export const mobileDocsActionsSheetOpen = signal<boolean>(false);

export const openMobileDocsActionsSheet = (): void => {
  mobileDocsActionsSheetOpen.value = true;
};

export const closeMobileDocsActionsSheet = (): void => {
  mobileDocsActionsSheetOpen.value = false;
};

// Reset document to initial state
export const resetDocument = (): void => {
  blockIdCounter = 1;
  blocks.value = [{ blockId: '1', blockType: 'h1', markdown: '' }];
  activeBlockId.value = '1';
  closeCommandMenu();
};
