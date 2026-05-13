import React, { useMemo, useState } from 'react';
import { Box, Text, Spacer, Columns, Column } from '@canva/easel';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import { Title } from '@canva/easel/typography';
import { TextInput } from '@canva/easel/form/text_input';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@/shared_components/icons';
import styles from './CreateFlyout.module.css';

interface DoctypeItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  doctype?: string;
  isCategory?: boolean;
}

interface Category {
  id: string;
  label: string;
  items: DoctypeItem[];
}

const baseDoctypes: DoctypeItem[] = [
  { id: 'document', label: 'Doc', icon: <span className={styles.docIcon} />, doctype: 'document' },
  {
    id: 'presentation',
    label: 'Presentation',
    icon: <span className={styles.presentationIcon} />,
    doctype: 'presentation',
  },
  {
    id: 'whiteboard',
    label: 'Whiteboard',
    icon: <span className={styles.whiteboardIcon} />,
    doctype: 'whiteboard',
  },
  {
    id: 'spreadsheet',
    label: 'Sheet',
    icon: <span className={styles.sheetIcon} />,
    doctype: 'spreadsheet',
  },
  {
    id: 'website',
    label: 'Website',
    icon: <span className={styles.websiteIcon} />,
    doctype: 'website',
  },
];

const categories: Category[] = [
  { id: 'root', label: 'Create new', items: baseDoctypes },
  {
    id: 'print',
    label: 'Print products',
    items: [
      {
        id: 'poster',
        label: 'Poster',
        icon: <span className={styles.printIcon} />,
        doctype: 'presentation',
      },
      {
        id: 'business-card',
        label: 'Business card',
        icon: <span className={styles.printIcon} />,
        doctype: 'presentation',
      },
      {
        id: 'flyer',
        label: 'Flyer',
        icon: <span className={styles.printIcon} />,
        doctype: 'presentation',
      },
    ],
  },
  {
    id: 'social',
    label: 'Social media',
    items: [
      {
        id: 'instagram-post',
        label: 'Instagram post',
        icon: <span className={styles.socialIcon} />,
        doctype: 'presentation',
      },
      {
        id: 'instagram-story',
        label: 'Instagram story',
        icon: <span className={styles.socialIcon} />,
        doctype: 'presentation',
      },
      {
        id: 'facebook-post',
        label: 'Facebook post',
        icon: <span className={styles.socialIcon} />,
        doctype: 'presentation',
      },
    ],
  },
];

function useCreateData() {
  const root = categories.find(c => c.id === 'root')!;
  const topLevel: DoctypeItem[] = [
    ...root.items,
    {
      id: 'print',
      label: 'Print',
      icon: <span className={`${styles.categoryIcon} ${styles.printIcon}`} />,
      isCategory: true,
    },
    {
      id: 'social',
      label: 'Social',
      icon: <span className={`${styles.categoryIcon} ${styles.socialIcon}`} />,
      isCategory: true,
    },
  ];
  const byId: Record<string, Category> = Object.fromEntries(categories.map(c => [c.id, c]));
  return { topLevel, byId };
}

export default function CreateFlyout(): React.ReactNode {
  const navigate = useNavigate();
  const { topLevel, byId } = useCreateData();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const items = useMemo(() => {
    const list = activeCategory ? (byId[activeCategory]?.items ?? []) : topLevel;
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(i => i.label.toLowerCase().includes(q));
  }, [activeCategory, byId, query, topLevel]);

  const handleSelect = (item: DoctypeItem) => {
    if (item.isCategory) {
      setActiveCategory(item.id);
      return;
    }
    const target = item.doctype ?? 'presentation';
    navigate(`/editor/${target}`);
  };

  return (
    <FlyoutMenu
      trigger={props => (
        // Plain button: .triggerButton is a 32×32 purple circle with hover
        // transition chrome; Easel Button would wipe the background and
        // pill shape.
        <button
          className={styles.triggerButton}
          aria-controls={props.ariaControls}
          aria-haspopup={props.ariaHasPopup}
          aria-expanded={props.pressed}
          onClick={props.onClick}
          type="button"
        >
          <PlusIcon size={24} className={styles.triggerIcon} />
        </button>
      )}
      header={
        <Box paddingX="3u" paddingY="2u" borderBottom="standard">
          <Title size="small">Create new</Title>
          <Spacer size="1u" />
          <TextInput
            value={query}
            onChange={setQuery}
            placeholder="What would you like to create?"
            fullWidth
          />
          {activeCategory && (
            <>
              <Spacer size="1u" />
              <Text size="small" tone="secondary">
                {byId[activeCategory]?.label}
              </Text>
            </>
          )}
        </Box>
      }
    >
      <Box className={styles.container}>
        <Box className={styles.grid}>
          {items.map(item => (
            // Plain button: .gridItem is a column-stack tile (icon + label)
            // with transparent bg; Easel Button would override the layout
            // and chrome.
            <button
              key={item.id}
              type="button"
              className={styles.gridItem}
              onClick={() => handleSelect(item)}
            >
              {/* Plain div: .iconCircle paints a gray background via
                  colorGrey02; Easel Box's reset_f88b8e wipes backgrounds. */}
              <div className={styles.iconCircle}>{item.icon}</div>
              <Text size="small" align="center" className={styles.iconLabel}>
                {item.label}
              </Text>
            </button>
          ))}
        </Box>

        {activeCategory && (
          <>
            <Spacer size="1.5u" />
            <Columns>
              <Column>
                {/* Plain button: .backButton is a bare text-only link with
                    transparent bg; Easel Button chrome would override. */}
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setActiveCategory(null)}
                >
                  <Text size="small">Back</Text>
                </button>
              </Column>
            </Columns>
          </>
        )}
      </Box>

      <FlyoutMenuDivider />
      <FlyoutMenuItem onClick={() => navigate('/editor/presentation')}>Open Editor</FlyoutMenuItem>
    </FlyoutMenu>
  );
}
