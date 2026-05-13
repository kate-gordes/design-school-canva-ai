import { SegmentedControl } from '@canva/easel/form/segmented_control';
import type { ThemeMode } from '@/types';

interface ThemeSwitcherProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

export default function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps): React.ReactNode {
  return (
    <SegmentedControl
      options={[
        {
          value: 'light',
          label: 'Light',
        },
        {
          value: 'dark',
          label: 'Dark',
        },
      ]}
      value={theme}
      onChange={(value: string) => onChange(value as ThemeMode)}
    />
  );
}
