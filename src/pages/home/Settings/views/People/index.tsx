import React, { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column, SlidersIcon } from '@canva/easel';
import { TextInput } from '@canva/easel/form/text_input';
import { Select } from '@canva/easel/form/select';
import {
  SearchIcon,
  GridViewIcon,
  ListBulletLtrIcon,
  ChevronDownIcon,
  UsersIcon,
} from '@canva/easel/icons';
import usersData from '@/data/users.json';
import sharedStyles from '../shared.module.css';
import styles from './People.module.css';

interface GroupData {
  initials: string;
  color: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  initials: string;
  photo: string | null;
  avatarColor?: string;
  role: string;
  groups: GroupData[];
}

function GroupBadge({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={styles.groupBadge} style={{ backgroundColor: color }}>
      <Text weight="bold" className={styles.groupBadgeText}>
        {initials}
      </Text>
    </div>
  );
}

function PersonRow({
  name,
  email,
  initials,
  photo,
  avatarColor,
  role,
  groups,
}: Omit<UserData, 'id'>) {
  return (
    <div className={sharedStyles.tableRow}>
      <div className={styles.gridRow}>
        <div className={sharedStyles.tableCell}>
          <Columns spacing="1u" alignY="center">
            <Column width="content">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className={sharedStyles.tableThumbnail}
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div
                  className={styles.profileImageInitials}
                  style={{ backgroundColor: avatarColor || '#6b7280' }}
                >
                  <Text size="small" className={styles.initialsText}>
                    {initials}
                  </Text>
                </div>
              )}
            </Column>
            <Column>
              <Text>{name}</Text>
            </Column>
          </Columns>
        </div>
        <div className={sharedStyles.tableCell}>
          <Text tone="secondary">{email}</Text>
        </div>
        <div className={sharedStyles.tableCell}>
          <Text tone="secondary">{role}</Text>
        </div>
        <div className={sharedStyles.tableCell}>
          <div className={styles.groupBadges}>
            {groups.slice(0, groups.length > 4 ? 3 : 4).map((group, i) => (
              <GroupBadge key={i} initials={group.initials} color={group.color} />
            ))}
            {groups.length > 4 && (
              <div className={styles.extraBadge}>
                <span className={styles.extraBadgeText}>+{groups.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobilePersonCard({
  name,
  email,
  initials,
  photo,
  avatarColor,
  role,
}: Omit<UserData, 'id' | 'groups'>) {
  return (
    <div className={styles.mobilePersonCard}>
      <Columns spacing="2u" alignY="center">
        <Column width="content">
          {photo ? (
            <img src={photo} alt={name} className={styles.mobileAvatar} />
          ) : (
            <div
              className={styles.mobileAvatarInitials}
              style={{ backgroundColor: avatarColor || '#6b7280' }}
            >
              <Text className={styles.initialsText}>{initials}</Text>
            </div>
          )}
        </Column>
        <Column>
          <Rows spacing="0.5u">
            <Text weight="bold">{name}</Text>
            <Text tone="secondary" size="small">
              {email}
            </Text>
            <Box display="inlineFlex">
              <button className={styles.roleBadge}>{role}</button>
            </Box>
          </Rows>
        </Column>
      </Columns>
    </div>
  );
}

function MobilePersonGridCard({
  name,
  email,
  initials,
  photo,
  avatarColor,
  role,
}: Omit<UserData, 'id' | 'groups'>) {
  return (
    <div className={styles.mobileGridCard}>
      {photo ? (
        <img src={photo} alt={name} className={styles.mobileGridAvatar} />
      ) : (
        <div
          className={styles.mobileGridAvatarInitials}
          style={{ backgroundColor: avatarColor || '#6b7280' }}
        >
          <Text className={styles.gridInitialsText}>{initials}</Text>
        </div>
      )}
      <div className={styles.gridCardNameEmail}>
        <Text weight="bold" alignment="center">
          {name}
        </Text>
        <Text tone="secondary" alignment="center">
          {email}
        </Text>
      </div>
      <div className={styles.roleDropdown}>
        <Text size="small">{role}</Text>
        <ChevronDownIcon size="small" />
      </div>
    </div>
  );
}

function DesktopPersonGridCard({
  name,
  email,
  initials,
  photo,
  avatarColor,
  role,
}: Omit<UserData, 'id' | 'groups'>) {
  return (
    <div className={styles.desktopGridCard}>
      {photo ? (
        <img src={photo} alt={name} className={styles.desktopGridAvatar} />
      ) : (
        <div
          className={styles.desktopGridAvatarInitials}
          style={{ backgroundColor: avatarColor || '#6b7280' }}
        >
          <Text className={styles.desktopGridInitialsText}>{initials}</Text>
        </div>
      )}
      <div className={styles.desktopGridCardInfo}>
        <Text weight="bold" alignment="center">
          {name}
        </Text>
        <Text tone="secondary" size="small" alignment="center">
          {email}
        </Text>
      </div>
      <div className={styles.roleDropdown}>
        <Text size="small">{role}</Text>
        <ChevronDownIcon size="small" />
      </div>
    </div>
  );
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Team admin' },
  { value: 'brand-designer', label: 'Team brand designer' },
  { value: 'member', label: 'Team member' },
];

export default function People(): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const users = usersData.users as UserData[];

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchQuery === ''
      || user.name.toLowerCase().includes(searchQuery.toLowerCase())
      || user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRoles.length === 0
      || (selectedRoles.includes('admin') && user.role === 'Team admin')
      || (selectedRoles.includes('brand-designer') && user.role === 'Team brand designer')
      || (selectedRoles.includes('member') && user.role === 'Team member');

    return matchesSearch && matchesRole;
  });

  return (
    <Box className={sharedStyles.settingsViewContainerWide}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            People ({users.length.toLocaleString()})
          </Title>
        </Box>

        {/* Grid/List toggle button - Mobile only (under title) */}
        <Box className={styles.mobileGridButton}>
          <Box display="flex" justifyContent="end">
            <button
              className={styles.gridButton}
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
        </Box>

        {/* Search and filters - Desktop */}
        <Box paddingTop="2u" className={styles.desktopFilters}>
          <Columns spacing="2u" alignY="center">
            <Column width="content">
              <Box className={styles.searchInput}>
                <TextInput
                  placeholder="Search members by name or email"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  start={<SearchIcon size="medium" />}
                />
              </Box>
            </Column>
            <Column width="content">
              <Box className={styles.roleSelect}>
                <Select
                  type="multi"
                  options={ROLE_OPTIONS}
                  value={selectedRoles}
                  onChange={setSelectedRoles}
                  placeholder="All roles"
                  stretch
                  start={<UsersIcon size="medium" />}
                />
              </Box>
            </Column>
            <Column>
              <Box display="flex" justifyContent="end">
                <button
                  className={styles.gridButton}
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

        {/* Search - Mobile (with filter icon outside) */}
        <Box className={styles.mobileFilters}>
          <div className={styles.mobileSearchRow}>
            <div className={styles.mobileSearchInput}>
              <TextInput
                placeholder="Search members by name or email"
                value={searchQuery}
                onChange={setSearchQuery}
                start={<SearchIcon size="medium" />}
              />
            </div>
            <button
              className={styles.filterButton}
              aria-label="Filters"
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <SlidersIcon size="medium" />
            </button>
          </div>
        </Box>

        {/* Mobile Filter Sheet */}
        {isFilterSheetOpen && (
          <>
            <div className={styles.sheetBackdrop} onClick={() => setIsFilterSheetOpen(false)} />
            <div className={styles.sheetSimple}>
              <div className={styles.sheetHandle} />
              <div className={styles.sheetContentSimple}>
                {ROLE_OPTIONS.map(option => (
                  <label key={option.value} className={styles.filterCheckboxSimple}>
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(option.value)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, option.value]);
                        } else {
                          setSelectedRoles(selectedRoles.filter(r => r !== option.value));
                        }
                      }}
                    />
                    <Text>{option.label}</Text>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Table header - Desktop (List view) */}
        {viewMode === 'list' && (
          <Box paddingTop="2u" className={styles.desktopTable}>
            <div className={styles.gridRow}>
              <div className={sharedStyles.tableCell}>
                <Text tone="secondary" weight="bold">
                  Name
                </Text>
              </div>
              <div className={sharedStyles.tableCell}>
                <Text tone="secondary" weight="bold">
                  Email
                </Text>
              </div>
              <div className={sharedStyles.tableCell}>
                <Text tone="secondary" weight="bold">
                  Team role
                </Text>
              </div>
              <div className={sharedStyles.tableCell}>
                <Text tone="secondary" weight="bold">
                  Groups
                </Text>
              </div>
            </div>
          </Box>
        )}

        {/* Table rows - Desktop (List view) */}
        {viewMode === 'list' && (
          <Box className={styles.desktopTable}>
            <Rows spacing="0">
              {filteredUsers.map(user => (
                <PersonRow key={user.id} {...user} />
              ))}
            </Rows>
          </Box>
        )}

        {/* Grid view - Desktop */}
        {viewMode === 'grid' && (
          <Box className={styles.desktopGrid}>
            <div className={styles.desktopGridContainer}>
              {filteredUsers.map(user => (
                <DesktopPersonGridCard key={user.id} {...user} />
              ))}
            </div>
          </Box>
        )}

        {/* People list - Mobile (List view) */}
        {viewMode === 'list' && (
          <Box className={styles.mobileList}>
            <Box className={styles.mobileSectionHeader}>
              <Text weight="bold">People</Text>
            </Box>
            <Rows spacing="0">
              {filteredUsers.map(user => (
                <MobilePersonCard key={user.id} {...user} />
              ))}
            </Rows>
            <div className={styles.scrollFadeGradient} />
          </Box>
        )}

        {/* People grid - Mobile (Grid view) */}
        {viewMode === 'grid' && (
          <Box className={styles.mobileList}>
            <div className={styles.mobileGridContainer}>
              {filteredUsers.map(user => (
                <MobilePersonGridCard key={user.id} {...user} />
              ))}
            </div>
            <div className={styles.scrollFadeGradient} />
          </Box>
        )}
      </Rows>
    </Box>
  );
}
