import {
  Box,
  Rows,
  Text,
  Button,
  Columns,
  Column,
  BulletList,
  BulletListItem,
  Inline,
} from '@canva/easel';
import { ChevronUpIcon, ChevronDownIcon, CheckIcon, XIcon } from '@canva/easel/icons';
import { useState } from 'react';
import styles from './GuidelinesAccordion.module.css';
import { BaseButton } from '@canva/easel/button/base_button';

export interface GuidelineItem {
  text: string;
}

export interface GuidelinesAccordionProps {
  /** Main description text */
  description: string;
  /** List of "Do" guidelines */
  doItems: GuidelineItem[];
  /** List of "Don't" guidelines */
  dontItems: GuidelineItem[];
  /** Whether accordion starts expanded */
  defaultExpanded?: boolean;
}

export default function GuidelinesAccordion({
  description,
  doItems,
  dontItems,
  defaultExpanded = true,
}: GuidelinesAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <>
      <Box
        width="full"
        border="low"
        borderRadius="containerLarge"
        className={styles.accordionContainer}
      >
        <Rows spacing="3u">
          {/* Description */}
          <Text size="medium">{description}</Text>

          {/* Expandable Content */}
          {isExpanded && (
            <Columns spacing="2u" alignY="stretch">
              {/* Do Column */}
              <Column width="1/2">
                <Box display="flex" flexDirection="column" height="full">
                  <Inline spacing="1u" alignY="center">
                    <CheckIcon size="small" className={styles.greenIcon} />
                    <Text weight="bold" className={styles.greenText}>
                      Do
                    </Text>
                  </Inline>
                  <Box paddingTop="1u" flex="auto">
                    <Box
                      background="neutralSubtle"
                      borderRadius="elementStandard"
                      padding="2u"
                      height="full"
                    >
                      <BulletList>
                        {doItems.map((item, index) => (
                          <BulletListItem key={index}>
                            <Text size="medium">{item.text}</Text>
                          </BulletListItem>
                        ))}
                      </BulletList>
                    </Box>
                  </Box>
                </Box>
              </Column>

              {/* Don't Column */}
              <Column width="1/2">
                <Box display="flex" flexDirection="column" height="full">
                  <Inline spacing="1u" alignY="center">
                    <XIcon size="small" className={styles.redIcon} />
                    <Text weight="bold" className={styles.redText}>
                      Don't
                    </Text>
                  </Inline>
                  <Box paddingTop="1u" flex="auto">
                    <Box
                      background="neutralSubtle"
                      borderRadius="elementStandard"
                      padding="2u"
                      height="full"
                    >
                      <BulletList>
                        {dontItems.map((item, index) => (
                          <BulletListItem key={index}>
                            <Text size="medium">{item.text}</Text>
                          </BulletListItem>
                        ))}
                      </BulletList>
                    </Box>
                  </Box>
                </Box>
              </Column>
            </Columns>
          )}

          {/* Collapse/Expand Button */}
        </Rows>
        <Box
          display="flex"
          justifyContent="center"
          className={styles.collapseExpandButtonContainer}
        >
          <BaseButton
            shadow="elevationSurfaceFloating"
            border="standard"
            borderRadius="element"
            className={styles.collapseExpandButton}
          >
            <Button
              // shadow="elevationSurfaceFloating"
              variant="tertiary"
              icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              onClick={() => setIsExpanded(!isExpanded)}
              // padding="2u"
            />
          </BaseButton>
        </Box>
      </Box>
    </>
  );
}
