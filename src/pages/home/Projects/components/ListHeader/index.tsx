import * as React from 'react';
import { Divider } from '@canva/easel';
import styles from './ListHeader.module.css';

// Messages for internationalization
const ListHeaderMessages = {
  typeTitle: () => 'Type',
  peopleTitle: () => 'People',
};

export const DesktopListHeaderControls = ({
  editedColumnButton,
  nameColumnButton,
}: {
  editedColumnButton: React.ReactNode;
  nameColumnButton: React.ReactNode;
}): React.JSX.Element => {
  // NOTE: the name column button doesn't need the paddedCell style because
  // all others columns are slightly right skewed
  return (
    <div className={styles.listViewTableHeader}>
      <span className={styles.nameColumnButton}>{nameColumnButton}</span>
      <span className={styles.paddedCell}>{ListHeaderMessages.peopleTitle()}</span>
      <span className={styles.paddedCell}>{ListHeaderMessages.typeTitle()}</span>
      <span className={styles.paddedCell}>{editedColumnButton}</span>
    </div>
  );
};

export const ListHeader = ({
  editedColumnButton,
  nameColumnButton,
}: {
  editedColumnButton: React.ReactNode;
  nameColumnButton: React.ReactNode;
}): React.JSX.Element => {
  return (
    <>
      <DesktopListHeaderControls
        editedColumnButton={editedColumnButton}
        nameColumnButton={nameColumnButton}
      />
      <Divider />
    </>
  );
};

export default ListHeader;
