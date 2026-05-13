import React from 'react';
import { Box, Inline, Rows, Text, Title } from '@canva/easel';
import { Card, CardImageThumbnail } from '@canva/easel/card';
import type { LearningItem, LearningItemType } from '@/data/designSchoolCatalog';
import { openDesignSchoolVideo } from '@/store';

const INLINE_TYPES: LearningItemType[] = ['Video', 'Activity', 'Cheatsheet'];

type LearningContentSuggestionsProps = {
  items: LearningItem[];
};

/**
 * Build the compact list-card subtitle. Mirrors the Figma
 * "Selection Sub Thread Card" pattern: a single line of secondary-tone
 * meta text under the bold title (no icon, no badge — the type lives
 * inline with the duration / level so the card chrome stays minimal).
 *
 * Examples:
 *   "Video · 3 min"
 *   "Lesson · 5 min · Beginner"
 */
function formatSubtitle(item: LearningItem): string {
  const parts: string[] = [item.type, item.duration];
  if (item.level) parts.push(item.level);
  return parts.join(' · ');
}

/**
 * Compact horizontal list card used for every learning suggestion (Video,
 * Activity, Cheatsheet, Lesson, Course). Matches the Figma "Selection Sub
 * Thread Card" reference: thumbnail on the left, two-line text stack on
 * the right, low-emphasis 12px-radius border, no badges.
 *
 * Notes on token mapping from Figma:
 * - Figma `radius/element/softest = 16px`. Easel `Card.borderRadius` only
 *   accepts `'none' | 'elementSmall' | 'element' | 'elementRelaxed'`
 *   (4 / 8 / 12). We use the largest available, `elementRelaxed` (12px),
 *   which is the closest design-system match.
 * - Figma thumbnail is a 1:1 square sized to the card's content height
 *   (`h-[100cqw] w-[100cqh]` in the source — a square locked to the
 *   parent's 48px height inside the card's 12px padding). We express
 *   that with `aspectRatio={1}` + `width={48}` so the thumbnail is the
 *   same 48 × 48 square as the design, with the 12px padding-around-image
 *   coming from the card chrome's outer padding.
 * - Title is `body/medium-bold` (14px / 22px / weight 600) → Easel
 *   `Text size="medium" weight="bold"` (internally `textBoldMedium`,
 *   which maps to the `typographyBodyMediumBold` token at weight 600 —
 *   matching the Figma exactly).
 * - Subtitle is `body/small` (12px / 20px / regular) → Easel
 *   `Text size="small"` (12px). The Figma subtitle color is
 *   `content/subtlest-fg = rgba(14,19,24,0.7)`, which Easel exposes as
 *   `tone="tertiary"` (the `subtlestFg` color token); `tone="secondary"`
 *   maps to the `subtleFg` token, a slightly heavier neutral that doesn't
 *   match the Figma's 70%-alpha treatment.
 * - Both texts line-clamp to 1 line so the card never grows past its
 *   target height regardless of title length.
 */
function renderCompactCard(item: LearningItem): React.ReactNode {
  return (
    <Card
      key={item.id}
      layout="horizontal"
      border="low"
      borderRadius="elementRelaxed"
      hoverEffect="bgColorTransition"
      hoverBoundary="card"
      padding="0"
      ariaLabel={item.title}
      onClick={() => {
        if (item.videoEmbedUrl) {
          openDesignSchoolVideo({
            id: item.id,
            title: item.title,
            embedUrl: item.videoEmbedUrl,
            type: item.type,
            duration: item.duration,
            series: item.series,
            description: item.description,
            transcript: item.transcript,
          });
          return;
        }
        // Lessons / courses / non-video items don't have an inline player
        // yet — they're navigation entry points to Design School. Wire up
        // a real route here when those destinations exist.
        console.log('Learning content card clicked:', item.id);
      }}
      content={
        // Render the full row through Card's `content` slot (omitting
        // `thumbnail` / `title` / `description`) so we can lay it out
        // inside an `Inline alignY="center"`. Easel `Card`'s built-in
        // `thumbnail` slot doesn't stretch to row height in horizontal
        // layout — a wrapper `Box height="full" alignItems="center"`
        // around `CardImageThumbnail` therefore collapses to the 48px
        // image height and the image renders flush-top instead of
        // vertically centred next to the two-line text stack.
        // `Inline alignY="center"` is a proper centring primitive and
        // doesn't depend on the parent having a defined height.
        //
        // Outer `Box padding="1.5u"` plus `Inline spacing="1.5u"` yields
        // the Figma's 12px-on-all-sides card padding and 12px gap
        // between image and text. Card's own `padding` snaps to 0 / 8 /
        // 16, none of which matches 12px — `padding="0"` on Card +
        // `padding="1.5u"` on this Box hits the exact spec.
        //
        // Mirror of `PracticeActivityCard` so every Design School
        // compact card uses one shape.
        <Box padding="1.5u">
          <Inline spacing="1.5u" alignY="center">
            <CardImageThumbnail
              src={item.imageUrl}
              alt={item.title}
              aspectRatio={1}
              width={48}
              border="none"
            />
            <Rows spacing="0">
              <Text size="medium" weight="bold" lineClamp={1}>
                {item.title}
              </Text>
              <Text size="small" tone="tertiary" lineClamp={1}>
                {formatSubtitle(item)}
              </Text>
            </Rows>
          </Inline>
        </Box>
      }
    />
  );
}

/**
 * Renders the Design School learning content suggestion block at the
 * bottom of an AI reply. All cards now use the same compact horizontal
 * list style (see `renderCompactCard`); the inline / "further learning"
 * split is preserved as section grouping rather than a visual style
 * difference, so the user still sees a small "Explore further learning
 * in Design School" header above the lessons + courses.
 */
export function LearningContentSuggestions({
  items,
}: LearningContentSuggestionsProps): React.ReactNode {
  if (items.length === 0) return null;

  const inlineItems = items.filter(item => INLINE_TYPES.includes(item.type));
  const furtherItems = items.filter(item => !INLINE_TYPES.includes(item.type));

  return (
    <Box width="full" paddingTop="1u">
      <Rows spacing="2u">
        {inlineItems.length > 0 && (
          <Rows spacing="1u">{inlineItems.map(item => renderCompactCard(item))}</Rows>
        )}

        {furtherItems.length > 0 && (
          <Rows spacing="1u">
            <Title size="xsmall">Explore further learning in Design School</Title>
            <Rows spacing="1u">{furtherItems.map(item => renderCompactCard(item))}</Rows>
          </Rows>
        )}
      </Rows>
    </Box>
  );
}
