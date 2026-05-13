import { useLocation } from 'react-router-dom';
import { Box } from '@canva/easel';
import CanvaLogo from './CanvaLogo';
import TrashButton from './TrashButton';
import styles from './ContextualNav.module.css';

import HomeContextualNav from './HomeContextualNav';
import ProjectsContextualNav from './ProjectsContextualNav';
import TemplatesContextualNav from './TemplatesContextualNav';
import BrandContextualNav from './BrandContextualNav';
import AppsContextualNav from './AppsContextualNav';
import CanvaAIContextualNav from './CanvaAIContextualNav';
import CreatorContextualNav from './CreatorContextualNav';
import SettingsContextualNav from './SettingsContextualNav';

const ContextualNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderSection = () => {
    if (currentPath.startsWith('/ai')) {
      return <CanvaAIContextualNav />;
    }

    if (currentPath.startsWith('/apps')) {
      return <AppsContextualNav />;
    }

    switch (currentPath) {
      case '/projects':
        return <ProjectsContextualNav />;
      case '/templates':
        return <TemplatesContextualNav />;
      case '/brand':
        return <BrandContextualNav />;
      case '/canva-ai':
        return <CanvaAIContextualNav />;
      case '/settings':
        return <SettingsContextualNav />;
      case '/creator':
      case '/creator/creators-hub':
      case '/creator/inspiration':
      case '/creator/elements-creator':
      case '/creator/my-items':
      case '/creator/resources':
        return <CreatorContextualNav />;
      default:
        return <HomeContextualNav />;
    }
  };

  return (
    <Box className={styles.secondaryNav}>
      {/* Canva Logo */}
      <Box className={styles.logoContainer}>
        <CanvaLogo className={styles.logo} />
      </Box>

      {/* Scrollable Content */}
      <Box className={styles.scrollableContent}>{renderSection()}</Box>

      {/* Fixed Trash section at bottom - show on specific pages */}
      {([
        '/',
        '/projects',
        '/templates',
        '/brand',
        '/canva-ai',
        '/creator',
        '/creator-templates',
      ].includes(currentPath)
        || currentPath.startsWith('/ai')
        || currentPath.startsWith('/apps')
        || currentPath.startsWith('/creator')) && (
        <Box className={styles.trashSection}>
          <TrashButton />
        </Box>
      )}
    </Box>
  );
};

export default ContextualNav;
