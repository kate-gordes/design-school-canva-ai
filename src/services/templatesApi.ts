import { templates } from '@canva-ct/canva/templates';
import type { Template } from '@canva-ct/canva/templates';

export type { Template };

export const searchTemplates = async (params: { query: string; limit?: number }) => {
  const result = await templates.searchTemplates({
    query: params.query,
    limit: params.limit ?? 20,
  });
  return result.templates;
};
