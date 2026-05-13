import React from 'react';
import { Box, Rows, Text, Spacer, Carousel } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';

interface ChartType {
  name: string;
  color1: string;
  color2: string;
  preview: React.ReactNode;
}

interface ChartSection {
  title: string;
  seeAll?: boolean;
  charts: ChartType[];
}

function BarPreview({
  color1,
  color2,
  horizontal,
}: {
  color1: string;
  color2: string;
  horizontal?: boolean;
}) {
  if (horizontal) {
    return (
      <svg viewBox="0 0 80 60" width="80" height="60">
        <rect x="0" y="4" width="55" height="8" rx="2" fill={color1} />
        <rect x="0" y="16" width="40" height="8" rx="2" fill={color2} />
        <rect x="0" y="28" width="65" height="8" rx="2" fill={color1} />
        <rect x="0" y="40" width="30" height="8" rx="2" fill={color2} />
        <rect x="0" y="52" width="50" height="8" rx="2" fill={color1} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 60" width="80" height="60">
      <rect x="4" y="30" width="10" height="30" rx="2" fill={color1} />
      <rect x="16" y="15" width="10" height="45" rx="2" fill={color2} />
      <rect x="30" y="20" width="10" height="40" rx="2" fill={color1} />
      <rect x="42" y="10" width="10" height="50" rx="2" fill={color2} />
      <rect x="56" y="25" width="10" height="35" rx="2" fill={color1} />
      <rect x="68" y="5" width="10" height="55" rx="2" fill={color2} />
    </svg>
  );
}

function StackedBarPreview({
  color1,
  color2,
  horizontal,
}: {
  color1: string;
  color2: string;
  horizontal?: boolean;
}) {
  if (horizontal) {
    return (
      <svg viewBox="0 0 80 60" width="80" height="60">
        <rect x="0" y="4" width="35" height="10" rx="2" fill={color1} />
        <rect x="35" y="4" width="25" height="10" rx="2" fill={color2} />
        <rect x="0" y="20" width="25" height="10" rx="2" fill={color1} />
        <rect x="25" y="20" width="35" height="10" rx="2" fill={color2} />
        <rect x="0" y="36" width="40" height="10" rx="2" fill={color1} />
        <rect x="40" y="36" width="20" height="10" rx="2" fill={color2} />
        <rect x="0" y="50" width="30" height="10" rx="2" fill={color1} />
        <rect x="30" y="50" width="30" height="10" rx="2" fill={color2} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 60" width="80" height="60">
      <rect x="6" y="25" width="14" height="20" rx="2" fill={color1} />
      <rect x="6" y="10" width="14" height="15" rx="2" fill={color2} />
      <rect x="24" y="15" width="14" height="30" rx="2" fill={color1} />
      <rect x="24" y="5" width="14" height="10" rx="2" fill={color2} />
      <rect x="42" y="20" width="14" height="25" rx="2" fill={color1} />
      <rect x="42" y="8" width="14" height="12" rx="2" fill={color2} />
      <rect x="60" y="30" width="14" height="15" rx="2" fill={color1} />
      <rect x="60" y="18" width="14" height="12" rx="2" fill={color2} />
    </svg>
  );
}

function LinePreview({
  color1,
  color2,
  multi,
}: {
  color1: string;
  color2: string;
  multi?: boolean;
}) {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60">
      <polyline
        points="5,45 20,30 35,35 50,15 65,25 78,10"
        fill="none"
        stroke={color1}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {multi && (
        <polyline
          points="5,50 20,40 35,45 50,30 65,35 78,20"
          fill="none"
          stroke={color2}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function PiePreview({ color1, color2 }: { color1: string; color2: string }) {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <circle cx="30" cy="30" r="25" fill={color2} />
      <path d="M30,30 L30,5 A25,25 0 0,1 55,30 Z" fill={color1} />
      <path d="M30,30 L55,30 A25,25 0 0,1 43,51 Z" fill="#8b5cf6" />
    </svg>
  );
}

function DonutPreview({ color1, color2 }: { color1: string; color2: string }) {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <circle cx="30" cy="30" r="25" fill="none" stroke={color2} strokeWidth="10" />
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="none"
        stroke={color1}
        strokeWidth="10"
        strokeDasharray="52 105"
        strokeDashoffset="0"
      />
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="10"
        strokeDasharray="26 131"
        strokeDashoffset="-52"
      />
    </svg>
  );
}

function AreaPreview({ color1, color2 }: { color1: string; color2: string }) {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60">
      <polygon points="5,55 20,35 35,40 50,20 65,30 78,15 78,55" fill={color1} opacity="0.4" />
      <polyline
        points="5,55 20,35 35,40 50,20 65,30 78,15"
        fill="none"
        stroke={color1}
        strokeWidth="2"
      />
      <polygon points="5,55 20,45 35,48 50,35 65,40 78,28 78,55" fill={color2} opacity="0.3" />
      <polyline
        points="5,55 20,45 35,48 50,35 65,40 78,28"
        fill="none"
        stroke={color2}
        strokeWidth="2"
      />
    </svg>
  );
}

function ScatterPreview({ color1, color2 }: { color1: string; color2: string }) {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60">
      <circle cx="15" cy="40" r="4" fill={color1} />
      <circle cx="25" cy="20" r="4" fill={color2} />
      <circle cx="38" cy="35" r="4" fill={color1} />
      <circle cx="50" cy="15" r="4" fill={color2} />
      <circle cx="60" cy="30" r="4" fill={color1} />
      <circle cx="70" cy="10" r="4" fill={color2} />
      <circle cx="30" cy="50" r="3" fill={color2} />
      <circle cx="55" cy="45" r="3" fill={color1} />
    </svg>
  );
}

const c1 = '#7c3aed';
const c2 = '#06b6d4';

const CHART_SECTIONS: ChartSection[] = [
  {
    title: 'Bar charts',
    seeAll: true,
    charts: [
      {
        name: 'Grouped bar',
        color1: c1,
        color2: c2,
        preview: <BarPreview color1={c1} color2={c2} />,
      },
      {
        name: 'Stacked bar',
        color1: c1,
        color2: c2,
        preview: <StackedBarPreview color1={c1} color2={c2} />,
      },
      {
        name: 'Grouped row',
        color1: c1,
        color2: c2,
        preview: <BarPreview color1={c1} color2={c2} horizontal />,
      },
      {
        name: 'Stacked row',
        color1: c1,
        color2: c2,
        preview: <StackedBarPreview color1={c1} color2={c2} horizontal />,
      },
    ],
  },
  {
    title: 'Line charts',
    charts: [
      {
        name: 'Multi-line',
        color1: c1,
        color2: c2,
        preview: <LinePreview color1={c1} color2={c2} multi />,
      },
      { name: 'Line', color1: c1, color2: c2, preview: <LinePreview color1={c1} color2={c2} /> },
    ],
  },
  {
    title: 'Pie and donut charts',
    charts: [
      { name: 'Pie', color1: c1, color2: c2, preview: <PiePreview color1={c1} color2={c2} /> },
      { name: 'Donut', color1: c1, color2: c2, preview: <DonutPreview color1={c1} color2={c2} /> },
    ],
  },
  {
    title: 'Area charts',
    seeAll: true,
    charts: [
      {
        name: 'Unstacked area',
        color1: c1,
        color2: c2,
        preview: <AreaPreview color1={c1} color2={c2} />,
      },
      {
        name: 'Proportional area',
        color1: '#8b5cf6',
        color2: '#a855f7',
        preview: <AreaPreview color1="#8b5cf6" color2="#a855f7" />,
      },
      {
        name: 'Streamgraph',
        color1: c1,
        color2: c2,
        preview: <AreaPreview color1={c2} color2={c1} />,
      },
      {
        name: 'Stacked area',
        color1: c1,
        color2: c2,
        preview: <AreaPreview color1={c1} color2="#8b5cf6" />,
      },
    ],
  },
  {
    title: 'Scatter and dot charts',
    seeAll: true,
    charts: [
      {
        name: 'Scatter',
        color1: c1,
        color2: c2,
        preview: <ScatterPreview color1={c1} color2={c2} />,
      },
      {
        name: 'Bubble',
        color1: c1,
        color2: '#8b5cf6',
        preview: <ScatterPreview color1={c1} color2="#8b5cf6" />,
      },
      {
        name: 'Dot plot',
        color1: c2,
        color2: c1,
        preview: <ScatterPreview color1={c2} color2={c1} />,
      },
      {
        name: 'Lollipop',
        color1: '#8b5cf6',
        color2: c2,
        preview: <ScatterPreview color1="#8b5cf6" color2={c2} />,
      },
    ],
  },
];

function ChartCard({ chart }: { chart: ChartType }) {
  return (
    <button
      onClick={() => console.log('Chart selected:', chart.name)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0 8px',
        minWidth: 100,
      }}
    >
      <div
        style={{
          width: 85,
          height: 85,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {chart.preview}
      </div>
      <Text size="small" alignment="center">
        {chart.name}
      </Text>
    </button>
  );
}

interface ChartsViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function ChartsView(_props: ChartsViewProps = {}): React.ReactNode {
  return (
    <Box width="full">
      <BrandPanelTitle>Charts</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="3u">
        {CHART_SECTIONS.map(section => (
          <Box key={section.title}>
            <Box display="flex" justifyContent="spaceBetween" alignItems="center">
              <Text size="medium" weight="bold">
                {section.title}
              </Text>
              {section.seeAll && (
                <button
                  onClick={() => console.log('See all:', section.title)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Text size="small" tone="secondary" weight="bold">
                    See all
                  </Text>
                </button>
              )}
            </Box>
            <Spacer direction="horizontal" size="2u" />
            <Carousel name={section.title} buttonVariant="chevron" gutter="none">
              {section.charts.map(chart => (
                <ChartCard key={chart.name} chart={chart} />
              ))}
            </Carousel>
          </Box>
        ))}
      </Rows>
    </Box>
  );
}
