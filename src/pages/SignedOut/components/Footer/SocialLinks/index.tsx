import { Box, Text } from '@canva/easel';
import styles from './SocialLinks.module.css';

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: 'linkedin', href: 'https://www.linkedin.com/company/canva', label: 'LinkedIn' },
  { icon: 'instagram', href: 'https://www.instagram.com/canva', label: 'Instagram' },
  { icon: 'facebook', href: 'https://www.facebook.com/canva', label: 'Facebook' },
  { icon: 'tiktok', href: 'https://www.tiktok.com/@canva', label: 'TikTok' },
  { icon: 'pinterest', href: 'https://www.pinterest.com/canva', label: 'Pinterest' },
  { icon: 'x', href: 'https://twitter.com/canva', label: 'X (Twitter)' },
  { icon: 'youtube', href: 'https://www.youtube.com/canva', label: 'YouTube' },
];

// Simple icon mapping (can be replaced with actual SVG icons)
function getSocialIcon(icon: string): string {
  const icons: Record<string, string> = {
    linkedin: '💼',
    instagram: '📷',
    facebook: '👥',
    tiktok: '🎵',
    pinterest: '📌',
    x: '✕',
    youtube: '▶️',
  };
  return icons[icon] || '🔗';
}

interface SocialLinksProps {
  /** Show language selector */
  showLanguageSelector?: boolean;
  /** Show legal links (Privacy, Terms, Copyright) */
  showLegalLinks?: boolean;
}

export default function SocialLinks({
  showLanguageSelector = true,
  showLegalLinks = true,
}: SocialLinksProps): React.ReactNode {
  return (
    <Box className={styles.container}>
      {/* Language selector */}
      {showLanguageSelector && (
        <Box className={styles.languageSelector}>
          {/* Plain <button>: Easel Button variants ship their own background,
              border, padding and typography tokens that would override this
              bordered pill style (1px border, 8px/16px padding, custom radius). */}
          <button className={styles.languageButton}>
            {/* Plain <span>: inline emoji glyph sized via class, not Easel text. */}
            <span className={styles.globeIcon}>🌐</span>
            <Text size="small">English (US)</Text>
          </button>
        </Box>
      )}

      {/* Social media icons */}
      <Box display="flex" className={styles.socialIcons}>
        {socialLinks.map(social => (
          // Plain <a>: Easel Link applies its own variant color/underline/hover
          // styles that would override the custom 40x40 circular icon button styling.
          <a
            key={social.icon}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label={social.label}
          >
            {/* Plain <span>: inline emoji glyph sized via class, not Easel text. */}
            <span className={styles.socialIcon}>{getSocialIcon(social.icon)}</span>
          </a>
        ))}
      </Box>
    </Box>
  );
}
