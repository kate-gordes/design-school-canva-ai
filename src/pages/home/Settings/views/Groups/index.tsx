import React, { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { TextInput } from '@canva/easel/form/text_input';
import { Select } from '@canva/easel/form/select';
import {
  SearchIcon,
  SortIcon,
  ListBulletLtrIcon,
  GridViewIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  CheckIcon,
} from '@canva/easel/icons';
import { FlyoutMenu, FlyoutMenuItem } from '@canva/easel/flyout_menu';
import groupsData from '@/data/groups.json';
import usersData from '@/data/users.json';
import sharedStyles from '../shared.module.css';
import styles from './Groups.module.css';

type GradientType = 'bluePurple' | 'blue' | 'purple' | 'pinkRed' | 'orange';

interface GroupData {
  id: string;
  name: string;
  initials: string;
  gradientType: GradientType;
  avatarColor: string;
  members: string[];
}

const GRADIENT_CLASSES: Record<GradientType, string> = {
  bluePurple: styles.gradientBluePurple,
  blue: styles.gradientBlue,
  purple: styles.gradientPurple,
  pinkRed: styles.gradientPinkRed,
  orange: styles.gradientOrange,
};

interface UserData {
  id: string;
  name: string;
  initials: string;
  photo: string | null;
  avatarColor?: string;
}

interface GroupCardProps {
  name: string;
  initials: string;
  memberIds: string[];
  gradientType: GradientType;
  avatarColor: string;
  allUsers: UserData[];
}

function MemberAvatars({ memberIds, allUsers }: { memberIds: string[]; allUsers: UserData[] }) {
  // Get first 1-2 members to show as avatars
  const visibleMembers = memberIds
    .slice(0, 1)
    .map(id => allUsers.find(u => u.id === id))
    .filter(Boolean) as UserData[];
  const remainingCount = memberIds.length - visibleMembers.length;

  return (
    <div className={styles.memberAvatars}>
      {visibleMembers.map(member =>
        member.photo ? (
          <img
            key={member.id}
            src={member.photo}
            alt={member.name}
            className={styles.memberPhoto}
          />
        ) : (
          <div
            key={member.id}
            className={styles.memberInitials}
            style={{ backgroundColor: member.avatarColor || '#6b7280' }}
          >
            <Text size="small" className={styles.memberInitialsText}>
              {member.initials}
            </Text>
          </div>
        ),
      )}
      {remainingCount > 0 && (
        <div className={styles.memberCount}>
          <Text size="small" tone="secondary">
            +{remainingCount}
          </Text>
        </div>
      )}
    </div>
  );
}

function GroupCard({
  name,
  initials,
  memberIds,
  gradientType,
  avatarColor,
  allUsers,
}: GroupCardProps) {
  return (
    <Box className={styles.groupCard}>
      <div className={`${styles.gradientBanner} ${GRADIENT_CLASSES[gradientType]}`} />
      <div className={styles.cardContent}>
        <div className={styles.avatarCircle} style={{ backgroundColor: avatarColor }}>
          <Text weight="bold" className={styles.avatarText}>
            {initials}
          </Text>
        </div>
        <div className={styles.cardInfo}>
          <Text weight="bold">{name}</Text>
        </div>
        <MemberAvatars memberIds={memberIds} allUsers={allUsers} />
      </div>
    </Box>
  );
}

function MobileListMemberAvatars({
  memberIds,
  allUsers,
}: {
  memberIds: string[];
  allUsers: UserData[];
}) {
  const visibleMembers = memberIds
    .slice(0, 4)
    .map(id => allUsers.find(u => u.id === id))
    .filter(Boolean) as UserData[];
  const remainingCount = memberIds.length - visibleMembers.length;

  return (
    <div className={styles.listMemberAvatars}>
      {visibleMembers.map(member =>
        member.photo ? (
          <img
            key={member.id}
            src={member.photo}
            alt={member.name}
            className={styles.listMemberPhoto}
          />
        ) : (
          <div
            key={member.id}
            className={styles.listMemberInitials}
            style={{ backgroundColor: member.avatarColor || '#6b7280' }}
          >
            <Text className={styles.listMemberInitialsText}>{member.initials}</Text>
          </div>
        ),
      )}
      {remainingCount > 0 && (
        <div className={styles.listMemberCount}>
          <Text size="small">+{remainingCount}</Text>
        </div>
      )}
    </div>
  );
}

function GroupListRow({
  name,
  initials,
  memberIds,
  avatarColor,
  allUsers,
}: Omit<GroupCardProps, 'gradientType'>) {
  return (
    <div className={styles.groupListRow}>
      <div className={styles.groupListName}>
        <div className={styles.listAvatarCircle} style={{ backgroundColor: avatarColor }}>
          <Text weight="bold" className={styles.listAvatarText}>
            {initials}
          </Text>
        </div>
        <Text weight="bold" className={styles.groupNameText}>
          {name}
        </Text>
      </div>
      <div className={styles.groupListMembers}>
        <MobileListMemberAvatars memberIds={memberIds} allUsers={allUsers} />
      </div>
    </div>
  );
}

// Simulate current user ID
const CURRENT_USER_ID = '1';

type SortOption = 'name-asc' | 'name-desc' | 'created-new' | 'created-old';

export default function Groups(): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleFilter, setPeopleFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  const groups = groupsData.groups as GroupData[];
  const users = usersData.users as UserData[];

  // Filter groups based on search and filter
  const filteredGroups = groups
    .filter(group => {
      const matchesSearch =
        searchQuery === '' || group.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPeopleFilter =
        peopleFilter === 'all'
        || (peopleFilter === 'me' && group.members.includes(CURRENT_USER_ID));

      return matchesSearch && matchesPeopleFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'created-new':
        case 'created-old':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <Box className={sharedStyles.settingsViewContainerWide}>
      <Rows spacing="2u">
        {/* Page Title - Desktop */}
        <Box className={`${sharedStyles.titleSection} ${styles.desktopTitle}`}>
          <Title size="large" alignment="center">
            Groups ({groups.length})
          </Title>
        </Box>

        {/* Page Title - Mobile */}
        <Box className={`${sharedStyles.titleSection} ${styles.mobileTitle}`}>
          <Title size="large" alignment="center">
            Groups
          </Title>
        </Box>

        {/* Mobile icons */}
        <Box className={styles.mobileIcons}>
          <button
            className={styles.mobileIconButton}
            aria-label="Sort"
            onClick={() => setIsSortSheetOpen(true)}
          >
            <SortIcon size="medium" />
          </button>
          <button
            className={styles.mobileIconButton}
            aria-label={viewMode === 'list' ? 'Grid view' : 'List view'}
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <GridViewIcon size="medium" />
            ) : (
              <ListBulletLtrIcon size="medium" />
            )}
          </button>
        </Box>

        {/* Mobile Sort Sheet */}
        {isSortSheetOpen && (
          <>
            <div className={styles.sheetBackdrop} onClick={() => setIsSortSheetOpen(false)} />
            <div className={styles.sortSheet}>
              <div className={styles.sheetHandle} />
              <div className={styles.sortSheetHeader}>
                <Text weight="bold">Sort by</Text>
              </div>
              <div className={styles.sortSheetContent}>
                <button
                  className={`${styles.sortOption} ${sortBy === 'name-asc' ? styles.sortOptionActive : ''}`}
                  onClick={() => {
                    setSortBy('name-asc');
                    setIsSortSheetOpen(false);
                  }}
                >
                  <ArrowDownIcon size="medium" />
                  <Text>Name (A-Z)</Text>
                  {sortBy === 'name-asc' && <CheckIcon size="medium" />}
                </button>
                <button
                  className={`${styles.sortOption} ${sortBy === 'name-desc' ? styles.sortOptionActive : ''}`}
                  onClick={() => {
                    setSortBy('name-desc');
                    setIsSortSheetOpen(false);
                  }}
                >
                  <ArrowUpIcon size="medium" />
                  <Text>Name (Z-A)</Text>
                  {sortBy === 'name-desc' && <CheckIcon size="medium" />}
                </button>
                <button
                  className={`${styles.sortOption} ${sortBy === 'created-new' ? styles.sortOptionActive : ''}`}
                  onClick={() => {
                    setSortBy('created-new');
                    setIsSortSheetOpen(false);
                  }}
                >
                  <ClockIcon size="medium" />
                  <Text>Created (new to old)</Text>
                  {sortBy === 'created-new' && <CheckIcon size="medium" />}
                </button>
                <button
                  className={`${styles.sortOption} ${sortBy === 'created-old' ? styles.sortOptionActive : ''}`}
                  onClick={() => {
                    setSortBy('created-old');
                    setIsSortSheetOpen(false);
                  }}
                >
                  <ClockIcon size="medium" />
                  <Text>Created (old to new)</Text>
                  {sortBy === 'created-old' && <CheckIcon size="medium" />}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Search and filters - Desktop */}
        <Box className={styles.desktopFilters}>
          <Columns spacing="2u" alignY="center">
            <Column width="content">
              <Box className={styles.searchInput}>
                <TextInput
                  placeholder="Search groups by name"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  start={<SearchIcon size="medium" />}
                />
              </Box>
            </Column>
            <Column width="content">
              <Box className={styles.peopleSelect}>
                <Select
                  options={[
                    { value: 'all', label: 'All people' },
                    { value: 'me', label: 'My groups' },
                  ]}
                  value={peopleFilter}
                  onChange={setPeopleFilter}
                  stretch
                />
              </Box>
            </Column>
            <Column>
              <Box display="flex" justifyContent="end" gap="1u">
                <FlyoutMenu
                  trigger={props => (
                    <button
                      onClick={props.onClick}
                      aria-controls={props.ariaControls}
                      aria-haspopup={props.ariaHasPopup}
                      aria-expanded={props.pressed}
                      className={styles.desktopIconButton}
                      aria-label="Sort"
                    >
                      <SortIcon size="medium" />
                    </button>
                  )}
                >
                  <Box padding="1u">
                    <Text weight="bold">Sort by</Text>
                  </Box>
                  <FlyoutMenuItem
                    label="Name (A-Z)"
                    start={<ArrowDownIcon size="medium" />}
                    end={sortBy === 'name-asc' ? <CheckIcon size="medium" /> : undefined}
                    onClick={() => setSortBy('name-asc')}
                  />
                  <FlyoutMenuItem
                    label="Name (Z-A)"
                    start={<ArrowUpIcon size="medium" />}
                    end={sortBy === 'name-desc' ? <CheckIcon size="medium" /> : undefined}
                    onClick={() => setSortBy('name-desc')}
                  />
                  <FlyoutMenuItem
                    label="Created (new to old)"
                    start={<ClockIcon size="medium" />}
                    end={sortBy === 'created-new' ? <CheckIcon size="medium" /> : undefined}
                    onClick={() => setSortBy('created-new')}
                  />
                  <FlyoutMenuItem
                    label="Created (old to new)"
                    start={<ClockIcon size="medium" />}
                    end={sortBy === 'created-old' ? <CheckIcon size="medium" /> : undefined}
                    onClick={() => setSortBy('created-old')}
                  />
                </FlyoutMenu>
                <button
                  className={styles.desktopIconButton}
                  aria-label={viewMode === 'list' ? 'Grid view' : 'List view'}
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                >
                  {viewMode === 'list' ? (
                    <GridViewIcon size="medium" />
                  ) : (
                    <ListBulletLtrIcon size="medium" />
                  )}
                </button>
              </Box>
            </Column>
          </Columns>
        </Box>

        {/* Search and filters - Mobile */}
        <Box className={styles.mobileFilters}>
          <Rows spacing="1.5u">
            <Box className={styles.mobileSearchInput}>
              <TextInput
                placeholder="Search groups by name"
                value={searchQuery}
                onChange={setSearchQuery}
                start={<SearchIcon size="medium" />}
              />
            </Box>
            <Box className={styles.mobileSelectWrapper}>
              <Select
                options={[
                  { value: 'all', label: 'All people' },
                  { value: 'me', label: 'My groups' },
                ]}
                value={peopleFilter}
                onChange={setPeopleFilter}
                stretch
              />
            </Box>
          </Rows>
        </Box>

        {/* Groups list - Desktop (List view) */}
        {viewMode === 'list' && (
          <Box paddingTop="2u" className={styles.desktopList}>
            <div className={styles.desktopListHeader}>
              <Text tone="secondary" weight="bold">
                Group name
              </Text>
              <Text tone="secondary" weight="bold">
                Members
              </Text>
            </div>
            <Rows spacing="0">
              {filteredGroups.map(group => (
                <GroupListRow
                  key={group.id}
                  name={group.name}
                  initials={group.initials}
                  memberIds={group.members}
                  avatarColor={group.avatarColor}
                  allUsers={users}
                />
              ))}
            </Rows>
          </Box>
        )}

        {/* Groups grid - Desktop (Grid view) */}
        {viewMode === 'grid' && (
          <Box paddingTop="2u" className={styles.desktopGrid}>
            <div className={styles.groupsGrid}>
              {filteredGroups.map(group => (
                <GroupCard
                  key={group.id}
                  name={group.name}
                  initials={group.initials}
                  memberIds={group.members}
                  gradientType={group.gradientType}
                  avatarColor={group.avatarColor}
                  allUsers={users}
                />
              ))}
            </div>
          </Box>
        )}

        {/* Groups list - Mobile (List view) */}
        {viewMode === 'list' && (
          <Box className={styles.mobileList}>
            <div className={styles.listHeader}>
              <Text tone="secondary" weight="bold">
                Group name
              </Text>
              <Text tone="secondary" weight="bold">
                Members
              </Text>
            </div>
            <Rows spacing="0">
              {filteredGroups.map(group => (
                <GroupListRow
                  key={group.id}
                  name={group.name}
                  initials={group.initials}
                  memberIds={group.members}
                  avatarColor={group.avatarColor}
                  allUsers={users}
                />
              ))}
            </Rows>
            <div className={styles.scrollFadeGradient} />
          </Box>
        )}

        {/* Groups grid - Mobile (Grid view) */}
        {viewMode === 'grid' && (
          <Box className={styles.mobileGrid}>
            <div className={styles.mobileGroupsGrid}>
              {filteredGroups.map(group => (
                <GroupCard
                  key={group.id}
                  name={group.name}
                  initials={group.initials}
                  memberIds={group.members}
                  gradientType={group.gradientType}
                  avatarColor={group.avatarColor}
                  allUsers={users}
                />
              ))}
            </div>
            <div className={styles.scrollFadeGradient} />
          </Box>
        )}
      </Rows>
    </Box>
  );
}
