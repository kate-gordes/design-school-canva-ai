import React, { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import {
  AspectRatio,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  CardCheckbox,
  CardDescription,
  CardImageThumbnail,
  CardThumbnailContainer,
  CardTitle,
  Column,
  Columns,
  Divider,
  ImageIcon,
  Placeholder,
  Rows,
  Text,
  ToolkitVideoFilledIcon,
  CardPlaceholder,
} from '@canva/easel';
import { Card, CardDecorator } from '@canva/easel/card';
import { Sheet } from '@canva/easel/surface/sheet';
import { Menu, MenuItem } from '@canva/easel/menu';
import {
  DownloadIcon,
  InfoIcon,
  MoreHorizontalIcon,
  ClockRotateLeftIcon,
  StarIcon,
  ToolkitDocumentFilledIcon,
  ToolkitDesignFilledIcon,
  ToolkitEmailFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitSheetFilledIcon,
  ToolkitWebsiteFilledIcon,
  ToolkitWhiteboardFilledIcon,
  PagesIcon,
  CanvaLetterLogoFilledColorIcon,
  VideoCameraIcon,
  XIcon,
} from '@canva/easel/icons';
import { Play } from 'lucide-react';
import styles from './CardThumbnails.module.css';

// Project data interface
export interface ProjectDesign {
  id: string;
  title: string;
  doctype: string;
  private?: boolean;
  lastModified: string;
  thumbnailUrl?: string;
  containedDoctypes?: string[];
  owner?: string;
  starred?: boolean;
}

// Brand Kit data interface
export interface BrandKitDesign {
  id: string;
  title: string;
  subtitle?: string;
  colors: string[];
  logoUrl?: string;
}

// Featured App data interface

export interface FeaturedAppDesign {
  id: string;
  title: string;
  subtitle?: string;
  colors: string[];
  logoUrl?: string;
}

// Featured App Card component props interface
export interface FeaturedAppCardProps {
  featuredApp: FeaturedAppDesign;
  showColorBar?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
}

// DesignCard component props interface
export interface DesignCardProps {
  design: ProjectDesign;
  showBadge?: boolean;
  badgeText?: string;
  collaborators?: Array<{ backgroundColor: string; name: string }>;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onStar?: () => void;
  onMenuClick?: () => void;
  imageUrl?: string;
  onClick?: () => void;
  variant?: 'image' | 'icon';
  hideActions?: boolean;
  thumbnailOnly?: boolean;
  /** Show design.doctype as the description instead of "Edited X ago" */
  showDoctype?: boolean;
  /** Hide the icon/avatar column to the left of the description */
  hideIcon?: boolean;
  /** Remove background box and shadow from thumbnail (for brand assets like logos/emojis) */
  borderlessThumbnail?: boolean;
}

// BrandKitCard component props interface
export interface BrandKitCardProps {
  brandKit: BrandKitDesign;
  showColorBar?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
}

// Helper function to get icon and CSS class based on doctype
const getDocumentIconInfo = (doctype: string) => {
  const type = doctype.toLowerCase();

  if (type.includes('presentation')) {
    return { Icon: ToolkitPresentationFilledIcon, cssClass: styles.presentationIcon };
  }

  // Check for multi-design before design (since 'multi-design' contains 'design')
  if (type.includes('multi-design') || type.includes('multi design')) {
    return { Icon: PagesIcon, cssClass: styles.multiDesignIcon };
  }

  // Design (single design, social media, graphics, etc.)
  if (type.includes('design')) {
    return { Icon: ToolkitDesignFilledIcon, cssClass: styles.designIcon };
  }

  if (type.includes('doc')) {
    return { Icon: ToolkitDocumentFilledIcon, cssClass: styles.docIcon };
  }

  if (type.includes('whiteboard')) {
    return { Icon: ToolkitWhiteboardFilledIcon, cssClass: styles.whiteboardIcon };
  }

  if (type.includes('website')) {
    return { Icon: ToolkitWebsiteFilledIcon, cssClass: styles.websiteIcon };
  }

  if (type.includes('sheet')) {
    return { Icon: ToolkitSheetFilledIcon, cssClass: styles.sheetIcon };
  }

  if (type.includes('video')) {
    return { Icon: ToolkitVideoFilledIcon, cssClass: styles.videoIcon };
  }
  if (type.includes('image')) {
    return { Icon: ImageIcon, cssClass: styles.imageIcon };
  }
  if (type.includes('email')) {
    return { Icon: ToolkitEmailFilledIcon, cssClass: styles.emailIcon };
  }

  // Default to document if unknown type
  return { Icon: ToolkitDocumentFilledIcon, cssClass: styles.docIcon };
};

// Helper function to generate random "Edited x time ago" text
const getRandomEditedTime = (): string => {
  const options = [
    'Edited 1 hour ago',
    'Edited 2 hours ago',
    'Edited 5 hours ago',
    'Edited 1 day ago',
    'Edited 2 days ago',
    'Edited 3 days ago',
    'Edited 5 days ago',
    'Edited 1 week ago',
    'Edited 2 weeks ago',
    'Edited 3 weeks ago',
    'Edited 1 month ago',
  ];
  return options[Math.floor(Math.random() * options.length)];
};

/**
 * DesignCard component for displaying design thumbnails
 *
 * Used to show a design as a thumbnail either in a grid or carousel.
 *
 * Features:
 * - Responsive aspect ratio (4/5 on mobile, 4/4 on desktop)
 * - Interactive elements (star, menu, selection)
 * - Avatar group for collaborators OR single user avatar
 * - Image thumbnail OR document type icon
 * - Hover effects and swap animations
 * - Custom thumbnail support
 * - Comprehensive prop defaults
 */
export const DesignCard: React.FC<DesignCardProps> = ({
  design,
  showBadge = true,
  badgeText = '1 of 10',
  collaborators = [
    { backgroundColor: '#F55353', name: 'Jane doe' },
    { backgroundColor: '#FEB139', name: 'Jason Bull' },
  ],
  isSelected = false,
  onSelect = () => {},
  onStar = () => console.log('Star clicked for', design.title),
  onMenuClick = () => console.log('Menu clicked for', design.title),
  imageUrl,
  onClick,
  variant = 'image',
  hideActions = false,
  thumbnailOnly = false,
  showDoctype = false,
  hideIcon = false,
  borderlessThumbnail = false,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Default onClick handler - navigate to editor on desktop, no-op on mobile brand pages
  const handleClick = onClick || (isMobile ? undefined : () => navigate('/editor'));

  // On mobile, open action sheet instead of calling onMenuClick
  const handleMenuClick = isMobile ? () => setShowActionSheet(true) : onMenuClick;

  // Get the appropriate icon and CSS class for this doctype
  const { Icon: DocIcon, cssClass } = getDocumentIconInfo(design.doctype);

  // For multi-design, check if we have contained doctypes
  const isMultiDesign = design.doctype.toLowerCase().includes('multi');
  const containedDoctypes = design.containedDoctypes || [];

  // Use design's thumbnailUrl if available, otherwise fall back to imageUrl prop
  const thumbnailSrc = design.thumbnailUrl || imageUrl;

  return (
    <Box className={styles.cardWrapper}>
      <Card
        content={
          thumbnailOnly
            ? isMobile
              ? () => null
              : undefined
            : ({ titleId, descriptionId }) => (
                <Rows spacing="1u">
                  <CardTitle id={titleId}>
                    <span className={styles.singleLineTitle}>{design.title}</span>
                  </CardTitle>
                  {hideIcon ? (
                    <Text size="small" tone="tertiary">
                      {showDoctype ? design.doctype : getRandomEditedTime()}
                    </Text>
                  ) : (
                    <Columns spacing="1u" align="center">
                      <Column width="content">
                        {variant === 'icon' ? (
                          <div className={`${styles.iconContainer} ${cssClass}`}>
                            <DocIcon />
                          </div>
                        ) : isMultiDesign && containedDoctypes.length > 0 ? (
                          <div className={styles.multiIconGroup}>
                            {containedDoctypes.map((dtype, idx) => {
                              const { Icon: DtypeIcon, cssClass: dtypeCssClass } =
                                getDocumentIconInfo(dtype);
                              return (
                                <div
                                  key={idx}
                                  className={`${styles.iconContainer} ${dtypeCssClass} ${styles.multiIcon}`}
                                  style={
                                    {
                                      '--multi-icon-z': containedDoctypes.length - idx,
                                    } as React.CSSProperties
                                  }
                                >
                                  <DtypeIcon />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <AvatarGroup size="xxsmall" overflowCount={2} avatars={collaborators} />
                        )}
                      </Column>
                      <Column>
                        <CardDescription id={descriptionId}>
                          {showDoctype ? design.doctype : getRandomEditedTime()}
                        </CardDescription>
                      </Column>
                    </Columns>
                  )}
                </Rows>
              )
        }
        layout="vertical"
        hoverBoundary="thumbnail"
        hoverEffect="scaleThumbnail"
        stretchThumbnail={true}
        selectableMode={thumbnailOnly || hideActions ? undefined : 'secondary'}
        thumbnail={
          <CardThumbnailContainer aspectRatio={4 / 3} padding="none">
            <Box
              width="full"
              height="full"
              background={borderlessThumbnail ? undefined : 'subtle'}
              padding={borderlessThumbnail ? '0' : '2u'}
            >
              <div className={styles.designThumbnailContainer}>
                {thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    alt={design.title}
                    className={
                      borderlessThumbnail
                        ? styles.borderlessThumbnailImage
                        : styles.designThumbnailImage
                    }
                  />
                ) : (
                  <Box
                    width="full"
                    height="full"
                    background="neutralSubtle"
                    borderRadius="standard"
                  />
                )}
              </div>
            </Box>
          </CardThumbnailContainer>
        }
        decorators={
          (thumbnailOnly && !isMobile) || (hideActions && !isMobile) ? undefined : (
            <>
              {/* Page count badge */}
              {showBadge && !hideActions && (
                <CardDecorator location="bottom-start">
                  <Badge tone="contrast" text={badgeText} />
                </CardDecorator>
              )}

              {/* Action buttons - always visible on mobile, hover on desktop */}
              {(!hideActions || isMobile) && (
                <CardDecorator
                  location="top-end"
                  visibility={isMobile ? 'always' : 'on-hover'}
                  isInteractive={true}
                >
                  {isMobile ? (
                    /* Plain <div>: Easel Box resets background/box-shadow via reset_f88b8e,
                       wiping the white fill and elevation ring used here. */
                    <div className={styles.mobileActionButton} onClick={handleMenuClick}>
                      <MoreHorizontalIcon size="medium" />
                    </div>
                  ) : (
                    <Box
                      shadow="surface"
                      background="surface"
                      borderRadius="element"
                      padding="0.5u"
                      display="flex"
                    >
                      {!hideActions && (
                        <Button icon={StarIcon} variant="tertiary" size="small" onClick={onStar} />
                      )}
                      <Button
                        icon={MoreHorizontalIcon}
                        variant="tertiary"
                        size="small"
                        onClick={handleMenuClick}
                      />
                    </Box>
                  )}
                </CardDecorator>
              )}

              {/* Checkbox on hover - hidden on mobile */}
              {!isMobile && !hideActions && (
                <CardDecorator location="top-start" visibility="on-hover" isInteractive={true}>
                  <CardCheckbox
                    label="Select design"
                    selected={isSelected}
                    onSelect={() => onSelect(!isSelected)}
                  />
                </CardDecorator>
              )}
            </>
          )
        }
        onClick={handleClick}
      />

      {/* Mobile Card Action Sheet */}
      {isMobile && (
        <Sheet open={showActionSheet} onRequestClose={() => setShowActionSheet(false)} size="small">
          <Box padding="2u">
            {/* Header: Title + Close */}
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="spaceBetween"
              paddingBottom="1u"
            >
              <Box className={styles.flexGrow}>
                <Text size="medium" weight="bold">
                  {design.title}
                </Text>
                <Text size="small" tone="tertiary">
                  Uploaded by {design.owner || 'Team'}{' '}
                  {design.lastModified ? design.lastModified : ''}
                </Text>
              </Box>
              <Button
                icon={XIcon}
                variant="tertiary"
                size="small"
                onClick={() => setShowActionSheet(false)}
                aria-label="Close"
              />
            </Box>

            <Box paddingY="1u">
              <Divider />
            </Box>

            {/* Action Items */}
            <Menu>
              <MenuItem
                start={<InfoIcon size="medium" />}
                onClick={() => {
                  setShowActionSheet(false);
                  console.log('Details:', design.title);
                }}
              >
                <Text size="medium">Details</Text>
              </MenuItem>
              <MenuItem
                start={<ClockRotateLeftIcon size="medium" />}
                onClick={() => {
                  setShowActionSheet(false);
                  console.log('Replace across designs:', design.title);
                }}
              >
                <Text size="medium">Replace across designs</Text>
              </MenuItem>
              <MenuItem
                start={<DownloadIcon size="medium" />}
                onClick={() => {
                  setShowActionSheet(false);
                  console.log('Download:', design.title);
                }}
              >
                <Text size="medium">Download</Text>
              </MenuItem>
            </Menu>
          </Box>
        </Sheet>
      )}
    </Box>
  );
};

/**
 * BrandKitCard component for displaying brand kit cards
 *
 * Features:
 * - Brand name and subtitle display
 * - Color palette preview bar
 * - Logo/brand visual
 * - Menu action button
 * - Click handling
 */
export const BrandKitCard: React.FC<BrandKitCardProps> = ({
  brandKit,
  showColorBar = true,
  onClick = () => console.log('Brand kit clicked:', brandKit.title),
  onMenuClick = () => console.log('Brand kit menu clicked:', brandKit.title),
}) => {
  const isMobile = useIsMobile();

  return (
    <Card
      content={({ titleId }) => (
        <Columns spacing="1u" align="center">
          <Column>
            <CardTitle id={titleId}>{brandKit.title}</CardTitle>
          </Column>
          <Column width="content">
            <CanvaLetterLogoFilledColorIcon size="small" />
          </Column>
        </Columns>
      )}
      thumbnail={
        <CardThumbnailContainer aspectRatio={1.666} padding="none" border="none">
          <Box position="relative" width="full" height="full">
            <CardImageThumbnail
              src={
                brandKit.logoUrl
                || 'https://media.canva.com/v2/image-resize/format:PNG/height:176/quality:100/uri:ifs%3A%2F%2FM%2F3ae4b9de-f130-496f-b3b4-2b5be62db1b8/watermark:F/width:550?csig=AAAAAAAAAAAAAAAAAAAAAKyhNpdcu9H8zGKSS5YC3R-waYarPU6KMsiMd07v0xjx&exp=1756205283&osig=AAAAAAAAAAAAAAAAAAAAABMsEWN-cDUa00FEmBtMYypPbaTFquTLRWaXGtuREYsH&signer=media-rpc&x-canva-quality=thumbnail_large'
              }
              alt={`${brandKit.title} brand kit`}
            />
            {showColorBar && (
              <div className={styles.colorBar}>
                {brandKit.colors.map((color, index) => (
                  /* Plain <div>: Easel Box resets background via reset_f88b8e, wiping
                     the dynamic per-swatch background color injected via --swatch-bg. */
                  <div
                    key={index}
                    className={styles.colorSwatch}
                    style={{ '--swatch-bg': color } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </Box>
        </CardThumbnailContainer>
      }
      layout="vertical"
      padding="1u"
      hoverBoundary="card"
      onClick={onClick}
    />
  );
};

/**
 * FeaturedAppCard component for displaying Featured App cards
 *
 * Features:
 * - Featured App Description and preview image
 * - Logo/brand visual
 * - Menu action button
 * - Click handling
 */

export const FeaturedAppCard: React.FC<FeaturedAppCardProps> = ({
  featuredApp,
  onClick = () => console.log('Featured app clicked:', featuredApp.title),
  onMenuClick = () => console.log('Featured app menu clicked:', featuredApp.title),
}) => {
  const isMobile = useIsMobile();

  return (
    <Card
      content={({ titleId, descriptionId }) => (
        <Box paddingX="2u">
          <Columns spacing="1u">
            <Avatar name="Chris Partlow" shape="square" />
            <Box paddingStart="1u">
              <CardTitle id={titleId}>Example custom content</CardTitle>
              <CardDescription id={descriptionId}>Description</CardDescription>
            </Box>
          </Columns>
        </Box>
      )}
      layout="vertical"
      hoverBoundary="card"
      stretchThumbnail={true}
      border="low"
      thumbnail={<CardPlaceholder aspectRatio={4 / 3} />}
      hoverEffect="bgColorTransition"
    />
  );
};

export interface AppCardProps {
  app: {
    title: string;
    description: string;
    thumbnail: string;
  };
  onClick?: () => void;
  onMenuClick?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onClick = () => console.log('App clicked:', app.title),
  onMenuClick = () => console.log('App menu clicked:', app.title),
}) => {
  const isMobile = useIsMobile();

  // Check if we have a real image or should use placeholder
  const isPlaceholderImage =
    !app.thumbnail
    || app.thumbnail.includes('via.placeholder.com')
    || app.thumbnail.includes('placeholder')
    || app.thumbnail === '';

  const thumbnailComponent = isPlaceholderImage ? (
    <CardThumbnailContainer height="7u" width="7u" aspectRatio={4 / 4} padding="none">
      <Placeholder shape="square" />
    </CardThumbnailContainer>
  ) : (
    <CardImageThumbnail
      border="none"
      src={app.thumbnail}
      height="7u"
      width="7u"
      aspectRatio={4 / 4}
    />
  );

  return (
    <Card
      title={app.title}
      description={app.description}
      thumbnail={thumbnailComponent}
      layout="horizontal"
      padding="1u"
      hoverEffect="bgColorTransition"
      hoverBoundary="card"
    />
  );
};

// Media data interface for images and videos
export interface MediaData {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  isPrivate?: boolean;
  thumbnailUrl?: string;
  videoUrl?: string; // For videos - URL to play in modal
}

// MediaCard component props interface
export interface MediaCardProps {
  media: MediaData;
  mediaType: 'image' | 'video';
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onStar?: () => void;
  onMenuClick?: () => void;
  onClick?: () => void;
  hideActions?: boolean;
}

/**
 * MediaCard component for displaying image and video thumbnails
 *
 * Different from DesignCard in that:
 * - Thumbnail fills the entire container (full-bleed, cropped if needed)
 * - No drop shadow on the image
 * - Plain icons without colored circle backgrounds
 * - Videos show play button overlay and open in modal when clicked
 *
 * Features:
 * - Full-bleed thumbnail with object-fit: cover
 * - Interactive elements (star, menu, selection)
 * - Type icon (image or video)
 * - Hover effects
 * - Type and size display
 * - Video playback in modal
 */
export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  mediaType,
  isSelected = false,
  onSelect = () => {},
  onStar = () => console.log('Star clicked for', media.name),
  onMenuClick = () => console.log('Menu clicked for', media.name),
  onClick,
  hideActions = false,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Use plain icons for media types (no colored circle wrapper)
  const MediaIcon = mediaType === 'video' ? VideoCameraIcon : ImageIcon;

  const handleClick = () => {
    if (mediaType === 'video') {
      setIsVideoModalOpen(true);
    } else if (onClick) {
      onClick();
    } else {
      navigate('/editor');
    }
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      <Box className={styles.cardWrapper}>
        <Card
          content={({ titleId, descriptionId }) => (
            <Rows spacing="1u">
              <CardTitle id={titleId}>
                <span className={styles.singleLineTitle}>{media.name}</span>
              </CardTitle>
              <Columns spacing="1u" alignY="center">
                <Column width="content">
                  <MediaIcon size="small" />
                </Column>
                <Column>
                  <CardDescription id={descriptionId}>
                    {media.type} • {media.size}
                  </CardDescription>
                </Column>
              </Columns>
            </Rows>
          )}
          layout="vertical"
          hoverBoundary="thumbnail"
          hoverEffect="scaleThumbnail"
          stretchThumbnail={true}
          selectableMode="secondary"
          thumbnail={
            <CardThumbnailContainer aspectRatio={4 / 3} padding="none">
              <Box position="relative" width="full" height="full" background="subtle" padding="2u">
                <div className={styles.designThumbnailContainer}>
                  {media.thumbnailUrl ? (
                    <img
                      src={media.thumbnailUrl}
                      alt={media.name}
                      className={styles.designThumbnailImage}
                    />
                  ) : (
                    <Box
                      width="full"
                      height="full"
                      background="neutralSubtle"
                      borderRadius="standard"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <MediaIcon size="large" />
                    </Box>
                  )}
                </div>
                {/* Play button overlay for videos */}
                {mediaType === 'video' && (
                  <div className={styles.playButtonOverlay}>
                    <div className={styles.playButton}>
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                )}
              </Box>
            </CardThumbnailContainer>
          }
          decorators={
            <>
              {/* Action buttons - always visible on mobile, hover on desktop */}
              {(!hideActions || isMobile) && (
                <CardDecorator
                  location="top-end"
                  visibility={isMobile ? 'always' : 'on-hover'}
                  isInteractive={true}
                >
                  {isMobile ? (
                    /* Plain <div>: Easel Box resets background/box-shadow via reset_f88b8e,
                       wiping the white fill and elevation ring used here. */
                    <div className={styles.mobileActionButton} onClick={onMenuClick}>
                      <MoreHorizontalIcon size="medium" />
                    </div>
                  ) : (
                    <Box
                      shadow="surface"
                      background="surface"
                      borderRadius="element"
                      padding="0.5u"
                      display="flex"
                    >
                      {!hideActions && (
                        <Button icon={StarIcon} variant="tertiary" size="small" onClick={onStar} />
                      )}
                      <Button
                        icon={MoreHorizontalIcon}
                        variant="tertiary"
                        size="small"
                        onClick={onMenuClick}
                      />
                    </Box>
                  )}
                </CardDecorator>
              )}

              {/* Checkbox on hover - hidden on mobile */}
              {!isMobile && !hideActions && (
                <CardDecorator location="top-start" visibility="on-hover" isInteractive={true}>
                  <CardCheckbox
                    label={`Select ${mediaType}`}
                    selected={isSelected}
                    onSelect={() => onSelect(!isSelected)}
                  />
                </CardDecorator>
              )}
            </>
          }
          onClick={handleClick}
        />
      </Box>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className={styles.videoModalOverlay} onClick={handleCloseModal}>
          <div className={styles.videoModalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.videoModalClose} onClick={handleCloseModal}>
              <XIcon size="medium" />
            </button>
            <div className={styles.videoModalTitle}>{media.name}</div>
            <div className={styles.videoContainer}>
              {media.videoUrl ? (
                <video src={media.videoUrl} controls autoPlay className={styles.videoPlayer}>
                  Your browser does not support video playback.
                </video>
              ) : (
                <Box
                  width="full"
                  height="full"
                  background="neutralSubtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VideoCameraIcon size="large" />
                </Box>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DesignCard;
