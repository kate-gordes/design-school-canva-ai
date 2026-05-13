import { Box, Text, Menu, MenuItem } from '@canva/easel';
import { Link, useLocation } from 'react-router-dom';
import styles from './Menu.module.css';

interface MenuItem {
  label: string;
  path: string;
}

interface MenuComponentProps {
  items: MenuItem[];
  title?: string;
}

export default function MenuComponent({ items, title }: MenuComponentProps): React.ReactNode {
  const location = useLocation();

  return (
    <Box padding="2u" display="flex" flexDirection="column" height="full">
      {title && (
        <Box padding="1u">
          <Text size="small" weight="bold">
            {title}
          </Text>
        </Box>
      )}

      <Menu role="menu" variant="rounded">
        {items.map(item => (
          <Link key={item.path} to={item.path} className={styles.menuLink}>
            <MenuItem selected={location.pathname === item.path}>{item.label}</MenuItem>
          </Link>
        ))}
      </Menu>
    </Box>
  );
}
