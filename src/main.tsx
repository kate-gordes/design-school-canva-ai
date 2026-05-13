import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { PostHogProvider } from '@posthog/react';
import { EaselProvider } from '@canva/easel/provider';
import { Box } from '@canva/easel';
import '@canva/easel/styles.css';
import App from './App';
import styles from './index.module.css';
import { AppProvider } from '@/providers/App';
import ThemeRoot from '@/shared_components/Theme/Root';
import { bootConnect } from '@/store';

// FlyingFox redirects unknown paths to /index.html (302). Strip it so the
// URL shows as / rather than /index.html, preserving any hash route.
if (window.location.pathname.endsWith('/index.html')) {
  window.history.replaceState({}, '', '/' + window.location.hash);
}

// Picks up an existing Connect session or a fresh ?code= OAuth redirect.
// Stays inert when the user has never connected, so localhost dev is not
// redirected to Okta on first load.
bootConnect();

const posthogOptions = {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-01-30',
} as const;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey="phc_o7fjTOIWSN6rkQkNRKRCr0PBk3ZhYh62a5QpyvfPVgR"
      options={posthogOptions}
    >
      <HashRouter>
        <AppProvider>
          <EaselProvider
            direction="LTR"
            disableDialogBlur={false}
            disableFocusTraps={false}
            enableAnimations={true}
            enableUserSelection={true}
          >
            <ThemeRoot />
            <Box className={styles.container} display="flex">
              <App />
            </Box>
          </EaselProvider>
        </AppProvider>
      </HashRouter>
    </PostHogProvider>
  </StrictMode>,
);
