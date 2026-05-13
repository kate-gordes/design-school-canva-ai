import classNames from 'classnames';
import * as React from 'react';
import styles from './Divider.module.css';

export type DividerDirection = 'horizontal' | 'vertical';
export type DividerProps = {
  /**
   * Specify the direction of the divider.
   *
   * @default 'horizontal'
   */
  direction?: DividerDirection;
};

/**
 * The Divider component is used to separate content with a thin horizontal line.
 *
 * [Visit the Easel Docs site for more info](https://docs.canva.tech/easel/components/divider/)
 * @easel
 */
// Raw <hr>: this IS the prototype's Divider primitive. <hr> is the semantically
// correct element for a thematic break and carries the accessibility contract
// the design system expects; Easel has no lower-level primitive below this.
export const Divider = ({ direction }: DividerProps) => (
  <hr
    className={classNames(styles.divider, {
      [styles.vertical]: direction === 'vertical',
    })}
  />
);

export default Divider;
