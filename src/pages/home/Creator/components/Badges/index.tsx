import { Badge, Text, Inline } from '@canva/easel';
import { ClockIcon, DollarSignIcon, ChevronUpIcon } from '@canva/easel/icons';

// Type Badge - describes what type of content this is
export const TypeBadge = ({ type }: { type: string }) => {
  return <Badge tone="neutral" size="tiny" text={type.toUpperCase()} />;
};

// Time Left Badge - yellow badge with countdown
export const TimeLeftBadge = ({
  days,
  timeUnit = 'DAYS',
}: {
  days: number;
  timeUnit?: 'DAY' | 'DAYS' | 'HOURS' | 'MINUTES';
}) => {
  const displayText = days === 1 ? `1 ${timeUnit.slice(0, -1)} LEFT` : `${days} ${timeUnit} LEFT`;

  return (
    <Badge tone="warn" size="small">
      <Inline spacing="0.25u" alignY="center">
        <ClockIcon size="tiny" />
        <Text size="xsmall" weight="bold">
          {displayText}
        </Text>
      </Inline>
    </Badge>
  );
};

// Earn Badge - purple badge with dollar amount
export const EarnBadge = ({ amount }: { amount: number }) => {
  return (
    <Badge tone="info" size="small">
      <Inline spacing="0.25u" alignY="center">
        <DollarSignIcon size="tiny" />
        <Text size="xsmall" weight="bold">
          EARN ${amount}
        </Text>
      </Inline>
    </Badge>
  );
};

// Trend Badge - shows trending metrics with arrows
export const TrendBadge = ({ value, percentage }: { value: string; percentage: number }) => {
  return (
    <Badge tone="info" size="small">
      <Inline spacing="0.25u" alignY="center">
        <ChevronUpIcon size="tiny" />
        <Text size="xsmall" weight="bold">
          {value} +{percentage}%
        </Text>
      </Inline>
    </Badge>
  );
};

// Generic Badge wrapper for other use cases
export const GenericBadge = ({
  tone,
  text,
  icon: IconComponent,
}: {
  tone: 'contrast' | 'neutral' | 'positive' | 'warn' | 'info' | 'critical';
  text: string;
  icon?: React.ComponentType<{ size: string }>;
}) => {
  return (
    <Badge tone={tone} size="small">
      <Inline spacing="0.25u" alignY="center">
        {IconComponent && <IconComponent size="tiny" />}
        <Text size="xsmall" weight="bold">
          {text}
        </Text>
      </Inline>
    </Badge>
  );
};

// Combined Badges component that can render all types
export const Badges = ({
  typeBadge,
  timeLeft,
  earnAmount,
  trendData,
}: {
  typeBadge?: string;
  timeLeft?: { days: number; unit?: 'DAY' | 'DAYS' | 'HOURS' | 'MINUTES' };
  earnAmount?: number;
  trendData?: { value: string; percentage: number };
}) => {
  return (
    <Inline spacing="0.5u" alignY="center">
      {typeBadge && <TypeBadge type={typeBadge} />}
      {timeLeft && <TimeLeftBadge days={timeLeft.days} timeUnit={timeLeft.unit} />}
      {earnAmount && <EarnBadge amount={earnAmount} />}
      {trendData && <TrendBadge value={trendData.value} percentage={trendData.percentage} />}
    </Inline>
  );
};
