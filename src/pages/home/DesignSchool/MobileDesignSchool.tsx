import React from 'react';
import { Box, Rows, Title, Text, Carousel, Pill, Inline } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { Card, CardImageThumbnail } from '@canva/easel/card';
import { TextInput } from '@canva/easel/form/text_input';
import { SearchIcon, MenuHorizontalIcon, ClockIcon } from '@canva/easel/icons';
import {
  DESIGN_SCHOOL_PILLS as pills,
  UP_NEXT_COURSES as upNextCourses,
  LATEST_COURSES as latestCourses,
  ENHANCE_WORKFLOWS_COURSES as enhanceWorkflowsCourses,
} from './data';
import styles from './MobileDesignSchool.module.css';

export default function MobileDesignSchool(): React.ReactNode {
  const [selectedPill, setSelectedPill] = React.useState('new-in-canva');
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <>
      {/* Plain divs: Easel Box resets background/margin, which would break the
         fixed white header bar, the hamburger positioning, and the gradient/image
         overlay layers inside the scroll container. */}
      <div className={styles.headerBackground} />

      <div className={styles.menuButton}>
        <BasicButton onClick={() => console.log('Menu clicked')}>
          <MenuHorizontalIcon size="medium" />
        </BasicButton>
      </div>

      <div className={styles.headerTitle}>
        <Text size="large" weight="bold">
          Design School
        </Text>
      </div>

      <div className={styles.container} data-mobile-scroll-container="true">
        <div className={styles.backgroundGradient} />
        <div className={styles.backgroundWrapper} />

        <Box width="full">
          <Rows spacing="0">
            <Box width="full" className={styles.heroSection}>
              <Title size="xlarge" className={styles.heroTitle}>
                Learn without limits
                <br />
                with Design School
              </Title>
            </Box>

            <Box width="full" paddingX="2u" className={styles.searchSection}>
              <TextInput
                placeholder="What do you want to learn?"
                value={searchValue}
                onChange={value => setSearchValue(value)}
                type="search"
                start={<SearchIcon size="medium" />}
              />
            </Box>

            <Box width="full" paddingX="2u" paddingTop="2u" paddingBottom="3u">
              <Carousel name="design-school-pills" gutter="small" buttonVariant="none">
                {pills.map(pill => (
                  <Box key={pill.id}>
                    <Pill
                      size="medium"
                      text={pill.label}
                      selected={selectedPill === pill.id}
                      onClick={() => setSelectedPill(pill.id)}
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>

            <Box width="full" paddingX="2u">
              <Rows spacing="2u">
                <Box width="full" className={styles.carouselSection}>
                  <Rows spacing="2u">
                    <Title size="medium">Up next, picked for you</Title>
                    <Carousel name="up-next-courses" gutter="none" buttonVariant="circular">
                      {upNextCourses.map(course => (
                        <Box key={course.id} className={styles.courseCardWrapper}>
                          <Card
                            layout="vertical"
                            border="low"
                            onClick={() => console.log('Course clicked:', course.id)}
                            thumbnail={
                              <CardImageThumbnail
                                src={course.imageUrl}
                                alt={course.title}
                                aspectRatio={16 / 9}
                                border="none"
                              />
                            }
                            preTitle={
                              <Box padding="2u">
                                <Text size="xsmall" weight="bold" className={styles.courseType}>
                                  {course.type}
                                </Text>
                              </Box>
                            }
                            title={
                              <Box paddingX="2u">
                                <Text size="medium" weight="bold">
                                  {course.title}
                                </Text>
                              </Box>
                            }
                            description={
                              <Box paddingX="2u" paddingBottom="2u">
                                <Rows spacing="0.5u">
                                  <Inline spacing="0.5u" alignY="center">
                                    <ClockIcon size="small" />
                                    <Text size="small" tone="secondary">
                                      {course.duration}
                                    </Text>
                                    {course.level && (
                                      <>
                                        <Text size="small" tone="secondary">
                                          •
                                        </Text>
                                        <Text size="small" tone="secondary">
                                          {course.level}
                                        </Text>
                                      </>
                                    )}
                                  </Inline>
                                  {course.certificate && (
                                    <Text size="small" tone="secondary">
                                      🏆 {course.certificate}
                                    </Text>
                                  )}
                                </Rows>
                              </Box>
                            }
                          />
                        </Box>
                      ))}
                    </Carousel>
                  </Rows>
                </Box>

                <Box width="full" paddingY="2u" className={styles.carouselSection}>
                  <Rows spacing="2u">
                    <Title size="medium">Latest & greatest</Title>
                    <Carousel name="latest-courses" gutter="none" buttonVariant="circular">
                      {latestCourses.map(course => (
                        <Box key={course.id} className={styles.courseCardWrapper}>
                          <Card
                            layout="vertical"
                            border="low"
                            onClick={() => console.log('Lesson clicked:', course.id)}
                            thumbnail={
                              <CardImageThumbnail
                                src={course.imageUrl}
                                alt={course.title}
                                aspectRatio={16 / 9}
                                border="none"
                              />
                            }
                            preTitle={
                              <Box padding="2u">
                                <Text size="xsmall" weight="bold" className={styles.lessonType}>
                                  {course.type}
                                </Text>
                              </Box>
                            }
                            title={
                              <Box paddingX="2u">
                                <Text size="medium" weight="bold">
                                  {course.title}
                                </Text>
                              </Box>
                            }
                            description={
                              course.duration && (
                                <Box paddingX="2u" paddingBottom="2u">
                                  <Inline spacing="0.5u" alignY="center">
                                    <ClockIcon size="small" />
                                    <Text size="small" tone="secondary">
                                      {course.duration}
                                    </Text>
                                    {course.level && (
                                      <>
                                        <Text size="small" tone="secondary">
                                          •
                                        </Text>
                                        <Text size="small" tone="secondary">
                                          {course.level}
                                        </Text>
                                      </>
                                    )}
                                  </Inline>
                                </Box>
                              )
                            }
                          />
                        </Box>
                      ))}
                    </Carousel>
                  </Rows>
                </Box>

                <Box width="full" className={styles.carouselSection}>
                  <Rows spacing="2u">
                    <Title size="medium">Enhance workflows with apps and integrations</Title>
                    <Carousel name="enhance-workflows" gutter="none" buttonVariant="circular">
                      {enhanceWorkflowsCourses.map(course => (
                        <Box key={course.id} className={styles.courseCardWrapper}>
                          <Card
                            layout="vertical"
                            border="low"
                            onClick={() => console.log('Workflow clicked:', course.id)}
                            thumbnail={
                              <CardImageThumbnail
                                src={course.imageUrl}
                                alt={course.title}
                                aspectRatio={16 / 9}
                                border="none"
                              />
                            }
                            preTitle={
                              <Box padding="2u">
                                <Text size="xsmall" weight="bold" className={styles.lessonType}>
                                  {course.type}
                                </Text>
                              </Box>
                            }
                            title={
                              <Box paddingX="2u">
                                <Text size="medium" weight="bold">
                                  {course.title}
                                </Text>
                              </Box>
                            }
                            description={
                              <Box paddingX="2u" paddingBottom="2u">
                                <Inline spacing="0.5u" alignY="center">
                                  <ClockIcon size="small" />
                                  <Text size="small" tone="secondary">
                                    {course.duration}
                                  </Text>
                                  {course.level && (
                                    <>
                                      <Text size="small" tone="secondary">
                                        •
                                      </Text>
                                      <Text size="small" tone="secondary">
                                        {course.level}
                                      </Text>
                                    </>
                                  )}
                                </Inline>
                              </Box>
                            }
                          />
                        </Box>
                      ))}
                    </Carousel>
                  </Rows>
                </Box>
              </Rows>
            </Box>
          </Rows>
        </Box>
      </div>
    </>
  );
}
