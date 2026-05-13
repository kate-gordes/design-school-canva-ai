import { Box, Rows, Grid } from '@canva/easel';
import useIsMobile from '@/hooks/useIsMobile';
import { LogoAssetCard } from '@/pages/home/Brand/components/BrandComponents/LogoAssetCard';
import SectionTitle from '@/shared_components/SectionTitle';

export interface LogoAsset {
  id: string;
  title: string;
  image: string;
  type: string;
  timestamp: string;
}

export interface LogoAssetsSectionProps {
  /** Array of logo assets to display */
  assets: LogoAsset[];
  /** Optional callback when an asset is clicked */
  onAssetClick?: (assetId: string) => void;
  /** Whether to show the info alert */
  showAlert?: boolean;
  /** Optional callback when alert is dismissed */
  onAlertDismiss?: () => void;
  /** Optional className for custom styling */
  className?: string;
  /** Optional number of columns in grid (defaults to responsive: 2 mobile, 3 tablet, 4 desktop) */
  columns?: number | { default?: number; smallUp?: number; mediumUp?: number; largeUp?: number };
  /** Whether to show the title (defaults to true) */
  showTitle?: boolean;
  /** Custom title text (defaults to "Assets (count)") */
  title?: string;
  /** Spacing between grid items (defaults to "4u") */
  spacing?: '0' | '0.25u' | '0.5u' | '1u' | '1.5u' | '2u' | '3u' | '4u' | '6u' | '8u' | '12u';
  /** Whether to show asset metadata (title, type, timestamp). Defaults to true */
  showMetadata?: boolean;
}

export default function LogoAssetsSection({
  assets,
  onAssetClick,
  className,
  columns,
  showTitle = true,
  title,
  spacing = '2u',
  showMetadata = true,
}: LogoAssetsSectionProps) {
  const isMobile = useIsMobile();
  const gridColumns = columns ? columns : { default: 2, smallUp: 3, mediumUp: 4, largeUp: 4 };
  const displayTitle = title || `Assets (${assets.length})`;

  return (
    <Box width="full" className={className}>
      <Rows spacing="3u">
        {/* Header - optional */}
        {showTitle && <SectionTitle>{displayTitle}</SectionTitle>}

        {/* Assets Grid */}
        <Grid columns={gridColumns} spacing={spacing}>
          {assets.map(asset => (
            <LogoAssetCard
              key={asset.id}
              title={asset.title}
              image={asset.image}
              description={`${asset.type} • ${asset.timestamp}`}
              onClick={onAssetClick ? () => onAssetClick(asset.id) : undefined}
              showMetadata={showMetadata}
            />
          ))}
        </Grid>
      </Rows>
    </Box>
  );
}
