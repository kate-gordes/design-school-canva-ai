import React from 'react';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

export default function Divider(): React.ReactElement {
  // Plain span: EditorToolbar's measure pass looks for a sibling with
  // className === styles.columnDivider to include its width in the overflow
  // calculation (via classList.contains). An Easel Box would apply an opaque
  // class name and break that contract.
  return <span className={styles.columnDivider} />;
}
