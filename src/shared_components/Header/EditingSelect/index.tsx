import React, { useState } from 'react';
import { Box } from '@canva/easel';
import { Select } from '@canva/easel/form/select';
import { PencilIcon, EyeIcon, MessageRoundIcon } from '@canva/easel/icons';
import styles from './EditingSelect.module.css';

type EditingMode = 'editing' | 'commenting' | 'viewing';

const editingOptions = [
  {
    value: 'editing' as EditingMode,
    label: 'Editing',
    icon: <PencilIcon size="medium" />,
  },
  {
    value: 'commenting' as EditingMode,
    label: 'Commenting',
    icon: <MessageRoundIcon size="medium" />,
  },
  {
    value: 'viewing' as EditingMode,
    label: 'Viewing',
    icon: <EyeIcon size="medium" />,
  },
];

export const EditingSelect: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<EditingMode>('editing');

  const handleSelectionChange = (value: EditingMode | undefined) => {
    if (value) {
      setSelectedMode(value);
      console.log(`Changed to ${value} mode`);
    }
  };

  return (
    <Box className={styles.editingSelect}>
      <Select
        options={editingOptions}
        value={selectedMode}
        onChange={handleSelectionChange}
        className={styles.select}
      />
    </Box>
  );
};
