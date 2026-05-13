import NavCanvaAIIcon from './NavCanvaAIIcon';

interface IconProps {
  size?: number;
  className?: string;
}

export default function NavCanvaAIIconActive(props: IconProps): JSX.Element {
  return <NavCanvaAIIcon {...props} />;
}
