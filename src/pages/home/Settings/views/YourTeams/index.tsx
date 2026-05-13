import React, { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column, SlidersIcon } from '@canva/easel';
import { TextInput } from '@canva/easel/form/text_input';
import { Select } from '@canva/easel/form/select';
import { Button } from '@canva/easel/button';
import { FlyoutMenu, FlyoutMenuItem } from '@canva/easel/flyout_menu';
import {
  SearchIcon,
  MoreHorizontalIcon,
  ListBulletVerticalIcon,
  GridViewIcon,
  ChevronRightIcon,
} from '@canva/easel/icons';
import CanvaLogoIcon from '@/shared_components/icons/CanvaLogoIcon';
import teamsData from '@/data/teams.json';
import sharedStyles from '../shared.module.css';
import styles from './YourTeams.module.css';

type GradientType = 'bluePurple' | 'blue' | 'purple' | 'pinkRed' | 'orange';

interface TeamData {
  id: string;
  name: string;
  gradientType: GradientType;
  avatarType?: 'logo';
  initials?: string;
  avatarColor?: string;
  members: string[];
  isMainTeam?: boolean;
}

interface TeamCardProps {
  name: string;
  initials?: string;
  role: string;
  status?: string;
  gradientType: GradientType;
  avatarColor?: string;
  avatarType?: 'initials' | 'logo';
}

const GRADIENT_CLASSES: Record<GradientType, string> = {
  bluePurple: styles.gradientBluePurple,
  blue: styles.gradientBlue,
  purple: styles.gradientPurple,
  pinkRed: styles.gradientPinkRed,
  orange: styles.gradientOrange,
};

function TeamCard({
  name,
  initials,
  role,
  status,
  gradientType,
  avatarColor,
  avatarType = 'initials',
}: TeamCardProps) {
  return (
    <Box className={styles.teamCard}>
      <div className={`${styles.gradientBanner} ${GRADIENT_CLASSES[gradientType]}`} />
      <div className={styles.cardContent}>
        {avatarType === 'logo' ? (
          <CanvaLogoIcon size={48} />
        ) : (
          <div className={styles.avatarCircle} style={{ backgroundColor: avatarColor }}>
            <Text weight="bold" className={styles.avatarText}>
              {initials}
            </Text>
          </div>
        )}
        <div className={styles.cardInfo}>
          <Text weight="bold">{name}</Text>
          <Text tone="secondary" size="small">
            {role}
            {status && <> • {status}</>}
          </Text>
        </div>
        <FlyoutMenu
          trigger={props => (
            <button
              className={styles.menuButton}
              onClick={props.onClick}
              aria-controls={props.ariaControls}
              aria-haspopup={props.ariaHasPopup}
              aria-expanded={props.pressed}
              aria-label="More options"
            >
              <MoreHorizontalIcon size="medium" />
            </button>
          )}
        >
          <FlyoutMenuItem start={<ListBulletVerticalIcon size="medium" />} label="Team profile" />
        </FlyoutMenu>
      </div>
    </Box>
  );
}

// Simulate current user ID (in real app, this would come from auth context)
const CURRENT_USER_ID = '1';

// Determine user's role in a team (simplified: first 3 members are admins)
function getUserRole(team: TeamData, userId: string): string {
  const memberIndex = team.members.indexOf(userId);
  if (memberIndex === -1) return 'Team member';
  return memberIndex < 3 ? 'Team admin' : 'Team member';
}

export default function YourTeams(): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const teams = teamsData.teams as TeamData[];

  // Get user's teams
  const userTeams = teams.filter(team => team.members.includes(CURRENT_USER_ID));

  // Separate main team from other teams
  const mainTeam = userTeams.find(team => team.isMainTeam);
  const otherTeams = userTeams.filter(team => !team.isMainTeam);

  // Apply search filter
  const filteredOtherTeams = otherTeams.filter(team => {
    const matchesSearch =
      searchQuery === '' || team.name.toLowerCase().includes(searchQuery.toLowerCase());

    const userRole = getUserRole(team, CURRENT_USER_ID);
    const matchesRole =
      roleFilter === 'all'
      || (roleFilter === 'admin' && userRole === 'Team admin')
      || (roleFilter === 'member' && userRole === 'Team member');

    return matchesSearch && matchesRole;
  });

  return (
    <Box className={sharedStyles.settingsViewContainerWide}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Your teams
          </Title>
        </Box>

        {/* Search and filters - Desktop */}
        <Box className={styles.desktopFilters}>
          <Columns spacing="2u" alignY="center">
            <Column width="content">
              <Box className={styles.searchInput}>
                <TextInput
                  placeholder="Search teams"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  start={<SearchIcon size="medium" />}
                />
              </Box>
            </Column>
            <Column width="content">
              <Box className={styles.roleSelect}>
                <Select
                  options={[
                    { value: 'all', label: 'All roles' },
                    { value: 'owner', label: 'Team owner' },
                    { value: 'admin', label: 'Team admin' },
                    { value: 'member', label: 'Team member' },
                  ]}
                  value={roleFilter}
                  onChange={setRoleFilter}
                  stretch
                />
              </Box>
            </Column>
            <Column>
              <Box display="flex" justifyContent="end">
                <button className={styles.gridButton} aria-label="Grid view">
                  <GridViewIcon size="medium" />
                </button>
              </Box>
            </Column>
          </Columns>
        </Box>

        {/* Search and filters - Mobile */}
        <Box className={styles.mobileFilters}>
          <TextInput
            placeholder="Search teams"
            value={searchQuery}
            onChange={setSearchQuery}
            start={<SearchIcon size="medium" />}
            end={
              <button
                className={styles.filterIconButton}
                onClick={() => setIsFilterSheetOpen(true)}
                aria-label="Filters"
              >
                <SlidersIcon size="large" />
              </button>
            }
          />
        </Box>

        {/* Mobile Filter Sheet */}
        {isFilterSheetOpen && (
          <>
            <div className={styles.sheetBackdrop} onClick={() => setIsFilterSheetOpen(false)} />
            <div className={styles.sheet}>
              <div className={styles.sheetHandle} />
              <div className={styles.sheetHeader}>
                <Title size="small">All filters</Title>
                <button
                  className={styles.sheetDoneButton}
                  onClick={() => setIsFilterSheetOpen(false)}
                >
                  Done
                </button>
              </div>
              <div className={styles.sheetContent}>
                <button className={styles.filterSheetItem} onClick={() => {}}>
                  <Text>Roles</Text>
                  <ChevronRightIcon size="medium" />
                </button>
                <Box paddingTop="2u">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setRoleFilter('all');
                      setIsFilterSheetOpen(false);
                    }}
                  >
                    Clear all
                  </Button>
                </Box>
              </div>
            </div>
          </>
        )}

        {/* Main Canva team section */}
        {mainTeam && (
          <Box paddingTop="1u">
            <Rows spacing="2u">
              <Columns spacing="1u" alignY="center">
                <Column width="content">
                  <div className={styles.canvaLogo}>
                    <span className={styles.canvaLogoText}>C</span>
                  </div>
                </Column>
                <Column>
                  <Title size="small">Canva</Title>
                </Column>
              </Columns>

              <Box className={styles.singleTeamCard}>
                <TeamCard
                  name={mainTeam.name}
                  role={getUserRole(mainTeam, CURRENT_USER_ID)}
                  status="Active"
                  gradientType={mainTeam.gradientType}
                  avatarType="logo"
                />
              </Box>
            </Rows>
          </Box>
        )}

        {/* Other teams section */}
        {filteredOtherTeams.length > 0 && (
          <Box paddingTop="2u">
            <Rows spacing="2u">
              <Title size="small" className={sharedStyles.sectionTitle}>
                Other teams
              </Title>

              <div className={styles.teamsGrid}>
                {filteredOtherTeams.map(team => (
                  <TeamCard
                    key={team.id}
                    name={team.name}
                    initials={team.initials}
                    role={getUserRole(team, CURRENT_USER_ID)}
                    gradientType={team.gradientType}
                    avatarColor={team.avatarColor}
                  />
                ))}
              </div>
            </Rows>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
