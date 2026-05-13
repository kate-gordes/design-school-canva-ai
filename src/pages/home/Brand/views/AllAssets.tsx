import { Box, Title, Grid, Spacer } from '@canva/easel';
import { BrandAssetsCard } from '@/pages/home/Brand/components/BrandComponents/BrandAssetsCard';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import {
  getCategoryImage,
  getCategoriesBySection,
  categoryNameToViewId,
} from '@/pages/home/Brand/data';
import { useMemo } from 'react';
import styles from '../Brand.module.css';

export default function AllAssets(): React.ReactNode {
  const navigate = useNavigate();
  const { brandKitData, selectedBrandKit } = useAppContext();

  const handleCardClick = (view: string) => {
    navigate(`/brand?view=${view}`);
  };

  // Dynamically build all category items
  const allItems = useMemo(() => {
    if (!brandKitData) {
      return [];
    }

    // Filter out excluded categories
    const isExcluded = (categoryName: string) => categoryName === 'Canva AI';

    const coreBrandCategories = getCategoriesBySection(brandKitData, 'Core Brand');
    const otherCategories = getCategoriesBySection(brandKitData, 'Other');
    const internalBrandCategories = getCategoriesBySection(brandKitData, 'Internal Brand');

    // Combine all categories and filter out excluded ones
    const allCategories = [
      ...coreBrandCategories,
      ...otherCategories,
      ...internalBrandCategories,
    ].filter(cat => !isExcluded(cat.categoryName));

    return allCategories.map(cat => ({
      id: categoryNameToViewId(cat.categoryName),
      title: cat.categoryName,
      view: categoryNameToViewId(cat.categoryName),
      image: getCategoryImage(brandKitData.brandKitName, cat.categoryName),
    }));
  }, [brandKitData]);

  return (
    <>
      <BrandPageBanner />

      {/* Content section */}
      <Box width="full" paddingTop="12u">
        <div className={styles.contentWrapper}>
          <Title size="medium">Core Brand</Title>
          <Spacer size="2u" />
          <Grid columns={{ default: 2, smallUp: 3, mediumUp: 4, largeUp: 4 }} spacing="3u">
            {allItems.map(item => (
              <BrandAssetsCard
                key={item.id}
                title={item.title}
                image={item.image}
                onClick={() => handleCardClick(item.view)}
              />
            ))}
          </Grid>
        </div>
      </Box>
    </>
  );
}
