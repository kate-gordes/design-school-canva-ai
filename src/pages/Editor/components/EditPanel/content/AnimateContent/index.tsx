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
} from '@canva/easel';
import { Switch } from '@canva/easel/form/switch';
import { XIcon } from '@canva/easel/icons';
import ImageButton from '@/shared_components/ImageButton';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import styles from './AnimateContent.module.css';
// Thumbnails – Text
import ThumbTypewriter from '@/pages/Editor/assets/thumbnails/text/typewriter.svg';
import ThumbAscend from '@/pages/Editor/assets/thumbnails/text/ascend.svg';
import ThumbShift from '@/pages/Editor/assets/thumbnails/text/shift.svg';
import ThumbMerge from '@/pages/Editor/assets/thumbnails/text/merge.svg';
import ThumbBlock from '@/pages/Editor/assets/thumbnails/text/block.svg';
import ThumbBurst from '@/pages/Editor/assets/thumbnails/text/burst.svg';
import ThumbBounce from '@/pages/Editor/assets/thumbnails/text/bounce.svg';
import ThumbRoll from '@/pages/Editor/assets/thumbnails/text/roll.svg';
import ThumbSkate from '@/pages/Editor/assets/thumbnails/text/skate.svg';
import ThumbSpread from '@/pages/Editor/assets/thumbnails/text/spread.svg';
import ThumbClarify from '@/pages/Editor/assets/thumbnails/text/clarify.svg';
// Thumbnails – Element (general)
import ElRise from '@/pages/Editor/assets/thumbnails/element/rise.svg';
import ElPan from '@/pages/Editor/assets/thumbnails/element/pan.svg';
import ElFade from '@/pages/Editor/assets/thumbnails/element/fade.svg';
import ElPop from '@/pages/Editor/assets/thumbnails/element/pop.svg';
import ElWipe from '@/pages/Editor/assets/thumbnails/element/wipe.svg';
import ElBreathe from '@/pages/Editor/assets/thumbnails/element/breathe.svg';
// Thumbnails – Repeating (add-ons)
import RepRotate from '@/pages/Editor/assets/thumbnails/repeating/rotate.svg';
import RepFlicker from '@/pages/Editor/assets/thumbnails/repeating/flicker.svg';
import RepPulse from '@/pages/Editor/assets/thumbnails/repeating/pulse.svg';
import RepWiggle from '@/pages/Editor/assets/thumbnails/repeating/wiggle.svg';
// Thumbnails – Page
import PageSimple from '@/pages/Editor/assets/thumbnails/page/simple.svg';
import PageSleek from '@/pages/Editor/assets/thumbnails/page/sleek.svg';
import PageFun from '@/pages/Editor/assets/thumbnails/page/fun.svg';
import PageRise from '@/pages/Editor/assets/thumbnails/page/rise.svg';
import PagePan from '@/pages/Editor/assets/thumbnails/page/pan.svg';
import PageFade from '@/pages/Editor/assets/thumbnails/page/fade.svg';
import PagePop from '@/pages/Editor/assets/thumbnails/page/pop.svg';
import PageWipe from '@/pages/Editor/assets/thumbnails/page/wipe.svg';
import PageBreathe from '@/pages/Editor/assets/thumbnails/page/breathe.svg';
import PageBaseline from '@/pages/Editor/assets/thumbnails/page/baseline.svg';
import PageDrift from '@/pages/Editor/assets/thumbnails/page/drift.svg';
import PageTectonic from '@/pages/Editor/assets/thumbnails/page/tectonic.svg';
import PageTumble from '@/pages/Editor/assets/thumbnails/page/tumble.svg';
import PageNeon from '@/pages/Editor/assets/thumbnails/page/neon.svg';
import PageScrapbook from '@/pages/Editor/assets/thumbnails/page/scrapbook.svg';
import PageStomp from '@/pages/Editor/assets/thumbnails/page/stomp.svg';
import PageBlockPage from '@/pages/Editor/assets/thumbnails/page/block.svg';
import MagicAnimateImg from '@/pages/Editor/assets/thumbnails/page/magic_animate.png';
import CreateAnimationImg from '@/pages/Editor/assets/thumbnails/element/follow_path.png';

interface AnimateContentProps {
  onClose?: () => void;
}

type AnimateId = string;

const suggested: Array<{ id: AnimateId; label: string; src: string }> = [
  { id: 'typewriter', label: 'Typewriter', src: ThumbTypewriter },
  { id: 'ascend', label: 'Ascend', src: ThumbAscend },
  { id: 'shift', label: 'Shift', src: ThumbShift },
  { id: 'merge', label: 'Merge', src: ThumbMerge },
  { id: 'block', label: 'Block', src: ThumbBlock },
  { id: 'burst', label: 'Burst', src: ThumbBurst },
  { id: 'bounce', label: 'Bounce', src: ThumbBounce },
  { id: 'roll', label: 'Roll', src: ThumbRoll },
  { id: 'skate', label: 'Skate', src: ThumbSkate },
  { id: 'spread', label: 'Spread', src: ThumbSpread },
  { id: 'clarify', label: 'Clarify', src: ThumbClarify },
];

const general: Array<{ id: AnimateId; label: string; src: string }> = [
  { id: 'rise', label: 'Rise', src: ElRise },
  { id: 'pan', label: 'Pan', src: ElPan },
  { id: 'fade', label: 'Fade', src: ElFade },
  { id: 'pop', label: 'Pop', src: ElPop },
  { id: 'wipe', label: 'Wipe', src: ElWipe },
  { id: 'breathe', label: 'Breathe', src: ElBreathe },
];

const addOns: Array<{ id: AnimateId; label: string; src: string }> = [
  { id: 'rotate', label: 'Rotate', src: RepRotate },
  { id: 'flicker', label: 'Flicker', src: RepFlicker },
  { id: 'pulse', label: 'Pulse', src: RepPulse },
  { id: 'wiggle', label: 'Wiggle', src: RepWiggle },
];

export default function AnimateContent({ onClose }: AnimateContentProps): React.ReactNode {
  const [tab] = useState<'page' | 'text'>('text');
  const [appearOnClick, setAppearOnClick] = useState(false);
  const [selected, setSelected] = useState<AnimateId>('typewriter');
  const [pageSelected, setPageSelected] = useState<AnimateId>('simple');
  // Note: animate mode controls can be wired later

  const renderGrid = (items: Array<{ id: AnimateId; label: string; src?: string }>) => (
    <Grid columns={3} spacingX="1u" spacingY="1u">
      {items.map(item => (
        <ImageButton
          key={item.id}
          label={item.label}
          src={item.src}
          selected={selected === item.id}
          onClick={() => setSelected(item.id)}
        />
      ))}
    </Grid>
  );

  return (
    <Box height="full" display="flex" flexDirection="column">
      <Box padding="2u">
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text weight="bold" size="medium">
            Animate
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

      <Box className={styles.tabsContainer}>
        <Tabs defaultActiveId={tab}>
          <Box paddingX="2u">
            <TabList align="stretch" spacing="0">
              <Tab id="page">Page</Tab>
              <Tab id="text">Text</Tab>
            </TabList>
          </Box>
          <Spacer size="1u" />
          <TabPanels>
            <TabPanel id="page">
              <Box className={sharedStyles.scrollableTabContent}>
                <Rows spacing="2u">
                  <Box paddingX="2u">
                    <Spacer size="1u" />
                    <Text weight="bold" size="medium">
                      Animate entire design
                    </Text>
                    <Spacer size="1u" />
                    <Box
                      border="standard"
                      borderRadius="element"
                      padding="1u"
                      className={styles.hoverCard}
                    >
                      <Box display="flex" alignItems="center">
                        <img
                          src={MagicAnimateImg}
                          className={styles.iconPlaceholder}
                          alt="Magic Animate"
                        />
                        <Spacer size="2u" />
                        <Box>
                          <Text weight="bold">Magic Animate</Text>
                          <Spacer size="1u" />
                          <Text tone="secondary" size="small">
                            Instantly animate all pages in a style of your choice.
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box paddingX="2u">
                    <Text weight="bold" size="medium">
                      Featured
                    </Text>
                  </Box>
                  <Box paddingX="2u">
                    <Grid columns={3} spacingX="1u" spacingY="1u">
                      {[
                        { id: 'simple', label: 'Simple', src: PageSimple },
                        { id: 'sleek', label: 'Sleek', src: PageSleek },
                        { id: 'fun', label: 'Fun', src: PageFun },
                      ].map(item => (
                        <ImageButton
                          key={item.id}
                          label={item.label}
                          src={item.src}
                          selected={pageSelected === item.id}
                          onClick={() => setPageSelected(item.id)}
                        />
                      ))}
                    </Grid>
                  </Box>

                  <Box paddingX="2u">
                    <Text weight="bold" size="medium">
                      General
                    </Text>
                  </Box>
                  <Box paddingX="2u">
                    <Grid columns={3} spacingX="1u" spacingY="1u">
                      {[
                        { id: 'rise', label: 'Rise', src: PageRise },
                        { id: 'pan', label: 'Pan', src: PagePan },
                        { id: 'fade', label: 'Fade', src: PageFade },
                        { id: 'pop', label: 'Pop', src: PagePop },
                        { id: 'wipe', label: 'Wipe', src: PageWipe },
                        { id: 'breathe', label: 'Breathe', src: PageBreathe },
                        { id: 'baseline', label: 'Baseline', src: PageBaseline },
                        { id: 'drift', label: 'Drift', src: PageDrift },
                        { id: 'tectonic', label: 'Tectonic', src: PageTectonic },
                        { id: 'tumble', label: 'Tumble', src: PageTumble },
                        { id: 'neon', label: 'Neon', src: PageNeon },
                        { id: 'scrapbook', label: 'Scrapbook', src: PageScrapbook },
                        { id: 'stomp', label: 'Stomp', src: PageStomp },
                        { id: 'block', label: 'Block', src: PageBlockPage },
                      ].map(item => (
                        <ImageButton
                          key={item.id}
                          label={item.label}
                          src={item.src}
                          selected={pageSelected === item.id}
                          onClick={() => setPageSelected(item.id)}
                        />
                      ))}
                    </Grid>
                  </Box>

                  <Spacer size="6u" />
                </Rows>
              </Box>
            </TabPanel>
            <TabPanel id="text">
              <Spacer size="1u" />
              <Box paddingX="2u">
                <Text weight="bold" size="medium">
                  Presentation settings
                </Text>
              </Box>
              <Spacer size="1u" />
              <Box paddingX="2u">
                <Box display="flex" alignItems="center" justifyContent="spaceBetween">
                  <Text>Appear on click</Text>
                  <Switch
                    value={appearOnClick}
                    onChange={setAppearOnClick}
                    ariaLabel="Appear on click"
                  />
                </Box>
              </Box>
              <Spacer size="2u" />
              <Box paddingX="2u">
                <Text weight="bold" size="medium">
                  Custom
                </Text>
              </Box>
              <Spacer size="1u" />
              <Box paddingX="2u">
                <Box
                  border="standard"
                  borderRadius="element"
                  padding="1u"
                  className={styles.hoverCard}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src={CreateAnimationImg}
                      className={styles.iconPlaceholder}
                      alt="Create an Animation"
                    />
                    <Spacer size="2u" />
                    <Box>
                      <Text weight="bold" size="medium">
                        Create an Animation
                      </Text>
                      <Spacer size="1u" />
                      <Text tone="secondary" size="small">
                        Drag elements around the canvas to create your own animations.
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Spacer size="2u" />
              <Box paddingX="2u">
                <Text weight="bold" size="medium">
                  Suggested
                </Text>
              </Box>
              <Spacer size="1u" />
              <Box paddingX="2u">{renderGrid(suggested)}</Box>
              <Spacer size="2u" />
              <Box paddingX="2u">
                <Text weight="bold" size="medium">
                  General
                </Text>
              </Box>
              <Spacer size="1u" />
              <Box paddingX="2u">{renderGrid(general)}</Box>
              <Spacer size="2u" />
              <Box paddingX="2u">
                <Text weight="bold" size="medium">
                  Add-on effects
                </Text>
              </Box>
              <Spacer size="1u" />
              <Box paddingX="2u">{renderGrid(addOns)}</Box>
              <Spacer size="6u" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Footer - non-scrolling */}
      <Box padding="2u" className={styles.footer}>
        <Button variant="primary" className={styles.fullWidthButton}>
          Remove animation
        </Button>
      </Box>
    </Box>
  );
}
