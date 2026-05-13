import { Box, Button, Columns, Column, Text } from '@canva/easel';
import { Menu, MenuItem } from '@canva/easel/menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Heading.module.css';

import CanvaLogo from './assets/logo-canva.svg';

interface HeadingProps {
  onSignUp?: () => void;
  onLogIn?: () => void;
}

interface NavItem {
  label: string;
  id: string;
}

export default function Heading({ onSignUp, onLogIn }: HeadingProps): React.ReactNode {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { label: 'Design', id: 'design' },
    { label: 'Product', id: 'product' },
    { label: 'Plans', id: 'plans' },
    { label: 'Business', id: 'business' },
    { label: 'Education', id: 'education' },
    { label: 'Help', id: 'help' },
  ];

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigate('/');
    }
  };

  const handleLogIn = () => {
    if (onLogIn) {
      onLogIn();
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      className={styles.header}
      paddingX="4u"
      paddingY="2u"
      background="surface"
      borderBottom="standard"
    >
      <Columns spacing="4u" alignY="center">
        {/* Logo */}
        <Column width="content">
          {/* Plain <button>: Easel Button variants all ship background/border/padding
              that conflict with this bare logo button (background:none, padding:0). */}
          <button
            className={styles.logo}
            onClick={() => navigate('/signed-out-experience')}
            type="button"
          >
            <img src={CanvaLogo} alt="Canva Logo" className={styles.logoImage} />
          </button>
        </Column>

        {/* Navigation */}
        <Column>
          <Box className={styles.scrollable} tagName="nav" paddingX="3u">
            <Menu
              direction="horizontal"
              variant="rounded"
              spacing="0.5u"
              role="list"
              className={styles.menu}
            >
              {navItems.map(item => (
                <MenuItem
                  key={item.id}
                  className={styles.menuButton}
                  selected={selectedMenu === item.id}
                  onClick={() => setSelectedMenu(item.id)}
                >
                  <Text tagName="span">{item.label}</Text>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Column>

        {/* Actions */}
        <Column width="content">
          <Box className={styles.actions}>
            <Button variant="tertiary" onClick={handleSignUp}>
              Sign up
            </Button>
            <Button variant="primary" onClick={handleLogIn}>
              Log in
            </Button>
          </Box>
        </Column>
      </Columns>
    </Box>
  );
}
