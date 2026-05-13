import { TreeMenu, TreeMenuItem, Spacer, Box, Text } from '@canva/easel';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserCircleIcon,
  SignInIcon,
  A11yCircleIcon,
  EnvelopeIcon,
  LockUserIcon,
  DatabaseIcon,
  UserListIcon,
  MagicIcon,
  UserIcon,
  UsersIcon,
  TeamSliderIcon,
  CreditCardFrontIcon,
  CartIcon,
  GlobeIcon,
} from '@canva/easel/icons';
import styles from './ContextualNav.module.css';

export default function SettingsContextualNav(): React.ReactNode {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get('view') || 'your-profile';

  const handleItemClick = (view: string) => {
    navigate(`/settings?view=${view}`);
  };

  return (
    <>
      {/* Personal account Section */}
      <Box paddingY="2u" className={styles.sectionTitleWrapper}>
        <Text weight="bold" tone="secondary" size="small">
          Personal account
        </Text>
      </Box>

      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        <TreeMenuItem
          label="Your profile"
          selected={currentView === 'your-profile'}
          onClick={() => handleItemClick('your-profile')}
          start={<UserCircleIcon size="medium" />}
        />
        <TreeMenuItem
          label="Login"
          selected={currentView === 'login'}
          onClick={() => handleItemClick('login')}
          start={<SignInIcon size="medium" />}
        />
        <TreeMenuItem
          label="Accessibility"
          selected={currentView === 'accessibility'}
          onClick={() => handleItemClick('accessibility')}
          start={<A11yCircleIcon size="medium" />}
        />
        <TreeMenuItem
          label="Message preferences"
          selected={currentView === 'message-preferences'}
          onClick={() => handleItemClick('message-preferences')}
          start={<EnvelopeIcon size="medium" />}
        />
        <TreeMenuItem
          label="Privacy controls"
          selected={currentView === 'privacy-controls'}
          onClick={() => handleItemClick('privacy-controls')}
          start={<LockUserIcon size="medium" />}
        />
        <TreeMenuItem
          label="Data and storage"
          selected={currentView === 'data-and-storage'}
          onClick={() => handleItemClick('data-and-storage')}
          start={<DatabaseIcon size="medium" />}
        />
        <TreeMenuItem
          label="Your teams"
          selected={currentView === 'your-teams'}
          onClick={() => handleItemClick('your-teams')}
          start={<UserListIcon size="medium" />}
        />
        <TreeMenuItem
          label="AI personalization"
          selected={currentView === 'ai-personalization'}
          onClick={() => handleItemClick('ai-personalization')}
          start={<MagicIcon size="medium" />}
        />
      </TreeMenu>

      {/* People management Section */}
      <Spacer size="1u" />
      <Box paddingY="2u" className={styles.sectionTitleWrapper}>
        <Text weight="bold" tone="secondary" size="small">
          People management
        </Text>
      </Box>

      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        <TreeMenuItem
          label="People"
          selected={currentView === 'people'}
          onClick={() => handleItemClick('people')}
          start={<UserIcon size="medium" />}
        />
        <TreeMenuItem
          label="Groups"
          selected={currentView === 'groups'}
          onClick={() => handleItemClick('groups')}
          start={<UsersIcon size="medium" />}
        />
        <TreeMenuItem
          label="Team profile"
          selected={currentView === 'team-profile'}
          onClick={() => handleItemClick('team-profile')}
          start={<TeamSliderIcon size="medium" />}
        />
      </TreeMenu>

      {/* Payments and plans Section */}
      <Spacer size="1u" />
      <Box paddingY="2u" className={styles.sectionTitleWrapper}>
        <Text weight="bold" tone="secondary" size="small">
          Payments and plans
        </Text>
      </Box>

      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        <TreeMenuItem
          label="Billing"
          selected={currentView === 'billing'}
          onClick={() => handleItemClick('billing')}
          start={<CreditCardFrontIcon size="medium" />}
        />
        <TreeMenuItem
          label="Orders and invoices"
          selected={currentView === 'orders-and-invoices'}
          onClick={() => handleItemClick('orders-and-invoices')}
          start={<CartIcon size="medium" />}
        />
      </TreeMenu>

      {/* Domains Section */}
      <Spacer size="1u" />
      <Box paddingY="2u" className={styles.sectionTitleWrapper}>
        <Text weight="bold" tone="secondary" size="small">
          Domains
        </Text>
      </Box>

      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        <TreeMenuItem
          label="Web domains"
          selected={currentView === 'web-domains'}
          onClick={() => handleItemClick('web-domains')}
          start={<GlobeIcon size="medium" />}
        />
      </TreeMenu>
    </>
  );
}
