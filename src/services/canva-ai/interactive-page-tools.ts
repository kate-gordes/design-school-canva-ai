import type { ToolDefinition } from '@canva-ct/genai';
import { notifyTool } from './tools';

export const findAndReplaceTool: ToolDefinition = {
  name: 'find_and_replace',
  description:
    'Find an exact string in the current HTML and replace it. Use this for surgical edits like changing text, colors, styles, or small structural changes. The search string must match exactly (including whitespace).',
  parameters: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description:
          'The exact string to find in the HTML. Must match exactly including whitespace.',
      },
      replace: {
        type: 'string',
        description: 'The replacement string.',
      },
      description: {
        type: 'string',
        description:
          'Brief description of the change (e.g., "Changed heading text to Summer Party")',
      },
    },
    required: ['search', 'replace', 'description'],
  },
};

export const updateHtmlTool: ToolDefinition = {
  name: 'update_html',
  description:
    'Replace the entire HTML content of the page. Use this only for full rewrites or when the changes are too extensive for find_and_replace.',
  parameters: {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        description: 'The complete HTML content for the page.',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Rewrote page with new theme")',
      },
    },
    required: ['html', 'description'],
  },
};

export const getInteractivePageTools = (): ToolDefinition[] => {
  return [notifyTool, findAndReplaceTool, updateHtmlTool];
};
