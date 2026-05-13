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
  Rows,
  Placeholder,
  TreeMenu,
  TreeMenuItem,
  Button,
  Pill,
  Carousel,
} from '@canva/easel';
import {
  PrintDocumentIcon,
  MagicIcon,
  ClockIcon,
  BrandKitIcon,
  CloudUploadIcon,
  ArrowTrendUpIcon,
  XIcon,
} from '@canva/easel/icons';
import BrandKitButton from '@/pages/Home/Brand/components/BrandKitButton';
import { RegularSearch } from '@/shared_components/Search';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import styles from './TextContent.module.css';

interface TextContentProps {
  onClose?: () => void;
}

export default function TextContent({ onClose }: TextContentProps): React.ReactNode {
  const [search, setSearch] = useState('');

  const systemFonts: Array<{ name: string; stack: string }> = [
    { name: 'Arial', stack: 'Arial, Helvetica, sans-serif' },
    { name: 'Helvetica Neue', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
    { name: 'Helvetica', stack: 'Helvetica, Arial, sans-serif' },
    { name: 'Times New Roman', stack: '"Times New Roman", Times, serif' },
    { name: 'Georgia', stack: 'Georgia, serif' },
    { name: 'Courier New', stack: '"Courier New", Courier, monospace' },
    { name: 'Menlo', stack: 'Menlo, Monaco, monospace' },
    { name: 'Monaco', stack: 'Monaco, Menlo, monospace' },
    { name: 'Verdana', stack: 'Verdana, Geneva, sans-serif' },
    { name: 'Trebuchet MS', stack: '"Trebuchet MS", Helvetica, sans-serif' },
    { name: 'American Typewriter', stack: '"American Typewriter", serif' },
    { name: 'Avenir Next', stack: '"Avenir Next", Avenir, Helvetica, Arial, sans-serif' },
    {
      name: 'System',
      stack:
        '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
  ];

  const filteredFonts = systemFonts.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );
  const getStack = (name: string): string =>
    systemFonts.find(f => f.name === name)?.stack || 'inherit';

  const renderFontTreeItem = (name: string): React.ReactNode => (
    <TreeMenuItem
      key={name}
      label={
        // Plain div: dynamic font-family preview shows each font in its own face;
        // font-size/line-height inline to match Easel Title line-height contract.
        <div className={styles.fontPreview} style={{ fontFamily: getStack(name) }}>
          {name}
        </div>
      }
      ariaLabel={name}
    >
      {['Regular', 'Medium', 'Bold'].map(variant => {
        const weight = variant === 'Bold' ? 700 : variant === 'Medium' ? 500 : 400;
        return (
          <TreeMenuItem
            key={`${name}-${variant}`}
            label={
              // Plain div: dynamic font-family + font-weight preview.
              <div
                className={styles.fontPreview}
                style={{
                  fontFamily: getStack(name),
                  fontWeight: weight,
                }}
              >
                {variant}
              </div>
            }
            ariaLabel={`${name} ${variant}`}
          />
        );
      })}
    </TreeMenuItem>
  );

  const Section = ({
    title,
    children,
    icon,
  }: {
    title: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <Box>
      <Box paddingX="1u">
        <Box display="flex" alignItems="center">
          {icon && <Box paddingEnd="1u">{icon}</Box>}
          <Text weight="bold" size="medium">
            {title}
          </Text>
        </Box>
      </Box>
      <Spacer size="1u" />
      {children ? (
        children
      ) : (
        <Rows spacing="1u">
          <Box display="flex" alignItems="center">
            <Box width="full">
              <Placeholder shape="sharpRectangle" />
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box width="full">
              <Placeholder shape="sharpRectangle" />
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box width="full">
              <Placeholder shape="sharpRectangle" />
            </Box>
          </Box>
        </Rows>
      )}
    </Box>
  );

  return (
    <Box className={styles.root} height="full">
      <Box padding="2u">
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text weight="bold" size="medium">
            Font
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

      <Tabs defaultActiveId="font">
        <Box paddingX="2u">
          <TabList align="stretch" spacing="0">
            <Tab id="font">Font</Tab>
            <Tab id="textStyles">Text styles</Tab>
          </TabList>
        </Box>

        <Spacer size="1u" />

        <TabPanels>
          <TabPanel id="font">
            <Box paddingX="2u">
              <RegularSearch
                value={search}
                onChange={setSearch}
                placeholder={'Try "Calligraphy" or "Open Sans"'}
                className={sharedStyles.searchBox}
              />
              <Spacer size="1u" />
              <Carousel name="Font styles" buttonVariant="chevron" gutter="medium">
                {[
                  {
                    label: 'Headings',
                    stack: '"Avenir Next", Avenir, Helvetica, Arial, sans-serif',
                  },
                  { label: 'Paragraph', stack: 'Georgia, serif' },
                  { label: 'Sans Serif', stack: 'Arial, Helvetica, sans-serif' },
                  { label: 'Serif', stack: '"Times New Roman", Times, serif' },
                  { label: 'Monospace', stack: '"Courier New", Courier, monospace' },
                  { label: 'Handwriting', stack: '"Apple Chancery", cursive' },
                  {
                    label: 'Display',
                    stack: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                  },
                  { label: 'Rounded', stack: '"Arial Rounded MT Bold", Arial, sans-serif' },
                  { label: 'Condensed', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
                  { label: 'Slab Serif', stack: 'Rockwell, "Courier New", serif' },
                ].map(({ label, stack }) => (
                  // Plain div: dynamic font-family sets the pill's preview face.
                  <div key={label} style={{ fontFamily: stack }}>
                    <Pill text={label} size="medium" />
                  </div>
                ))}
              </Carousel>
            </Box>
            <Spacer size="1u" />
            <Box
              className={`${sharedStyles.scrollableTabContent} ${styles.scrollArea}`}
              height="full"
            >
              {/* Plain div: sticky scroll-divider overlay (Easel Box would wipe opacity transition styling). */}
              <div className={styles.scrollDivider} />
              <Box paddingX="2u">
                <Rows spacing="1u">
                  <Section title="Document fonts" icon={<PrintDocumentIcon size="medium" />}>
                    <TreeMenu role="list" indentation="1u">
                      {filteredFonts.map(({ name }) => renderFontTreeItem(name))}
                    </TreeMenu>
                  </Section>

                  {/* Plain div: hairline divider (Easel Box resets background, which .sectionDivider needs). */}
                  <div className={`${styles.sectionDivider} ${styles.sectionDividerBleed}`} />

                  <Section title="Recommended fonts" icon={<ClockIcon size="medium" />}>
                    <TreeMenu role="list" indentation="1u">
                      {['Georgia', 'Menlo'].map(name => renderFontTreeItem(name))}
                    </TreeMenu>
                  </Section>

                  {/* Plain div: hairline divider (Easel Box resets background, which .sectionDivider needs). */}
                  <div className={`${styles.sectionDivider} ${styles.sectionDividerBleed}`} />

                  <Section title="Recently used" icon={<MagicIcon size="medium" />}>
                    <TreeMenu role="list" indentation="1u">
                      {['Georgia', 'Menlo', 'Helvetica Neue'].map(name => renderFontTreeItem(name))}
                    </TreeMenu>
                  </Section>

                  {/* Plain div: hairline divider (Easel Box resets background, which .sectionDivider needs). */}
                  <div className={`${styles.sectionDivider} ${styles.sectionDividerBleed}`} />

                  <Section title="Canva Brand Kit" icon={<BrandKitIcon size="medium" />}>
                    <TreeMenu role="list" indentation="1u">
                      {['Avenir Next', 'Helvetica'].map(name => renderFontTreeItem(name))}
                    </TreeMenu>
                  </Section>

                  {/* Plain div: hairline divider (Easel Box resets background, which .sectionDivider needs). */}
                  <div className={`${styles.sectionDivider} ${styles.sectionDividerBleed}`} />

                  <Section title="Uploaded fonts" icon={<CloudUploadIcon size="medium" />}>
                    <TreeMenu role="list" indentation="1u">
                      {['American Typewriter', 'Courier New'].map(name => renderFontTreeItem(name))}
                    </TreeMenu>
                  </Section>

                  {/* Plain div: hairline divider (Easel Box resets background, which .sectionDivider needs). */}
                  <div className={`${styles.sectionDivider} ${styles.sectionDividerBleed}`} />

                  <Section title="Popular fonts" icon={<ArrowTrendUpIcon size="medium" />}>
                    <TreeMenu role="list" indentation="1u">
                      {filteredFonts.map(({ name }) => renderFontTreeItem(name))}
                    </TreeMenu>
                  </Section>
                </Rows>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel id="textStyles">
            <Box paddingX="2u">
              <BrandKitButton />
              <Spacer size="2u" />
            </Box>
            {/* Plain div: composes sharedStyles.scrollableTabContent (overflow + hidden-scrollbar chrome). */}
            <div className={sharedStyles.scrollableTabContent}>
              <Rows spacing="2u">
                <Box paddingX="2u">
                  <Text size="xxlarge">Title</Text>
                </Box>
                <Box paddingX="2u">
                  <Text size="xlarge">Heading</Text>
                </Box>
                <Box paddingX="2u">
                  <Text size="large">Subheading</Text>
                </Box>
                <Box paddingX="2u">
                  <Text size="medium">Body</Text>
                </Box>
                <Box paddingX="2u">
                  <Text size="small" tone="secondary">
                    Caption
                  </Text>
                </Box>

                <div className={`${styles.sectionDivider} ${styles.sectionDividerBleed}`} />

                <Box paddingX="2u" display="flex" alignItems="center" justifyContent="spaceBetween">
                  <Box display="flex" alignItems="center">
                    <PrintDocumentIcon size="medium" />
                    <Spacer size="1u" />
                    <Text weight="bold">Document styles</Text>
                  </Box>
                  <Text tone="secondary">See all</Text>
                </Box>
                <Box paddingX="2u">
                  <Text size="xlarge" weight="bold">
                    Heading
                  </Text>
                  <Spacer size="1u" />
                  <Text size="large">Subheading</Text>
                  <Spacer size="1u" />
                  <Text>Body</Text>
                </Box>
              </Rows>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
