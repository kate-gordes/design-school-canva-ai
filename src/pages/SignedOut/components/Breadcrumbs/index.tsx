import { Box, Text } from '@canva/easel';
import { ChevronRightIcon } from '@canva/easel/icons';
import { LinkButton } from '@canva/easel/link';
import { useNavigate } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps): React.ReactNode {
  const navigate = useNavigate();

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <Box tagName="nav" className={styles.breadcrumbNav} aria-label="Breadcrumb">
      <Box tagName="ol" className={styles.breadcrumb}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          const showSeparator = !isCurrent;

          return (
            <Box
              key={item.label}
              tagName="li"
              className={styles.item}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {isCurrent ? (
                <Text tagName="span" size="medium" tone="secondary">
                  {item.label}
                </Text>
              ) : (
                <LinkButton
                  variant="unstyled"
                  onClick={() => handleClick(item)}
                  className={styles.link}
                >
                  <Text tagName="span" size="medium" tone="primary">
                    {item.label}
                  </Text>
                </LinkButton>
              )}
              {showSeparator && <ChevronRightIcon className={styles.separator} size="medium" />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
