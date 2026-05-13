import React from 'react';
import {
  Box,
  Rows,
  Grid,
  Title,
  Text,
  Button,
  Badge,
  Spacer,
  AspectRatio,
  Tooltip,
  Placeholder,
  StaticImage,
} from '@canva/easel';
import { TextPlaceholder } from '@canva/easel';
import styles from './AppsCardList.module.css';

export const APP_LIST_WIDTH = 4;

export type App =
  | {
      loading: true;
    }
  | {
      appIdOrKey: string;
      name: string;
      iconUrl: string;
      needsInstallation: boolean;
      onClick: () => void;
      onMount?: (element: HTMLElement) => void;
      loading: false;
      Badge?: React.ComponentType;
    };

type AppsListProps = {
  apps: App[];
  title?: string;
  decoratorText?: string;
  onSeeAllClick?: () => void;
  AppContainerOverride?: React.ComponentType<{ app: App & { loading: false } }>;
};

const LoadingAppContainer = () => (
  <Rows spacing="0.5u">
    <Placeholder shape="square" />
    <TextPlaceholder size="small" />
  </Rows>
);

const DefaultAppContainer = ({ app }: { app: App & { loading: false } }) => {
  const appContainer = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (app.onMount && appContainer.current) {
      return app.onMount(appContainer.current);
    }
  }, [appContainer, app]);

  return (
    <Button variant="tertiary" onClick={app.onClick} ariaLabel={app.name} ref={appContainer}>
      <Box height="full">
        <Rows spacing="0.5u">
          <Box position="relative">
            <Box borderRadius="element" display="flex" background="neutralLow" position="relative">
              <AspectRatio ratio={1}>
                <StaticImage src={app.iconUrl} alt={app.name} className={styles.appIcon} />
              </AspectRatio>
            </Box>
            {app.Badge && <app.Badge />}
          </Box>
          <Tooltip placement="top" label={app.name}>
            <Text size="small" alignment="center" lineClamp={app.name.includes(' ') ? 2 : 1}>
              {app.name}
            </Text>
          </Tooltip>
        </Rows>
      </Box>
    </Button>
  );
};

export const AppsCardList = ({
  apps,
  title,
  decoratorText,
  onSeeAllClick,
  AppContainerOverride,
}: AppsListProps) => {
  return (
    <Rows spacing="1.5u">
      <Box
        display="flex"
        alignItems="center"
        justifyContent={onSeeAllClick ? (title ? 'spaceBetween' : 'end') : 'start'}
      >
        {title && (
          <Box display="flex" alignItems="center">
            <Title size="xsmall">{title}</Title>
            {decoratorText && (
              <>
                <Spacer direction="horizontal" size="1u" />
                <Badge text={decoratorText} tone="assist" />
              </>
            )}
          </Box>
        )}

        {onSeeAllClick && (
          <Button variant="tertiary" onClick={onSeeAllClick}>
            <Text size="small" weight="bold">
              See all
            </Text>
          </Button>
        )}
      </Box>
      <Grid columns={APP_LIST_WIDTH} role="list" spacing="1.5u" alignX="center" alignY="start">
        {apps.map((app, index) =>
          app.loading ? (
            <LoadingAppContainer key={index} />
          ) : AppContainerOverride ? (
            <AppContainerOverride key={index} app={app} />
          ) : (
            <DefaultAppContainer key={index} app={app} />
          ),
        )}
      </Grid>
    </Rows>
  );
};
