import React from 'react';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import {
  GridViewIcon,
  ResizePanelsIcon,
  MaximizeIcon,
  EyeIcon,
  PencilIcon,
  MessageRoundIcon,
  CheckCircleIcon,
} from '@canva/easel/icons';
import ViewButton from '@/shared_components/Header/ViewButton';

export const ViewMenu: React.FC = () => {
  const [activeMode, setActiveMode] = React.useState<'editing' | 'commenting' | 'viewing'>(
    'editing',
  );

  const handleMenuItemClick = (action: string) => {
    console.log(`View menu action: ${action}`);
  };

  return (
    <FlyoutMenu
      trigger={props => (
        <ViewButton
          pressed={props.pressed}
          ariaControls={props.ariaControls}
          ariaHasPopup={props.ariaHasPopup}
          onClick={props.onClick}
        />
      )}
    >
      <FlyoutMenuItem
        onClick={() => {
          setActiveMode('editing');
          handleMenuItemClick('editing');
        }}
        start={<PencilIcon size="medium" />}
        end={
          activeMode === 'editing' ? <CheckCircleIcon size="small" tone="secondary" /> : undefined
        }
      >
        Editing
      </FlyoutMenuItem>

      <FlyoutMenuItem
        onClick={() => {
          setActiveMode('commenting');
          handleMenuItemClick('commenting');
        }}
        start={<MessageRoundIcon size="medium" />}
        end={
          activeMode === 'commenting' ? (
            <CheckCircleIcon size="small" tone="secondary" />
          ) : undefined
        }
      >
        Commenting
      </FlyoutMenuItem>

      <FlyoutMenuItem
        onClick={() => {
          setActiveMode('viewing');
          handleMenuItemClick('viewing');
        }}
        start={<EyeIcon size="medium" />}
        end={
          activeMode === 'viewing' ? <CheckCircleIcon size="small" tone="secondary" /> : undefined
        }
      >
        Viewing
      </FlyoutMenuItem>

      <FlyoutMenuDivider />

      <FlyoutMenuItem
        onClick={() => handleMenuItemClick('show-rulers')}
        start={<ResizePanelsIcon size="medium" />}
      >
        Show rulers and guides
      </FlyoutMenuItem>

      <FlyoutMenuItem
        onClick={() => handleMenuItemClick('show-grid')}
        start={<GridViewIcon size="medium" />}
      >
        Show grid
      </FlyoutMenuItem>

      <FlyoutMenuItem
        onClick={() => handleMenuItemClick('fullscreen')}
        start={<MaximizeIcon size="medium" />}
      >
        Full screen
      </FlyoutMenuItem>
    </FlyoutMenu>
  );
};
