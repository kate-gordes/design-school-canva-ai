import { ApplyThemeRoot } from '@canva/easel';
import { useAppContext } from '@/hooks/useAppContext';

export default function ThemeRoot() {
  const { state } = useAppContext();

  return (
    <ApplyThemeRoot
      appearance={state.theme}
      classicDark="dark"
      classicLight="light"
      light="light"
      dark="dark"
    />
  );
}
