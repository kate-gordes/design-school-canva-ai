/**
 * TypeScript type definitions for Canva Brand Kit Scraper output
 *
 * Use these types in your project for type-safe access to scraped data
 */

export interface ScraperOutput {
  metadata: Metadata;
  summary: Summary;
  brandKits: BrandKit[];
}

export interface Metadata {
  /** ISO 8601 timestamp when scrape completed */
  scrapedAt: string;

  /** Human-readable execution time (e.g., "45m 20s") */
  executionTime: string;

  /** Total number of brand kits scraped */
  totalBrandKits: number;

  /** Total categories across all brand kits */
  totalCategories: number;

  /** Total assets (images) found across all brand kits */
  totalAssets: number;
}

export interface Summary {
  /** Number of brand kits successfully scraped */
  brandKitsScraped: number;

  /** Name of brand kit with most assets (e.g., "Canva Brand Kit (500 assets)") */
  largestBrandKit: string;

  /** Average number of assets per brand kit */
  averageAssetsPerBrandKit: number;
}

export interface BrandKit {
  /** Name of the brand kit */
  brandKitName: string;

  /** Total assets in this brand kit */
  totalAssets: number;

  /** Total categories in this brand kit */
  totalCategories: number;

  /** Number of categories that have assets */
  categoriesWithAssets: number;

  /** Number of categories with no assets */
  categoriesEmpty: number;

  /** Category with most assets (e.g., "Photography (150 assets)") */
  largestCategory: string;

  /** Array of categories with their assets */
  categories: Category[];

  /** Error message if scrape failed, null if successful */
  error: string | null;
}

export interface Category {
  /** Section name (e.g., "Core Brand", "Guidelines", "Internal Brand") */
  section: string;

  /** Category name (e.g., "Logos", "Photography", "Colors") */
  categoryName: string;

  /** Order index (1-based) */
  categoryIndex: number;

  /** Number of assets in this category */
  assetCount: number;

  /** Number of folders in this category */
  folderCount: number;

  /** Path to screenshot (relative to output/) */
  screenshotPath?: string;

  /** Array of folder objects */
  folders: Folder[];

  /** Array of asset objects */
  assets: Asset[];
}

export interface Folder {
  /** Unique identifier for this folder */
  id: string;

  /** Folder name */
  name: string;

  /** Number of items inside this folder */
  itemCount: number;

  /** Whether folder icon was detected */
  hasFolderIcon: boolean;

  /** Preview image URL (if available) */
  thumbnailUrl: string;
}

export interface Asset {
  /** Unique identifier for this asset */
  id: string;

  /** Extracted filename */
  filename: string;

  /** Asset type (usually "Image") */
  type: string;

  /** Asset title/alt text */
  title: string;

  /** URL to thumbnail version (may expire) */
  thumbnailUrl: string;

  /** URL to full-size version (may expire) */
  fullSizeUrl: string;

  /** When uploaded (e.g., "26 days ago") */
  uploadedDate: string;

  /** Image dimensions */
  dimensions: Dimensions;

  /** Additional metadata */
  metadata: AssetMetadata;
}

export interface Dimensions {
  /** Width in pixels */
  width: number;

  /** Height in pixels */
  height: number;
}

export interface AssetMetadata {
  /** Alternative text for accessibility */
  altText: string;

  /** Position in the list (0-based) */
  position: number;
}

// ============================================================================
// Helper Types
// ============================================================================

/** Extract all assets from output */
export type AllAssets = Asset[];

/** Brand kit lookup by name */
export type BrandKitMap = Record<string, BrandKit>;

/** Category lookup by name */
export type CategoryMap = Record<string, Category>;

// Aliases for convenience
export type BrandKitAsset = Asset;
export type BrandKitCategory = Category;

// ============================================================================
// Usage Examples
// ============================================================================

/*
Example 1: Load and type the JSON data
----------------------------------------
import * as fs from 'fs';
import { ScraperOutput } from './types';

const data: ScraperOutput = JSON.parse(
  fs.readFileSync('./output/all-brand-kits.json', 'utf8')
);

console.log(data.metadata.totalAssets); // Type-safe access


Example 2: Filter assets by brand kit
--------------------------------------
function getAssetsByBrandKit(data: ScraperOutput, brandKitName: string): Asset[] {
  const brandKit = data.brandKits.find(bk => bk.brandKitName === brandKitName);
  if (!brandKit) return [];
  
  return brandKit.categories.flatMap(cat => cat.assets);
}


Example 3: Get all image URLs
------------------------------
function getAllImageUrls(data: ScraperOutput): string[] {
  return data.brandKits
    .flatMap(bk => bk.categories)
    .flatMap(cat => cat.assets)
    .map(asset => asset.fullSizeUrl);
}


Example 4: Find assets by category across all brand kits
---------------------------------------------------------
function getAssetsByCategory(data: ScraperOutput, categoryName: string): Asset[] {
  return data.brandKits
    .flatMap(bk => bk.categories)
    .filter(cat => cat.categoryName === categoryName)
    .flatMap(cat => cat.assets);
}


Example 5: Create brand kit statistics
---------------------------------------
interface BrandKitStats {
  name: string;
  totalAssets: number;
  totalCategories: number;
  assetsPerCategory: number;
}

function getBrandKitStats(data: ScraperOutput): BrandKitStats[] {
  return data.brandKits.map(bk => ({
    name: bk.brandKitName,
    totalAssets: bk.totalAssets,
    totalCategories: bk.totalCategories,
    assetsPerCategory: Math.round(bk.totalAssets / bk.totalCategories)
  }));
}


Example 6: Download images with proper typing
----------------------------------------------
import https from 'https';
import fs from 'fs';
import path from 'path';

async function downloadAsset(asset: Asset, outputDir: string): Promise<void> {
  const filename = path.join(outputDir, asset.filename);
  
  return new Promise((resolve, reject) => {
    https.get(asset.fullSizeUrl, (response) => {
      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

*/
