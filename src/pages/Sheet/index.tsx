import { useState, useCallback } from 'react';
import { Box } from 'ui/base/box/box';
import { Rows } from 'ui/base/layout/layout';
import { Columns, Column } from 'ui/base/layout/layout';
import { Text } from 'ui/base/typography/typography';
import { Table } from 'ui/base/table/table.ts';
import { TextInput } from 'ui/base/form/text_input/text_input';
import { Button } from 'ui/base/button/button';
import { MagicIcon } from 'ui/base/icons/magic/icon';
import { ArrowRightIcon } from 'ui/base/icons/arrow_right/icon';
import styles from './index.module.css';

// Spreadsheet dimensions
const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ROW_COUNT = 20;

type SheetRow = { rowNum: number };

const columns = [
  { key: 'rowNum' as const, name: '', width: '48px' },
  ...COLS.map(letter => ({ key: letter, name: letter, width: '100px' })),
];

const tableData: SheetRow[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
  rowNum: i + 1,
}));

// Parse commands like "Make cell A5 red", "Make cell A:5 red", "Set B3 to blue"
function parseCommand(input: string): { cellKey: string; color: string } | null {
  const match = input.match(
    /(?:make|set|color|change|paint)\s+(?:cell\s+)?([A-Za-z]+):?(\d+)\s+(?:background\s+(?:to\s+)?|(?:color\s+)?(?:to\s+)?)?(\w[\w\s]*)/i,
  );
  if (!match) return null;
  const col = match[1].toUpperCase();
  const row = match[2];
  const color = match[3].trim().toLowerCase();
  if (!COLS.includes(col)) return null;
  const rowNum = parseInt(row, 10);
  if (rowNum < 1 || rowNum > ROW_COUNT) return null;
  return { cellKey: `${col}${row}`, color };
}

type FeedbackMessage = { text: string; ok: boolean };

export default function Sheet() {
  const [cellColors, setCellColors] = useState<Record<string, string>>({});
  const [aiInput, setAiInput] = useState('');
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = aiInput.trim();
    if (!trimmed) return;

    const parsed = parseCommand(trimmed);
    if (!parsed) {
      setFeedback({ text: `Couldn't understand "${trimmed}". Try: "Make cell A5 red"`, ok: false });
    } else {
      setCellColors(prev => ({ ...prev, [parsed.cellKey]: parsed.color }));
      setFeedback({ text: `Set cell ${parsed.cellKey} background to ${parsed.color}`, ok: true });
      setAiInput('');
    }
  }, [aiInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    },
    [handleSubmit],
  );

  return (
    // Plain div required: Box resets `background` via _reset.css
    <div className={styles.page}>
      {/* Spreadsheet grid — takes all available vertical space */}
      <div className={styles.gridArea}>
        <Table<SheetRow>
          caption="Canva Sheet"
          columns={columns}
          data={tableData}
          getRowKey={row => row.rowNum}
          padding="compact"
          stickyHeader
          layoutMode="fixed"
          renderCell={({ row, column }) => {
            const isRowHeader = column.key === 'rowNum';
            const bgColor = isRowHeader ? undefined : cellColors[`${column.key}${row.data.rowNum}`];
            return (
              <td
                className={isRowHeader ? styles.rowHeaderCell : styles.dataCell}
                style={bgColor ? { backgroundColor: bgColor } : undefined}
              >
                {isRowHeader ? row.data.rowNum : null}
              </td>
            );
          }}
          renderColumnHeader={({ column }) => {
            const isRowHeader = column.key === 'rowNum';
            return (
              <th className={isRowHeader ? styles.cornerHeader : styles.colHeader}>
                {isRowHeader ? null : column.name}
              </th>
            );
          }}
        />
      </div>

      {/* AI bar — fixed at the bottom */}
      {/* Plain div required: Box resets `background` via _reset.css */}
      <div className={styles.aiBar}>
        <Box padding="2u">
          <Rows spacing="1u">
            {feedback && (
              <Text size="small" tone={feedback.ok ? 'positive' : 'critical'}>
                {feedback.text}
              </Text>
            )}
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                {/* Plain div: Box `background` prop doesn't include action primary color */}
                <div className={styles.aiIconCircle}>
                  <MagicIcon size="medium" />
                </div>
              </Column>
              <Column>
                <TextInput
                  value={aiInput}
                  onChange={setAiInput}
                  onKeyDown={handleKeyDown}
                  placeholder='Tell Canva AI what to change... (e.g. "Make cell A5 red")'
                  ariaLabel="AI instruction"
                />
              </Column>
              <Column width="content">
                <Button
                  variant="primary"
                  icon={ArrowRightIcon}
                  ariaLabel="Send"
                  tooltipLabel="Send"
                  onClick={handleSubmit}
                />
              </Column>
            </Columns>
          </Rows>
        </Box>
      </div>
    </div>
  );
}
