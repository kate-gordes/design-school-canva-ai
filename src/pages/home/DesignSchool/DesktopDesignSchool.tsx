import React, { useState } from 'react';
import { Box, Carousel, Inline, Pill, Rows, Text, Title } from '@canva/easel';
import { Card, CardImageThumbnail } from '@canva/easel/card';
import { TextInput } from '@canva/easel/form/text_input';
import { ClockIcon, SearchIcon } from '@canva/easel/icons';
import HomePageLayout from '@/pages/home/components/HomePageLayout';
import GradientText from '@/pages/home/components/GradientText';
import SectionTitle from '@/shared_components/SectionTitle';
import {
  DESIGN_SCHOOL_PILLS,
  ENHANCE_WORKFLOWS_COURSES,
  LATEST_COURSES,
  UP_NEXT_COURSES,
  type DesignSchoolCourse,
} from './data';
import styles from './DesktopDesignSchool.module.css';

/**
 * Desktop landing page for `/design-school`. Mirrors the content of the
 * mobile variant (`MobileDesignSchool`) — same hero copy, same pills,
 * same three carousels — but reuses the editor's `HomePageLayout`
 * chrome (gradient banner + max-width content container) so it sits
 * consistently next to the other desktop home destinations
 * (Templates / Brand / Apps / etc.).
 *
 * The shared content lives in `./data.ts` so that any edit to a
 * course / lesson / pill ships to both surfaces in one change.
 *
 * Click handlers are stubbed (`console.log`) for the prototype — wire
 * them to real Design School routes when those destinations exist.
 * This is consistent with how the mobile variant handles them today.
 */
export default function DesktopDesignSchool(): React.ReactNode {
  const [selectedPill, setSelectedPill] = useState('new-in-canva');
  const [searchValue, setSearchValue] = useState('');

  return (
    <HomePageLayout>
      <Box paddingX="3u" paddingTop="6u" paddingBottom="6u">
        <Rows spacing="6u">
          {/* Hero — large gradient title, kept short so the page leads
              with the catalog itself rather than a marketing block. */}
          <Box width="full" paddingY="4u">
            <Rows spacing="2u" align="center">
              <div className={styles.heroTitle}>
                <GradientText>Learn without limits with Design School</GradientText>
              </div>
              <Box className={styles.heroSubtitle}>
                <Text size="medium" tone="secondary" alignment="center">
                  Bite-sized lessons, full courses, and certifications to level up your design
                  skills.
                </Text>
              </Box>
            </Rows>
          </Box>

          {/* Search + category pills. The search field is purely
              cosmetic in the prototype — the real Design School page
              wires it up to its own catalog index. Pills filter by
              content type. */}
          <Rows spacing="3u" align="center">
            <Box className={styles.searchField}>
              <TextInput
                placeholder="What do you want to learn?"
                value={searchValue}
                onChange={value => setSearchValue(value)}
                type="search"
                start={<SearchIcon size="medium" />}
              />
            </Box>
            <Box className={styles.pillsRow}>
              <Inline spacing="1u" align="center">
                {DESIGN_SCHOOL_PILLS.map(pill => (
                  <Pill
                    key={pill.id}
                    size="medium"
                    text={pill.label}
                    selected={selectedPill === pill.id}
                    onClick={() => setSelectedPill(pill.id)}
                  />
                ))}
              </Inline>
            </Box>
          </Rows>

          <Rows spacing="6u">
            <CourseCarousel title="Up next, picked for you" courses={UP_NEXT_COURSES} />
            <CourseCarousel title="Latest & greatest" courses={LATEST_COURSES} />
            <CourseCarousel
              title="Enhance workflows with apps and integrations"
              courses={ENHANCE_WORKFLOWS_COURSES}
            />
          </Rows>
        </Rows>
      </Box>
    </HomePageLayout>
  );
}

interface CourseCarouselProps {
  title: string;
  courses: DesignSchoolCourse[];
}

/**
 * One section of the Design School page — section title + horizontal
 * carousel of `CourseCard`s. Carousel handles the scroll/peek/arrow
 * behaviour itself; we just feed it the cards.
 */
function CourseCarousel({ title, courses }: CourseCarouselProps): React.ReactNode {
  return (
    <Rows spacing="2u">
      <SectionTitle text={title} />
      <Carousel
        ariaLabel={title}
        gap="2u"
        buttonVariant="circular"
        // `name` is non-standard on the documented Carousel API; the
        // mobile variant passes it for parity with an older codebase
        // pattern. Skipped here — `ariaLabel` is the documented hook
        // for screen-reader / button-label context.
      >
        {courses.map(course => (
          <Box key={course.id} className={styles.courseCardWrapper}>
            <CourseCard course={course} />
          </Box>
        ))}
      </Carousel>
    </Rows>
  );
}

interface CourseCardProps {
  course: DesignSchoolCourse;
}

/**
 * Vertical course / lesson / video card. Same shape as the mobile
 * variant but sized for the desktop layout (the wrapper class controls
 * the column width — see `.courseCardWrapper` in the CSS module).
 *
 * The eyebrow tone differs slightly per content type: courses use the
 * brand purple from `.courseType`, lessons / videos use a neutral blue
 * from `.lessonType`. Mirrors the mobile treatment.
 */
function CourseCard({ course }: CourseCardProps): React.ReactNode {
  const isLessonOrVideo = course.type === 'Lesson' || course.type === 'Video';
  const eyebrowClass = isLessonOrVideo ? styles.lessonType : styles.courseType;

  return (
    <Card
      layout="vertical"
      border="low"
      onClick={() => console.log('Design School card clicked:', course.id)}
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
          <Text size="xsmall" weight="bold" className={eyebrowClass}>
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
        course.duration ? (
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
        ) : undefined
      }
    />
  );
}
