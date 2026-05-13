import type { ToolDefinition } from '@canva-ct/genai';
import { notifyTool } from './tools';

// Update entire document with markdown
export const updateDocumentTool: ToolDefinition = {
  name: 'update_document',
  description:
    'Replace the entire document with new markdown content. Use this for full rewrites or when creating a document from scratch. The markdown should use standard prefixes: # for h1, ## for h2, ### for h3, - for bullet, 1. for numbered, > for quote. Separate blocks with double newlines.',
  parameters: {
    type: 'object',
    properties: {
      markdown: {
        type: 'string',
        description:
          'The full markdown content for the document. Use standard markdown prefixes (# , ## , ### , - , 1. , > ) to denote block types. Separate blocks with double newlines.',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Rewrote document in formal tone")',
      },
    },
    required: ['markdown', 'description'],
  },
};

// Update a specific block by ID
export const updateBlockTool: ToolDefinition = {
  name: 'update_block',
  description:
    'Edit a specific block by its blockId. Use this for targeted edits like changing a title or rewriting a paragraph. The markdown should be plain content WITHOUT a prefix (no #, -, etc.) — the block type is set separately via the optional blockType field.',
  parameters: {
    type: 'object',
    properties: {
      blockId: {
        type: 'string',
        description: 'The ID of the block to update',
      },
      markdown: {
        type: 'string',
        description:
          'The new content for the block. This should be plain text WITHOUT markdown prefixes (no #, -, 1., > etc.). The block type is controlled by the blockType field.',
      },
      blockType: {
        type: 'string',
        enum: ['paragraph', 'h1', 'h2', 'h3', 'bullet', 'numbered', 'quote'],
        description:
          'Optional: change the block type (e.g., convert a paragraph to h2). If omitted, the block type is preserved.',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Updated title to be catchier")',
      },
    },
    required: ['blockId', 'markdown', 'description'],
  },
};

// Insert a new block after a given block
export const insertBlockTool: ToolDefinition = {
  name: 'insert_block',
  description:
    'Insert a new block after the specified blockId. Use this to add new paragraphs, headings, or list items to the document.',
  parameters: {
    type: 'object',
    properties: {
      afterBlockId: {
        type: 'string',
        description:
          'The blockId after which to insert the new block. Use the last block ID to append at the end.',
      },
      markdown: {
        type: 'string',
        description: 'The content for the new block (plain text, no prefix).',
      },
      blockType: {
        type: 'string',
        enum: ['paragraph', 'h1', 'h2', 'h3', 'bullet', 'numbered', 'quote'],
        description: 'The type of block to create. Defaults to "paragraph" if omitted.',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Added new paragraph about AI")',
      },
    },
    required: ['afterBlockId', 'markdown', 'description'],
  },
};

// Delete a block by ID
export const deleteBlockTool: ToolDefinition = {
  name: 'delete_block',
  description:
    'Remove a block from the document by its blockId. If it is the only block, the content will be cleared instead.',
  parameters: {
    type: 'object',
    properties: {
      blockId: {
        type: 'string',
        description: 'The ID of the block to delete',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Removed redundant paragraph")',
      },
    },
    required: ['blockId', 'description'],
  },
};

// Get all docs tools
export const getDocsTools = (): ToolDefinition[] => {
  return [notifyTool, updateDocumentTool, updateBlockTool, insertBlockTool, deleteBlockTool];
};
