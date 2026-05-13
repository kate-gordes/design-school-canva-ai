import React from 'react';
import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { Switch } from '@canva/easel/form/switch';
import { Button } from '@canva/easel/button';
import { ArrowRightIcon } from '@canva/easel/icons';
import sharedStyles from '../shared.module.css';

export default function AIPersonalization(): React.ReactNode {
  return (
    <Box className={sharedStyles.settingsViewContainer}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Rows spacing="1u">
            <Title size="large" alignment="center">
              AI personalization
            </Title>
            <Text tone="secondary" alignment="center">
              Control how Canva AI uses your data to create personalized experiences.
            </Text>
          </Rows>
        </Box>

        {/* Memory section */}
        <Box paddingTop="0.4u">
          <Rows spacing="0.4u">
            <Title size="small" className={sharedStyles.sectionTitle}>
              Memory
            </Title>

            <Box className={sharedStyles.settingsCard}>
              <Rows spacing="1.5u">
                <Columns spacing="2u" alignY="start">
                  <Column>
                    <Rows spacing="1u">
                      <Text weight="bold">Save and reference memories</Text>
                      <Text tone="secondary">
                        Let Canva AI save and use memories when responding.
                      </Text>
                    </Rows>
                  </Column>
                  <Column width="content">
                    <Switch defaultValue={true} />
                  </Column>
                </Columns>

                <Box>
                  <Columns spacing="0">
                    <Column width="content">
                      <Button
                        variant="secondary"
                        icon={ArrowRightIcon}
                        iconPosition="end"
                        fullWidth
                      >
                        Manage memories
                      </Button>
                    </Column>
                  </Columns>
                </Box>
              </Rows>
            </Box>
          </Rows>
        </Box>
      </Rows>
    </Box>
  );
}
