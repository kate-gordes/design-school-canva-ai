import { Box, Rows, Spacer } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import TextStyleList from '@/pages/home/Brand/components/BrandComponents/TextStyleList';
import { textStyles } from './SampleData/FontsSampleData';
import { useState } from 'react';

export default function Fonts(): React.ReactNode {
  const [fontStyles, setFontStyles] = useState(textStyles);

  const handleTextStylesChange = (updatedStyles: typeof textStyles) => {
    setFontStyles(updatedStyles);
    console.log('Text styles updated:', updatedStyles);
  };

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        {/* Brand Header */}

        <BrandHeader
          title="Fonts"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new text style')}
          onMoreClick={() => console.log('More options')}
        />
        <Spacer size="3u" />
        <TextStyleList
          textStyles={fontStyles}
          editable={false}
          onTextStylesChange={handleTextStylesChange}
        />
      </Box>
    </Rows>
  );
}
