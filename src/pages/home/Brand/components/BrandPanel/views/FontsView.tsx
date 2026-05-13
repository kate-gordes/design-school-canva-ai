import React from 'react';
import { Box, Rows, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';

interface FontsViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

const fontStyles: { name: string; fontSize: string }[] = [
  { name: 'Title', fontSize: '28px' },
  { name: 'Subtitle', fontSize: '22px' },
  { name: 'Heading', fontSize: '20px' },
  { name: 'Subheading', fontSize: '17px' },
  { name: 'Section header', fontSize: '15px' },
  { name: 'Body', fontSize: '14px' },
  { name: 'Caption', fontSize: '12px' },
  { name: 'Quote', fontSize: '16px' },
];

export default function FontsView(_props: FontsViewProps = {}): React.ReactNode {
  return (
    <Box width="full">
      <BrandPanelTitle>Fonts</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="1u">
        {fontStyles.map((font, index) => (
          <button
            key={index}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '16px 18px',
              border: '1px solid rgba(57, 76, 96, 0.15)',
              borderRadius: '16px',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: font.fontSize,
              fontWeight: font.name === 'Title' || font.name === 'Heading' ? 600 : 400,
              fontStyle: font.name === 'Quote' ? 'italic' : 'normal',
            }}
          >
            {font.name}
          </button>
        ))}
      </Rows>
    </Box>
  );
}
