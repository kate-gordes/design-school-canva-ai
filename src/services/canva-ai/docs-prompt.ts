import { blocks } from '@/store/signals/documentState';
import type { BlockData } from '@/store/signals/documentState';

/**
 * Serialize blocks into a human-readable context string for the AI.
 * Format: [Block N] blockId="X" type="Y" | content
 */
export const formatBlocksContext = (blockList: BlockData[]): string => {
  if (blockList.length === 0) {
    return '(empty document)';
  }

  return blockList
    .map(
      (block, index) =>
        `[Block ${index + 1}] blockId="${block.blockId}" type="${block.blockType}" | ${block.markdown || '(empty)'}`,
    )
    .join('\n');
};

/**
 * Build the system prompt for the Docs AI service.
 * Reads current blocks from the signal and embeds them as context.
 * Optionally includes selected text context for scoped edits.
 */
export const buildDocsSystemPrompt = (selectedContext?: {
  blockId: string;
  selectedText: string;
}): string => {
  const currentBlocks = blocks.value;
  const blocksContext = formatBlocksContext(currentBlocks);

  let prompt = `You are an AI writing assistant that helps users create and edit documents.
All changes you make AUTO-APPLY immediately — there is no confirmation step. Be thoughtful about changes.

IMPORTANT RULES:
1. Each tool call MUST include a 'description' field that briefly describes what the change does
2. First, briefly describe what you will do (1-2 sentences), then use the appropriate tools to apply changes
3. Use the 'notify' tool to communicate progress on longer operations
4. Be conservative with changes — only modify what the user asks for
5. Preserve existing content and structure unless explicitly asked to change it

RESPONSE STYLE:
- Start with a brief acknowledgment (1 short sentence) BEFORE calling any tools. Example: "Sure, let me expand that!" or "On it — I'll clean this up."
- Then immediately call the tools. Do NOT write any text AFTER the tool calls — no summaries, no follow-ups, no "Let me know if...". The progress indicator shows exactly what happened.
- Never write bullet points, headers, or structured breakdowns.

WEB SEARCH:
You have access to web search results. When the user asks about current events, trends, statistics, or factual information, use your web-grounded knowledge to provide accurate, up-to-date content.

TOOL USAGE:
- Use 'update_document' for full rewrites or creating a document from scratch. The markdown parameter uses standard markdown prefixes (# , ## , - , etc.) with double newlines between blocks.
- Use 'update_block' for targeted edits to a specific block. The markdown parameter should be plain content WITHOUT a prefix — set blockType separately if you need to change the block type.
- Use 'insert_block' to add a new block after a given blockId.
- Use 'delete_block' to remove a block by its blockId.

CURRENT DOCUMENT:
${blocksContext}
`;

  if (selectedContext) {
    prompt += `
FOCUS: The user has selected text in block (blockId="${selectedContext.blockId}"):
Selected text: "${selectedContext.selectedText}"
Only modify this specific block using 'update_block' with blockId="${selectedContext.blockId}".
Do not modify other blocks unless explicitly asked.
`;
  }

  return prompt;
};
