import React from 'react';
import { Box, Button, Text } from '@canva/easel';

export type GenericLabelButtonProps = {
  ariaLabel: string;
  active?: boolean;
  onClick: () => void;
  label: string;
  startIcon?: React.ReactNode;
  className?: string;
};

export default function GenericLabelButton({
  ariaLabel,
  active,
  onClick,
  label,
  startIcon,
  className,
}: GenericLabelButtonProps) {
  return (
    <Button
      variant="secondary"
      size="small"
      className={className}
      ariaLabel={ariaLabel}
      onClick={onClick}
    >
      <Box display="inline-flex" alignItems="center">
        {startIcon}
        <Text weight="bold">{label}</Text>
      </Box>
    </Button>
  );
}
