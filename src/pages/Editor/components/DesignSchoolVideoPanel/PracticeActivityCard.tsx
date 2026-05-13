import React from 'react';
import { Box, Inline, Rows, Text } from '@canva/easel';
import { Card, CardImageThumbnail } from '@canva/easel/card';
import { LOGO_DESIGN_LESSONS, type LearningItem } from '@/data/designSchoolCatalog';

/**
 * Brand Kit activity used as the default "next step" CTA below a Design
 * School video. Resolved at module load from the catalog (rather than
 * hardcoded) so any edit to the activity's title or thumbnail flows
 * through automatically.
 */
const BRAND_KIT_ACTIVITY: LearningItem | undefined = LOGO_DESIGN_LESSONS.find(
  item => item.id === 'design-with-your-brand-kit-activity',
);

interface PracticeActivityCardProps {
  /**
   * Override the activity to surface (defaults to the Brand Kit activity).
   * Useful if a future video wants to suggest a different follow-up.
   */
  activity?: LearningItem;
  /**
   * Subtitle text shown under the activity title. Defaults to
   * "Interactive activity" — labels the row as the activity surface so
   * the title can stay product-focused ("Design with your brand kit")
   * rather than carrying the format hint.
   */
  cta?: string;
  /** Click handler. Defaults to a no-op `console.log` for prototype use. */
  onActivityClick?: (activity: LearningItem) => void;
}

/**
 * "Practice your skills" — a compact horizontal card surfaced below a
 * Design School video, inviting the user to follow up the lesson with a
 * hands-on activity.
 *
 * Visual treatment ports the Figma "Selection sub-thread card · Image"
 * variant 1:1
 * (https://www.figma.com/design/QMOZl2KeEJlCFMvEYoB9zK/Design-School-Vision?node-id=1026-13710):
 *
 *   - 12px outer card padding, 16px corner radius (capped to Easel's
 *     `elementRelaxed` = 12px because `Card.borderRadius` doesn't go
 *     higher — the largest design-system match).
 *   - 1px low-emphasis border (`border="low"` matches the Figma
 *     `ui/border` token at `rgba(57,76,96,0.15)`).
 *   - 48 × 48 image thumbnail on the left with 12px breathing room from
 *     the card edge.
 *   - Title in `body/medium-bold` (14px / weight 600 / `content/fg`).
 *   - Subtitle in `body/small` regular at `content/subtlest-fg`
 *     (`tone="tertiary"` — matches the 70%-alpha treatment).
 *
 * Identical compact-card pattern to `LearningContentSuggestions`'s
 * `renderCompactCard` — reusing the shape keeps every card in the
 * Design School surface visually consistent. Only the subtitle is
 * different here (a static CTA instead of the type/duration meta).
 */
export function PracticeActivityCard({
  activity = BRAND_KIT_ACTIVITY,
  cta = 'Interactive activity',
  onActivityClick,
}: PracticeActivityCardProps): React.ReactNode {
  if (!activity) return null;

  return (
    <Card
      layout="horizontal"
      border="low"
      borderRadius="elementRelaxed"
      hoverEffect="bgColorTransition"
      hoverBoundary="card"
      padding="0"
      ariaLabel={activity.title}
      onClick={() => {
        if (onActivityClick) {
          onActivityClick(activity);
          return;
        }
        // Prototype default — wire to a real Design School activity
        // route here when one exists.
        console.log('Practice activity card clicked:', activity.id);
      }}
      content={
        // Render the full card row through `content` (with `thumbnail`
        // / `title` / `description` omitted) so we can lay everything
        // out inside an `Inline alignY="center"`. Easel `Card`'s
        // built-in `thumbnail` slot doesn't stretch to the row height,
        // which means a wrapper `Box height="full" alignItems="center"`
        // around `CardImageThumbnail` collapses to the natural image
        // height (48px) and the image ends up flush-top instead of
        // vertically centred next to the two-line text stack.
        // `Inline` with `alignY="center"` is a proper centring
        // primitive and Just Works.
        //
        // Outer `Box padding="1.5u"` gives the Figma's 12px-on-all-
        // sides card padding (Card's own `padding` prop snaps to 0/8/
        // 16, none of which matches 12px — `padding="0"` on Card +
        // `padding="1.5u"` on this Box hits the exact spec).
        <Box padding="1.5u">
          <Inline spacing="1.5u" alignY="center">
            <CardImageThumbnail
              src={activity.imageUrl}
              alt={activity.title}
              aspectRatio={1}
              width={48}
              border="none"
            />
            <Rows spacing="0">
              <Text size="medium" weight="bold" lineClamp={1}>
                {activity.title}
              </Text>
              <Text size="small" tone="tertiary" lineClamp={1}>
                {cta}
              </Text>
            </Rows>
          </Inline>
        </Box>
      }
    />
  );
}
