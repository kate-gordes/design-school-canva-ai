import { Box, Rows, Text, Columns, Column } from '@canva/easel';
import { Switch } from '@canva/easel/form/switch';
import { Button } from '@canva/easel/button';
import sharedStyles from '../shared.module.css';

interface SettingsCardProps {
  title: string;
  description: React.ReactNode;
  /** Toggle switch - when provided, shows a switch on the right */
  toggleEnabled?: boolean;
  onToggleChange?: (value: boolean) => void;
  /** Button - when provided, shows a button on the right */
  buttonLabel?: string;
  buttonVariant?: 'secondary' | 'critical' | 'primary';
  onButtonClick?: () => void;
  /** Additional content below the title/description */
  children?: React.ReactNode;
  /** Visual disabled state based on toggle */
  visuallyDisabled?: boolean;
}

export function SettingsCard({
  title,
  description,
  toggleEnabled,
  onToggleChange,
  buttonLabel,
  buttonVariant = 'secondary',
  onButtonClick,
  children,
  visuallyDisabled = false,
}: SettingsCardProps): React.ReactNode {
  const hasToggle = toggleEnabled !== undefined;
  const hasButton = buttonLabel !== undefined;

  return (
    <Box className={sharedStyles.settingsCard}>
      <Rows spacing="1u">
        <Columns alignY="start">
          <Column>
            <Box className={visuallyDisabled ? sharedStyles.disabledContent : undefined}>
              <Rows spacing="1u">
                <Text weight="bold">{title}</Text>
                <Text tone="secondary">{description}</Text>
              </Rows>
            </Box>
          </Column>
          {hasToggle && (
            <Column width="content">
              <Switch defaultValue={toggleEnabled} onChange={onToggleChange} />
            </Column>
          )}
          {hasButton && (
            <Column width="content">
              <Button variant={buttonVariant} onClick={onButtonClick}>
                {buttonLabel}
              </Button>
            </Column>
          )}
        </Columns>
        {children}
      </Rows>
    </Box>
  );
}
