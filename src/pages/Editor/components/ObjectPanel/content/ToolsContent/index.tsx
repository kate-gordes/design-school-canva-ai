import React from 'react';
import { Box, Rows, Button } from '@canva/easel';
import SelectIcon from './icons/SelectIcon';
import DrawIcon from './icons/DrawIcon';
import ShapeIcon from './icons/ShapeIcon';
import LineIcon from './icons/LineIcon';
import NoteIcon from './icons/NoteIcon';
import TextToolIcon from './icons/TextToolIcon';
import TableIcon from './icons/TableIcon';
import styles from './ToolsContent.module.css';

export default function ToolsContent(): React.ReactNode {
  type Tool = { id: string; icon: () => JSX.Element; label: string };
  const tools: Tool[] = [
    { id: 'select', icon: () => <SelectIcon size={24} />, label: 'Select' },
    { id: 'draw', icon: () => <DrawIcon size={24} />, label: 'Draw' },
    { id: 'shape', icon: () => <ShapeIcon size={24} />, label: 'Shape' },
    { id: 'line', icon: () => <LineIcon size={24} />, label: 'Line' },
    { id: 'note', icon: () => <NoteIcon size={24} />, label: 'Note' },
    { id: 'text', icon: () => <TextToolIcon size={24} />, label: 'Text' },
    { id: 'table', icon: () => <TableIcon size={24} />, label: 'Table' },
  ];

  return (
    <Box className={styles.toolsContainer}>
      <Rows spacing="1u">
        {tools.map(tool => (
          <Button icon={tool.icon} key={tool.id} variant="tertiary" aria-label={tool.label} />
        ))}
      </Rows>
    </Box>
  );
}
