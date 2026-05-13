import { useState } from 'react';
import { Box, Rows, Text, Title, Columns, Column } from '@canva/easel';
import { TextInput } from '@canva/easel/form/text_input';
import { Select } from '@canva/easel/form/select';
import { Link } from '@canva/easel/link';
import {
  SearchIcon,
  MoreHorizontalIcon,
  ChevronRightIcon,
  SlidersIcon,
  XIcon,
  CheckIcon,
} from '@canva/easel/icons';
import sharedStyles from '../shared.module.css';
import styles from './OrdersAndInvoices.module.css';

interface OrderRowProps {
  thumbnail: string;
  title: string;
  subtitle: string;
  createdOn: string;
  status: string;
  totalPayable: string;
}

function OrderRow({ thumbnail, title, subtitle, createdOn, status, totalPayable }: OrderRowProps) {
  return (
    <div className={styles.orderRow}>
      <div className={styles.gridRow}>
        <div className={sharedStyles.tableCell}>
          <Columns spacing="1u" alignY="center">
            <Column width="content">
              <img src={thumbnail} alt={title} className={styles.thumbnail} />
            </Column>
            <Column>
              <Rows spacing="0">
                <Text weight="bold" size="small">
                  {title}
                </Text>
                <Text tone="secondary" size="small">
                  {subtitle}
                </Text>
              </Rows>
            </Column>
          </Columns>
        </div>
        <div className={sharedStyles.tableCell}>
          <Text>{createdOn}</Text>
        </div>
        <div className={sharedStyles.tableCell}>
          <Box className={sharedStyles.statusBadge}>
            <Text size="small" weight="bold" className={sharedStyles.statusBadgeText}>
              {status}
            </Text>
          </Box>
        </div>
        <div className={sharedStyles.tableCell}>
          <Text>{totalPayable}</Text>
        </div>
        <div className={sharedStyles.tableCell}>
          <Text>
            <Link href="#">View print order</Link>
          </Text>
        </div>
        <div className={styles.moreCell}>
          <button className={styles.moreButton} aria-label="More actions">
            <MoreHorizontalIcon size="medium" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileOrderRow({
  thumbnail,
  title,
  status,
}: Pick<OrderRowProps, 'thumbnail' | 'title' | 'status'>) {
  return (
    <div className={styles.mobileOrderRow}>
      <img src={thumbnail} alt={title} className={styles.mobileThumbnail} />
      <div className={styles.mobileOrderInfo}>
        <Text weight="bold" className={styles.mobileOrderTitle}>
          {title}
        </Text>
        <div className={styles.badgeWrapper}>
          <Box className={sharedStyles.statusBadge}>
            <Text
              size="small"
              weight="bold"
              className={`${sharedStyles.statusBadgeText} ${styles.mobileStatusBadge}`}
            >
              {status}
            </Text>
          </Box>
        </div>
      </div>
      <div className={styles.mobileChevron}>
        <ChevronRightIcon size="medium" />
      </div>
    </div>
  );
}

const ORDERS_DATA: OrderRowProps[] = [
  {
    thumbnail: 'https://template.canva.com/EAFLdGjEyjI/1/0/400w-WhjfcIUBbPU.jpg',
    title: 'Posters',
    subtitle: '04635-10776468',
    createdOn: 'September 10, 2025',
    status: 'Shipped',
    totalPayable: 'A$25.30',
  },
  {
    thumbnail: 'https://template.canva.com/EAFLjEcKpWI/2/0/400w-ShDUA_PcTh4.jpg',
    title: 'T-Shirts',
    subtitle: '3 items • 04436-1611191',
    createdOn: 'February 23, 2025',
    status: 'Shipped',
    totalPayable: 'A$90',
  },
];

const TYPE_OPTIONS = [
  { value: 'any', label: 'Any item type' },
  { value: 'credit', label: 'Credit' },
  { value: 'license', label: 'License' },
  { value: 'print-order', label: 'Print order' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'verification', label: 'Verification' },
  { value: 'feature-license', label: 'Feature license' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'All dates' },
  { value: '30days', label: 'Last 30 days' },
  { value: '90days', label: 'Last 90 days' },
  { value: '120days', label: 'Last 120 days' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
];

export default function OrdersAndInvoices(): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('any');
  const [dateFilter, setDateFilter] = useState('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <Box className={sharedStyles.settingsViewContainerWide}>
      <Rows spacing="2u">
        {/* Page Title */}
        <Box className={sharedStyles.titleSection}>
          <Title size="large" alignment="center">
            Orders and invoices
          </Title>
        </Box>

        {/* Desktop Filters */}
        <Box paddingTop="2u" className={styles.desktopFilters}>
          <Columns spacing="2u" alignY="end">
            <Column width="content">
              <Rows spacing="0.5u">
                <Text weight="bold">Search for invoice ID</Text>
                <Box className={styles.invoiceInput}>
                  <TextInput
                    placeholder="Enter invoice ID"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    start={<SearchIcon size="medium" />}
                  />
                </Box>
              </Rows>
            </Column>
            <Column width="content">
              <Rows spacing="0.5u">
                <Text weight="bold">Filter by type</Text>
                <Box className={styles.typeSelect}>
                  <Select
                    options={TYPE_OPTIONS}
                    value={typeFilter}
                    onChange={setTypeFilter}
                    stretch
                  />
                </Box>
              </Rows>
            </Column>
            <Column width="content">
              <Rows spacing="0.5u">
                <Text weight="bold">Filter by date</Text>
                <Box className={styles.dateSelect}>
                  <Select
                    options={DATE_OPTIONS}
                    value={dateFilter}
                    onChange={setDateFilter}
                    stretch
                  />
                </Box>
              </Rows>
            </Column>
          </Columns>
        </Box>

        {/* Mobile Filters */}
        <Box className={styles.mobileFilters}>
          <TextInput
            placeholder="Enter invoice ID"
            value={searchQuery}
            onChange={setSearchQuery}
            start={<SearchIcon size="medium" />}
            end={
              <button
                className={styles.filterIconButton}
                aria-label="Filters"
                onClick={() => setIsFilterSheetOpen(true)}
              >
                <SlidersIcon size="medium" />
              </button>
            }
          />
        </Box>

        {/* Mobile Filter Sheet */}
        {isFilterSheetOpen && (
          <>
            <div className={styles.sheetBackdrop} onClick={() => setIsFilterSheetOpen(false)} />
            <div className={styles.filterSheet}>
              <div className={styles.sheetHeader}>
                <Title size="large">Filters</Title>
                <button
                  className={styles.sheetCloseButton}
                  onClick={() => setIsFilterSheetOpen(false)}
                  aria-label="Close"
                >
                  <XIcon size="medium" />
                </button>
              </div>
              <div className={styles.sheetContent}>
                <Text weight="bold" className={styles.filterSectionTitle}>
                  Filter by type
                </Text>
                {TYPE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    className={`${styles.filterOption} ${typeFilter === option.value ? styles.filterOptionActive : ''}`}
                    onClick={() => setTypeFilter(option.value)}
                  >
                    <Text>{option.label}</Text>
                    {typeFilter === option.value && <CheckIcon size="medium" />}
                  </button>
                ))}

                <Text weight="bold" className={styles.filterSectionTitle}>
                  Filter by date
                </Text>
                {DATE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    className={`${styles.filterOption} ${dateFilter === option.value ? styles.filterOptionActive : ''}`}
                    onClick={() => setDateFilter(option.value)}
                  >
                    <Text>{option.label}</Text>
                    {dateFilter === option.value && <CheckIcon size="medium" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Desktop Table header */}
        <Box paddingTop="2u" className={`${sharedStyles.tableHeader} ${styles.desktopTable}`}>
          <div className={styles.gridRow}>
            <div className={sharedStyles.tableCell}>
              <Text tone="secondary" weight="bold">
                Description
              </Text>
            </div>
            <div className={sharedStyles.tableCell}>
              <Text tone="secondary" weight="bold">
                Created on
              </Text>
            </div>
            <div className={sharedStyles.tableCell}>
              <Text tone="secondary" weight="bold">
                Status
              </Text>
            </div>
            <div className={sharedStyles.tableCell}>
              <Text tone="secondary" weight="bold">
                Total payable
              </Text>
            </div>
            <div className={sharedStyles.tableCell}>
              <Text tone="secondary" weight="bold">
                Actions
              </Text>
            </div>
            <div></div>
          </div>
        </Box>

        {/* Desktop Table rows */}
        <Box className={styles.desktopTable}>
          <Rows spacing="0">
            {ORDERS_DATA.map((order, index) => (
              <OrderRow key={index} {...order} />
            ))}
          </Rows>
        </Box>

        {/* Mobile List */}
        <Box className={styles.mobileList} paddingTop="6u">
          <div className={styles.mobileListContainer}>
            {ORDERS_DATA.map((order, index) => (
              <MobileOrderRow
                key={index}
                thumbnail={order.thumbnail}
                title={order.title}
                status={order.status}
              />
            ))}
          </div>
        </Box>
      </Rows>
    </Box>
  );
}
