import { DesignCard, type ProjectDesign } from '@/pages/home/components/CardThumbnails';
import { getBrandKitImageUrl, type BrandKitAsset } from '@/pages/home/Brand/data';

export function brandKitAssetsToDesigns(assets: BrandKitAsset[]): ProjectDesign[] {
  return assets.map(asset => ({
    id: asset.id,
    title: asset.title || asset.filename,
    doctype: 'Document',
    private: false,
    lastModified: asset.uploadedDate || 'Recently added',
    thumbnailUrl: getBrandKitImageUrl(asset.thumbnailUrl),
  }));
}
