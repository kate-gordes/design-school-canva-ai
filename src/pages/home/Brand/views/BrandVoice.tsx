import { Box, Rows, Text, Button } from '@canva/easel';
import { MagicPencilIcon } from '@canva/easel/icons';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import { useAppContext } from '@/hooks/useAppContext';
import styles from '../Brand.module.css';
export default function BrandVoice(): React.ReactNode {
  const { selectedBrandKit } = useAppContext();
  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <BrandHeader
          title="Brand Voice"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new brand voice')}
          onMoreClick={() => console.log('More options')}
        />

        <Box width="full" paddingLeft="2u">
          <Rows spacing="2u">
            <Text>Think of Canva like a person</Text>
            <Text tone="secondary">
              We have a core personality that stays true to who we are, but our brand voice can flex
              depending on where we are, who we're talking to, and what we're talking about. That
              doesn't mean we use marketing jargon for an enterprise audience or default to cute
              words for creators. Instead, we use language that's as simple to understand as our
              product is to use.
            </Text>
            <Box paddingTop="2u">
              <Button
                variant="secondary"
                icon={MagicPencilIcon}
                onClick={() => console.log('Try brand voice clicked')}
              >
                Try your brand voice in a design
              </Button>
            </Box>
          </Rows>
        </Box>
      </Box>
    </Rows>
  );
}
