import { Box } from '@canva/easel';

interface ImageButtonProps {
  onClick?: () => void;
}

export default function ImageButton({ onClick }: ImageButtonProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      width="64px"
      height="64px"
      background="surfaceSubtle"
      borderRadius="standard"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      Image
    </Box>
  );
}
