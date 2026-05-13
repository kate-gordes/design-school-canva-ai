import React, { useState } from 'react';
import { Box, Text, Spacer, Button, Columns, Column, Slider } from '@canva/easel';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import { NotesIcon, ThumbnailViewIcon, MaximizeIcon, HelpCircleIcon } from '@canva/easel/icons';
import GridViewIcon from '@/shared_components/icons/GridViewIcon';
import styles from './EditorFooter.module.css';
import { useAppContext } from '@/hooks/useAppContext';

interface EditorFooterProps {
  currentPage: number;
  totalPages: number;
  zoomPercent: number;
  onZoomChange: (percent: number) => void;
  onFit: () => void;
  onFill: () => void;
  viewMode: 'thumbnails' | 'continuous';
  onToggleViewMode: () => void;
  isGridMode: boolean;
  onToggleGrid: () => void;
  showFitFill?: boolean;
}

export default function EditorFooter({
  currentPage,
  totalPages,
  zoomPercent,
  onZoomChange,
  onFit,
  onFill,
  viewMode,
  onToggleViewMode,
  isGridMode,
  onToggleGrid,
  showFitFill = true,
}: EditorFooterProps): React.ReactNode {
  const { state } = useAppContext();
  const clampedZoom = Math.min(500, Math.max(10, zoomPercent));
  const presetZoomOptions = [300, 200, 125, 100, 75, 50, 25, 10];
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);

  // Slider onChange handles clamping; keep helper for potential keyboard input paths

  // step zoom removed; slider handles zoom control

  const footerClassName = `${styles.footer} ${state.sidebarVisible ? (isGridMode ? styles.footerUndocked : styles.footerDocked) : styles.footerNoNav}`;
  return (
    <Box className={footerClassName} width="full" paddingStart="1.5u" aria-label="Editor footer">
      <Columns spacing="0" alignY="center">
        {!isGridMode && (
          <Column width="content">
            <Box display="flex" alignItems="center">
              <Button variant="tertiary" size="small" icon={NotesIcon} ariaLabel="Notes" />
            </Box>
          </Column>
        )}

        <Column width="fluid" />

        <Column width="content">
          <Box display="flex" alignItems="center" width="full">
            {!isGridMode && (
              <>
                <Box display="flex" alignItems="center" width="full">
                  <Box className={styles.sliderContainer}>
                    <Slider
                      min={10}
                      max={500}
                      step={0.1}
                      value={clampedZoom}
                      onChange={(value: number) => onZoomChange(value)}
                      ariaLabel="Zoom"
                      NumericInput="none"
                    />
                  </Box>
                  <Spacer size="1u" />
                  <FlyoutMenu
                    open={zoomMenuOpen}
                    onRequestToggle={() => setZoomMenuOpen(open => !open)}
                    trigger={triggerProps => (
                      <Button
                        variant="tertiary"
                        size="small"
                        onClick={triggerProps.onClick}
                        pressed={triggerProps.pressed}
                        ariaControls={triggerProps.ariaControls}
                        ariaHasPopup={triggerProps.ariaHasPopup}
                      >
                        {Math.round(clampedZoom)}%
                      </Button>
                    )}
                  >
                    {presetZoomOptions.map(value => (
                      <FlyoutMenuItem
                        key={value}
                        onClick={() => {
                          onZoomChange(value);
                          setZoomMenuOpen(false);
                        }}
                      >
                        <Text size="medium">{value}%</Text>
                      </FlyoutMenuItem>
                    ))}
                    {showFitFill && (
                      <>
                        <FlyoutMenuDivider />
                        <FlyoutMenuItem
                          onClick={() => {
                            onFit();
                            setZoomMenuOpen(false);
                          }}
                        >
                          <Text size="medium">Fit</Text>
                        </FlyoutMenuItem>
                        <FlyoutMenuItem
                          onClick={() => {
                            onFill();
                            setZoomMenuOpen(false);
                          }}
                        >
                          <Text size="medium">Fill</Text>
                        </FlyoutMenuItem>
                      </>
                    )}
                  </FlyoutMenu>
                </Box>
                <Spacer size="1.5u" />

                <Button
                  variant="tertiary"
                  size="small"
                  onClick={onToggleViewMode}
                  ariaLabel="Toggle view mode"
                  icon={ThumbnailViewIcon}
                  pressed={viewMode === 'thumbnails'}
                >
                  Pages
                </Button>

                <Spacer size="1u" />
                <Text size="medium" weight="bold">
                  {`${currentPage}\u00A0/\u00A0${totalPages}`}
                </Text>

                <Spacer size="1u" />
              </>
            )}

            <Button
              variant="tertiary"
              size="small"
              icon={GridViewIcon}
              ariaLabel="Toggle pages grid"
              onClick={onToggleGrid}
              pressed={isGridMode}
            />

            <Spacer size="0.5u" />
            <Button variant="tertiary" size="small" icon={MaximizeIcon} ariaLabel="Fullscreen" />

            <Spacer size="0.5u" />
            <Button variant="tertiary" size="small" icon={HelpCircleIcon} ariaLabel="Help" />
          </Box>
        </Column>
      </Columns>
    </Box>
  );
}
