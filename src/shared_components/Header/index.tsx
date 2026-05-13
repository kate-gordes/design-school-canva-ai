import { Columns, Column, Box } from '@canva/easel';
import HeaderDivider from './HeaderDivider';
import HamburgerButton from './HamburgerButton';
import { HouseIcon } from '@canva/easel/icons';
import { FileMenu } from './FileMenu';
import { ViewMenu } from './ViewMenu';
import { ResizeMenu } from './ResizeMenu';
import { SaveStatusMenu } from './SaveStatusMenu';
import { PresentMenu } from './PresentMenu';
import { CommentMenu } from './CommentMenu';
import { HeaderAvatar } from './HeaderAvatar';
import { ShareMenu } from './ShareMenu';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header(): React.ReactNode {
  const { state } = useAppContext();
  const navigate = useNavigate();

  return (
    <Box
      position="sticky"
      top="0"
      width="full"
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      className={`${styles.header} ${state.sidebarVisible ? styles.withNavOffset : ''}`}
    >
      {/* Left side items */}
      <Box>
        <Columns spacing="1u" alignY="center">
          <Column width="content"></Column>
          <Column width="content">
            <HamburgerButton
              icon={<HouseIcon size="medium" />}
              onClick={() => navigate('/')}
              ariaLabel="Home"
            />
          </Column>
          <Column width="content"></Column>

          <Column width="content">
            <Box className={styles.fileMenuWrap}>
              <FileMenu />
            </Box>
          </Column>

          <Column width="content">
            <Box className={styles.viewMenuWrap}>
              <ViewMenu />
            </Box>
          </Column>

          <Column width="content">
            <Box className={styles.resizeMenuWrap}>
              <ResizeMenu />
            </Box>
          </Column>

          <Column width="content">
            <Box className={styles.headerDividerWrap}>
              <HeaderDivider />
            </Box>
          </Column>

          <Column width="content">
            <SaveStatusMenu />
          </Column>
        </Columns>
      </Box>

      {/* Right side menus */}
      <Box>
        <Columns spacing="1u" align="center">
          <Column width="content">
            <HeaderAvatar />
          </Column>

          <Column width="content">
            <CommentMenu />
          </Column>

          <Column width="content">
            <PresentMenu />
          </Column>

          <Column width="content">
            <Box className={styles.shareMenuWrap}>
              <ShareMenu />
            </Box>
          </Column>
        </Columns>
      </Box>
    </Box>
  );
}
