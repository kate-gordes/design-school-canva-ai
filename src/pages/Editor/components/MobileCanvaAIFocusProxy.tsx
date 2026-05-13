/**
 * MobileCanvaAIFocusProxy - Hidden proxy input for iOS keyboard activation
 *
 * iOS Safari/Chrome requires input.focus() to be called directly within a user-initiated
 * event handler to open the keyboard. By the time MobileCanvaAIPanel mounts (after React
 * re-renders), it's no longer considered part of the original tap event chain.
 *
 * This component provides a hidden proxy input that's always mounted. We focus it
 * immediately on tap (within the user gesture), then transfer focus to the real
 * input when the AI panel renders - keeping the keyboard open.
 */

import { setProxyInputRef } from './focusMobileAIInput';
import styles from './MobileCanvaAIFocusProxy.module.css';

export function MobileCanvaAIFocusProxy(): React.ReactNode {
  return (
    // Plain input: Easel TextInput does not expose a ref hook that can be focused imperatively
    // inside a user-gesture handler, which is required to open the iOS keyboard. This proxy
    // must remain a raw <input>.
    <input
      ref={el => {
        setProxyInputRef(el);
      }}
      type="text"
      className={styles.hiddenProxy}
      aria-hidden="true"
      tabIndex={-1}
      // Prevent autocorrect/autocapitalize from interfering
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />
  );
}
