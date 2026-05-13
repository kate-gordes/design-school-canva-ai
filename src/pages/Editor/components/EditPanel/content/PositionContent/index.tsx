import React, { useState } from 'react';
import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spacer,
  Grid,
  Button,
  Rows,
  Columns,
  Column,
} from '@canva/easel';
import { TextInput } from '@canva/easel';
import {
  LockClosedIcon,
  LockOpenIcon,
  XIcon,
  MoveLayerUpIcon,
  MoveLayerDownIcon,
  MoveLayerToFrontIcon,
  MoveLayerToBackIcon,
  AlignBottomIcon,
  AlignTopIcon,
  AlignMiddleIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from '@canva/easel/icons';
import { SegmentedControl } from '@canva/easel/form/segmented_control';
import styles from './PositionContent.module.css';

interface PositionContentProps {
  onClose?: () => void;
}

export default function PositionContent({ onClose }: PositionContentProps): React.ReactNode {
  const [arrange, setArrange] = useState<'forward' | 'backward' | 'to_front' | 'to_back'>(
    'forward',
  );
  const [align, setAlign] = useState<'top' | 'left' | 'middle' | 'center' | 'bottom' | 'right'>(
    'top',
  );

  const [width, setWidth] = useState('257.1 px');
  const [height, setHeight] = useState('76.2 px');
  const [x, setX] = useState('831.5 px');
  const [y, setY] = useState('501.9 px');
  const [rotate, setRotate] = useState('0°');
  const [ratioLocked, setRatioLocked] = useState(true);

  const [layerFilter, setLayerFilter] = useState<'all' | 'overlapping'>('all');

  const getArrangeIcon = (id: typeof arrange) => {
    switch (id) {
      case 'forward':
        return <MoveLayerUpIcon size="medium" />;
      case 'backward':
        return <MoveLayerDownIcon size="medium" />;
      case 'to_front':
        return <MoveLayerToFrontIcon size="medium" />;
      case 'to_back':
        return <MoveLayerToBackIcon size="medium" />;
    }
  };

  const ArrangeButton = ({ id, label }: { id: typeof arrange; label: string }) => {
    const isSelected = arrange === id;
    return (
      <Button
        variant="secondary"
        disabled={isSelected}
        onClick={() => setArrange(id)}
        className={styles.gridButton}
      >
        {/* Plain span: Easel Button renders its children inside a caller-supplied slot;
            using Box here would produce its own background/margin reset that would
            conflict with the Button's internal flex chrome. */}
        <span className={styles.buttonContent}>
          {getArrangeIcon(id)}
          <span>{label}</span>
        </span>
      </Button>
    );
  };

  const getAlignIcon = (id: typeof align) => {
    switch (id) {
      case 'bottom':
        return <AlignBottomIcon size="medium" />;
      case 'top':
        return <AlignTopIcon size="medium" />;
      case 'middle':
        return <AlignMiddleIcon size="medium" />;
      case 'left':
        return <AlignLeftIcon size="medium" />;
      case 'right':
        return <AlignRightIcon size="medium" />;
      case 'center':
        return <AlignMiddleIcon size="medium" />;
    }
  };

  const AlignButton = ({ id, label }: { id: typeof align; label: string }) => {
    const isSelected = align === id;
    return (
      <Button
        variant="secondary"
        disabled={isSelected}
        onClick={() => setAlign(id)}
        className={styles.gridButton}
      >
        {/* Plain span: inner button content slot (see ArrangeButton for rationale). */}
        <span className={styles.buttonContent}>
          {getAlignIcon(id)}
          <span>{label}</span>
        </span>
      </Button>
    );
  };

  const DragHandleIcon = (): React.ReactNode => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM16 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="currentColor"
      ></path>
    </svg>
  );

  return (
    <Box className={styles.root} height="full">
      <Box padding="2u">
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text weight="bold" size="medium">
            Position
          </Text>
          {onClose && (
            <Button
              variant="tertiary"
              size="small"
              icon={() => <XIcon size="medium" />}
              onClick={onClose}
            />
          )}
        </Box>
      </Box>
      <Tabs defaultActiveId="arrange">
        <Box paddingX="2u">
          <TabList align="stretch" spacing="0">
            <Tab id="arrange">Arrange</Tab>
            <Tab id="layers">Layers</Tab>
          </TabList>
        </Box>
        <Spacer size="2u" />
        <TabPanels>
          <TabPanel id="arrange">
            <Box className={styles.scrollArea}>
              <Rows spacing="2u">
                {/* Arrange */}
                <Box paddingX="2u">
                  <Grid columns={2} spacingX="1u" spacingY="1u">
                    <ArrangeButton id="forward" label="Forward" />
                    <ArrangeButton id="backward" label="Backward" />
                    <ArrangeButton id="to_front" label="To front" />
                    <ArrangeButton id="to_back" label="To back" />
                  </Grid>
                </Box>

                {/* Align to page */}
                <Box paddingX="2u">
                  <Text weight="bold" size="medium">
                    Align to page
                  </Text>
                </Box>
                <Box paddingX="2u">
                  <Grid columns={2} spacingX="1u" spacingY="1u">
                    <AlignButton id="top" label="Top" />
                    <AlignButton id="left" label="Left" />
                    <AlignButton id="middle" label="Middle" />
                    <AlignButton id="center" label="Center" />
                    <AlignButton id="bottom" label="Bottom" />
                    <AlignButton id="right" label="Right" />
                  </Grid>
                </Box>

                {/* Advanced */}
                <Box paddingX="2u">
                  <Text weight="bold" size="medium">
                    Advanced
                  </Text>
                </Box>
                <Box paddingX="2u">
                  <Columns spacing="1u">
                    <Column>
                      <Text size="small" weight="bold" tone="secondary">
                        Width
                      </Text>
                      <Spacer size="1u" />
                      <TextInput value={width} onChange={setWidth} />
                    </Column>
                    <Column>
                      <Text size="small" weight="bold" tone="secondary">
                        Height
                      </Text>
                      <Spacer size="1u" />
                      <TextInput value={height} onChange={setHeight} />
                    </Column>
                    <Column>
                      <Text size="small" weight="bold" tone="secondary">
                        Ratio
                      </Text>
                      <Spacer size="1u" />
                      <Button
                        variant="secondary"
                        onClick={() => setRatioLocked(v => !v)}
                        icon={() =>
                          ratioLocked ? (
                            <LockClosedIcon size="medium" />
                          ) : (
                            <LockOpenIcon size="medium" />
                          )
                        }
                        className={`${styles.fullWidthControl} ${ratioLocked ? styles.pillSelected : ''}`}
                      />
                    </Column>
                  </Columns>
                </Box>
                <Box paddingX="2u">
                  <Columns spacing="1u">
                    <Column>
                      <Text size="small" weight="bold" tone="secondary">
                        X
                      </Text>
                      <Spacer size="1u" />
                      <TextInput value={x} onChange={setX} />
                    </Column>
                    <Column>
                      <Text size="small" weight="bold" tone="secondary">
                        Y
                      </Text>
                      <Spacer size="1u" />
                      <TextInput value={y} onChange={setY} />
                    </Column>
                    <Column>
                      <Text size="small" weight="bold" tone="secondary">
                        Rotate
                      </Text>
                      <Spacer size="1u" />
                      <TextInput value={rotate} onChange={setRotate} />
                    </Column>
                  </Columns>
                </Box>
              </Rows>
            </Box>
          </TabPanel>

          <TabPanel id="layers">
            <Box className={styles.scrollArea}>
              <Rows spacing="2u">
                <Box paddingX="2u">
                  <SegmentedControl
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'overlapping', label: 'Overlapping' },
                    ]}
                    value={layerFilter}
                    onChange={(v: string) => setLayerFilter(v as 'all' | 'overlapping')}
                  />
                </Box>

                <Box paddingX="2u">
                  <Box className={styles.layerCard}>
                    <Box className={styles.dragHandleInside} aria-hidden>
                      {DragHandleIcon()}
                    </Box>
                    <Text size="xxlarge" alignment="center">
                      Heading
                    </Text>
                  </Box>
                </Box>

                <Box paddingX="2u">
                  <Box className={styles.layerCardMuted}>
                    <Box className={styles.placeholderBar} />
                    <Box className={styles.hatch} />
                  </Box>
                </Box>
              </Rows>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
