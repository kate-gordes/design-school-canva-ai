import React, { useMemo } from 'react';
import { TreeMenu, TreeMenuItem, Spacer, Box, Text } from '@canva/easel';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandKitSelector from '@/pages/Home/Brand/components/BrandKitSelector';
import { useAppContext } from '@/hooks/useAppContext';
import { categoryNameToViewId, getCategoriesBySection } from '@/pages/Home/Brand/data';
import Divider from '@/shared_components/Divider';
import styles from './ContextualNav.module.css';

export default function BrandContextualNav(): React.ReactNode {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get('view') || 'all-assets';

  const { brandKitData } = useAppContext();

  const handleItemClick = (view: string) => {
    navigate(`/brand?view=${view}`);
  };

  // Dynamically build menu items from brand kit data
  const { guidelinesItems, coreBrandItems, internalBrandItems, otherItems } = useMemo(() => {
    if (!brandKitData) {
      return { guidelinesItems: [], coreBrandItems: [], internalBrandItems: [], otherItems: [] };
    }

    // Filter out excluded categories
    const isExcluded = (categoryName: string) => categoryName === 'Canva AI';

    const guidelines = getCategoriesBySection(brandKitData, 'Guidelines')
      .filter(cat => !isExcluded(cat.categoryName))
      .map(cat => ({
        id: categoryNameToViewId(cat.categoryName),
        title: cat.categoryName,
        view: categoryNameToViewId(cat.categoryName),
        assetCount: cat.assetCount,
      }));

    const coreBrand = getCategoriesBySection(brandKitData, 'Core Brand')
      .filter(cat => !isExcluded(cat.categoryName))
      .map(cat => ({
        id: categoryNameToViewId(cat.categoryName),
        title: cat.categoryName,
        view: categoryNameToViewId(cat.categoryName),
        assetCount: cat.assetCount,
      }));

    const internalBrand = getCategoriesBySection(brandKitData, 'Internal Brand')
      .filter(cat => !isExcluded(cat.categoryName))
      .map(cat => ({
        id: categoryNameToViewId(cat.categoryName),
        title: cat.categoryName,
        view: categoryNameToViewId(cat.categoryName),
        assetCount: cat.assetCount,
      }));

    const other = getCategoriesBySection(brandKitData, 'Other')
      .filter(cat => !isExcluded(cat.categoryName))
      .map(cat => ({
        id: categoryNameToViewId(cat.categoryName),
        title: cat.categoryName,
        view: categoryNameToViewId(cat.categoryName),
        assetCount: cat.assetCount,
      }));

    return {
      guidelinesItems: guidelines,
      coreBrandItems: coreBrand,
      internalBrandItems: internalBrand,
      otherItems: other,
    };
  }, [brandKitData]);

  return (
    <>
      {/* All Brand Templates at the top */}
      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        <TreeMenuItem
          label="All Brand Templates"
          selected={currentView === 'brand-templates'}
          onClick={() => handleItemClick('brand-templates')}
        />
      </TreeMenu>

      <Spacer size="1u" />
      <Divider />
      <Spacer size="2u" />

      <BrandKitSelector showLabel={false} />

      <Spacer size="1u" />

      {/* Guidelines Section - dynamically built from brand kit data */}
      {guidelinesItems.length > 0 && (
        <TreeMenu
          role="list"
          className={styles.itemsList}
          itemCustomToggleWidth="1u"
          indentation="0"
        >
          {guidelinesItems.map(item => (
            <TreeMenuItem
              key={item.id}
              label={item.title}
              selected={currentView === item.view}
              onClick={() => handleItemClick(item.view)}
            />
          ))}
        </TreeMenu>
      )}

      {/* Core Brand Section - dynamically built from brand kit data */}
      {coreBrandItems.length > 0 && (
        <>
          <Spacer size="2u" />
          <Box paddingY="2u" className={styles.sectionTitleWrapper}>
            <Text weight="bold">Core Brand</Text>
          </Box>

          <TreeMenu
            role="list"
            className={styles.itemsList}
            itemCustomToggleWidth="1u"
            indentation="0"
          >
            {coreBrandItems.map(item => (
              <TreeMenuItem
                key={item.id}
                label={item.title}
                selected={currentView === item.view}
                onClick={() => handleItemClick(item.view)}
              />
            ))}
          </TreeMenu>
        </>
      )}

      {/* Other Section - dynamically built from brand kit data (Photos, Graphics, Icons, etc.) */}
      {otherItems.length > 0 && (
        <TreeMenu
          role="list"
          className={styles.itemsList}
          itemCustomToggleWidth="1u"
          indentation="0"
        >
          {otherItems.map(item => (
            <TreeMenuItem
              key={item.id}
              label={item.title}
              selected={currentView === item.view}
              onClick={() => handleItemClick(item.view)}
            />
          ))}
        </TreeMenu>
      )}

      {/* Internal Brand Section - dynamically built from brand kit data */}
      {internalBrandItems.length > 0 && (
        <>
          <Spacer size="2u" />
          <Box paddingY="2u" className={styles.sectionTitleWrapper}>
            <Text weight="bold">Internal Brand</Text>
          </Box>

          <TreeMenu
            role="list"
            className={styles.itemsList}
            itemCustomToggleWidth="1u"
            indentation="0"
          >
            {internalBrandItems.map(item => (
              <TreeMenuItem
                key={item.id}
                label={item.title}
                selected={currentView === item.view}
                onClick={() => handleItemClick(item.view)}
              />
            ))}
          </TreeMenu>
        </>
      )}
    </>
  );
}
