import { Box, Rows, Button } from '@canva/easel';
import { TrashIcon } from '@canva/easel/icons';
import styles from './TextStyleRow.module.css';

export interface TextStyleRowProps {
  /** Display name (e.g., "Heading", "Body") */
  name: string;
  /** Font family to render with */
  fontFamily?: string;
  /** Font size in pixels for display (16-24px range) */
  displaySize: number;
  /** Font weight (400, 700, etc.) */
  fontWeight?: number;
  /** Font style (normal, italic) */
  fontStyle?: 'normal' | 'italic';
  /** Whether this is a default/placeholder style */
  isDefault?: boolean;
  /** Whether this row is selected/being edited */
  isSelected?: boolean;
  /** Click handler for the row */
  onClick?: () => void;
  /** Delete handler */
  onDelete?: () => void;
  /** Save handler (when in edit mode) */
  onSave?: () => void;
  /** Discard handler (when in edit mode) */
  onDiscard?: () => void;
  /** Whether row is editable */
  editable?: boolean;
}

export default function TextStyleRow({
  name,
  fontFamily = 'Inter, -apple-system, sans-serif',
  displaySize,
  fontWeight = 400,
  fontStyle = 'normal',
  isDefault = false,
  isSelected = false,
  onClick,
  onDelete,
  onSave,
  onDiscard,
  editable = true,
}: TextStyleRowProps) {
  return (
    <button
      className={`${styles.rowButton} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      type="button"
    >
      <Box border="low" borderRadius="containerLarge" className={styles.rowContainer}>
        <Rows spacing="0">
          <Box paddingX="2u" paddingY="1u">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              className={styles.contentContainer}
            >
              {/* Text Style Preview */}
              <Box className={styles.textContainer}>
                <span
                  className={styles.textPreview}
                  style={{
                    fontFamily,
                    fontSize: `${displaySize}px`,
                    fontWeight,
                    fontStyle,
                    color: isDefault ? '#999' : '#000',
                  }}
                >
                  {name}
                </span>
              </Box>

              {/* Icons - Change based on selected state */}
              {editable && !isDefault && (
                <Box className={styles.iconContainer} display="flex">
                  {isSelected ? (
                    <>
                      {/* Save and Discard buttons when selected */}
                      <Button
                        variant="tertiary"
                        icon={() => <span>✓</span>}
                        aria-label="Save"
                        onClick={e => {
                          e.stopPropagation();
                          onSave?.();
                        }}
                      />
                      <Button
                        variant="tertiary"
                        icon={() => <span>✕</span>}
                        aria-label="Discard"
                        onClick={e => {
                          e.stopPropagation();
                          onDiscard?.();
                        }}
                      />
                    </>
                  ) : (
                    /* Delete button when not selected */
                    onDelete && (
                      <Button
                        variant="tertiary"
                        icon={TrashIcon}
                        aria-label="Delete text style"
                        onClick={e => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      />
                    )
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Rows>
      </Box>
    </button>
  );
}
