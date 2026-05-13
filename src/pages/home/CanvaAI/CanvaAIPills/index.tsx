import { Box, Inline, Pill } from '@canva/easel';
import {
  MagicIcon,
  MagicPhotoIcon,
  MagicPencilIcon,
  CodeIcon,
  MagicVideoIcon,
} from '@canva/easel/icons';
import React from 'react';

interface CanvaAIPill {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: 'xsmall' | 'small' | 'medium' | 'large' }>;
}

// Labels + icons sourced verbatim from the monorepo wonder_list categories:
// ui/assistant/magic_assistant/wonder_list/categories.tsx
const pills: CanvaAIPill[] = [
  { id: 'design', label: 'Design', Icon: MagicIcon },
  { id: 'image', label: 'Image', Icon: MagicPhotoIcon },
  { id: 'doc', label: 'Doc', Icon: MagicPencilIcon },
  { id: 'code', label: 'Code', Icon: CodeIcon },
  { id: 'video', label: 'Video clip', Icon: MagicVideoIcon },
];

export default function CanvaAIPills(): React.ReactNode {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <Box width="full" display="flex" justifyContent="center" paddingTop="2u">
      <Inline spacing="1u">
        {pills.map(({ id, label, Icon }) => (
          <Pill
            key={id}
            size="medium"
            text={label}
            start={
              <Box
                width="3u"
                height="3u"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon size="small" />
              </Box>
            }
            selected={selected === id}
            onClick={() => setSelected(selected === id ? null : id)}
          />
        ))}
      </Inline>
    </Box>
  );
}
