import { Box } from '@canva/easel';

interface SwatchButtonProps {
  color?: string;
  onClick?: () => void;
}

export default function SwatchButton({ color = '#000', onClick }: SwatchButtonProps) {
  // Inline backgroundColor: the swatch color is data-driven (arbitrary hex from
  // props), so it must flow into the element at render time. Easel Box has no
  // dedicated prop for arbitrary hex fill, hence the direct style passthrough.
  return (
    <Box
      as="button"
      onClick={onClick}
      width="32px"
      height="32px"
      borderRadius="standard"
      style={{ backgroundColor: color }}
    />
  );
}
