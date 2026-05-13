import { Box, Rows, Columns, Column, Text, Menu, MenuItem, MenuDivider } from '@canva/easel';
import { Link } from 'react-router-dom';
import styles from './FooterColumns.module.css';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title?: string;
  links: FooterLink[];
}

const defaultFooterData: FooterColumn[] = [
  {
    links: [
      { label: 'Newsroom', href: '/newsroom' },
      { label: 'Events', href: '/events' },
      { label: 'Careers', href: '/careers', external: true },
      { label: 'Social impact', href: '/social-impact' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Case Studies', href: '/case-studies' },
    ],
  },
  {
    links: [
      { label: 'AI creativity podcast', href: '/podcast', external: true },
      { label: 'Learn blog', href: '/learn' },
      { label: 'Template library', href: '/templates' },
      { label: 'Font pairing', href: '/font-pairing' },
      { label: 'Colour wheel', href: '/colors/color-wheel' },
      { label: 'Colours', href: '/colors' },
      { label: 'Colour palette generator', href: '/colors/palette-generator' },
    ],
  },
  {
    links: [
      { label: 'Signature generator', href: '/signature-generator' },
      { label: 'Business name generator', href: '/business-name-generator' },
      { label: 'PDF converter', href: '/pdf-converter' },
      { label: 'PDF to JPG converter', href: '/pdf-to-jpg' },
      { label: 'JPG to PDF converter', href: '/jpg-to-pdf' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Canva Communities', href: '/communities' },
      { label: 'Creators', href: '/creators' },
      { label: 'Affiliates', href: '/affiliates' },
      { label: 'Canva Represents Fund', href: '/represents-fund' },
      { label: 'Content partners', href: '/content-partners' },
      { label: 'Business partner directory', href: '/partners' },
      { label: 'Canva Developers', href: 'https://developers.canva.com', external: true },
    ],
  },
];

interface FooterColumnsProps {
  /** Custom footer data (optional) */
  footerData?: FooterColumn[];
  /** Number of columns for responsive layout */
  columns?: number;
}

export default function FooterColumns({
  footerData = defaultFooterData,
  columns = 4,
}: FooterColumnsProps): React.ReactNode {
  return (
    <Columns spacing="4u" alignY="start">
      <Menu role="menu">
        <MenuItem onClick={function On() {}}>Item 1</MenuItem>
        <MenuItem onClick={function On() {}}>Item 2</MenuItem>
        <MenuItem onClick={function On() {}}>Item 3</MenuItem>
        <MenuDivider />
        <MenuItem onClick={function On() {}}>Item 4</MenuItem>
        <MenuItem>Item 5 (non clickable)</MenuItem>
      </Menu>
      {footerData.map((column, index) => (
        <Column key={index}>
          <Rows spacing="3u">
            {column.title && (
              <Text size="medium" weight="bold">
                {column.title}
              </Text>
            )}
            <Rows spacing="2u">
              {column.links.map(link => (
                <Box key={link.label}>
                  {link.external ? (
                    // Plain <a>: Easel Link applies its own color/underline/hover
                    // variant styles that would override the footer's custom link
                    // styling (colorTypographyPrimary + opacity-on-hover).
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.footerLink}
                    >
                      <Text size="small">{link.label}</Text>
                      {/* Plain <span>: inline decorative glyph inside the link; Easel
                          Text would introduce its own line-box metrics. */}
                      {link.external && <span className={styles.externalIcon}> ↗</span>}
                    </a>
                  ) : (
                    <Link to={link.href} className={styles.footerLink}>
                      <Text size="small">{link.label}</Text>
                    </Link>
                  )}
                </Box>
              ))}
            </Rows>
          </Rows>
        </Column>
      ))}
    </Columns>
  );
}
