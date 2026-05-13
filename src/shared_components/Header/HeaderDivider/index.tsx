import React from 'react';
import styles from './HeaderDivider.module.css';

export default function HeaderDivider(): React.ReactNode {
  // Plain div: .divider uses a ::before pseudo-element painted with
  // hsla(0,0%,100%,0.2); Easel Box's reset_f88b8e clears backgrounds and
  // pseudo-element styling on the wrapper.
  return <div className={styles.divider} />;
}
