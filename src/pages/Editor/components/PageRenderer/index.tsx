import React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { activeDocType } from '@/store/signals/canvasState';
import PresentationPage from './renderers/PresentationPage';
import DocPage from './renderers/DocPage';
import WebsitePage from './renderers/WebsitePage';

interface PageRendererProps {
  viewMode: 'thumbnails' | 'continuous';
  currentPage: number;
  totalPages: number;
  zoomPercent: number;
  onZoomChange: (p: number) => void;
  onFit: () => void;
  onFill: () => void;
  onPageChange: (p: number) => void;
  onAddPage: () => void;
  canvasScrollRef?: React.RefObject<HTMLDivElement>;
  onDuplicatePage?: (page: number) => void;
  onDeletePage?: (page: number) => void;
  onToggleViewMode: () => void;
  isGridMode?: boolean;
  onToggleGrid?: () => void;
}

export default function PageRenderer(props: PageRendererProps): React.ReactNode {
  useSignals();

  const docType = activeDocType.value;

  switch (docType) {
    case 'doc':
      return <DocPage {...props} />;
    case 'website':
      return <WebsitePage {...props} />;
    case 'fixed-design':
    case 'presentation':
    default:
      return <PresentationPage {...props} />;
  }
}
