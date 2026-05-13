import React, { useEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import useIsMobile from '@/hooks/useIsMobile';
import { setXrayModeActive, xrayModeActive } from '@/store/signals/xray';

/**
 * Owns activation of "Design School X-ray" mode on desktop.
 *
 * Holding Shift turns the mode on; releasing turns it off. Shift presses
 * inside an input, textarea, contenteditable, or select are deliberately
 * ignored — Shift is also a modifier for legitimate text editing
 * (capital letters, range selection) and shouldn't pop a learning
 * overlay over the editor while the user types.
 *
 * The mobile floating-FAB activator was removed: X-ray mode is a
 * power-user discovery affordance and the FAB was eating real estate
 * for a feature most touch users wouldn't reach for. Desktop keeps the
 * Shift hold; mobile users see no entry point at all.
 *
 * The XrayOverlay itself is rendered separately in `Editor` so the
 * trigger doesn't have to portal anything.
 */

function isInTextField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function XrayTrigger(): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Shift') return;
      if (isInTextField(e.target)) return;
      // Avoid retriggering on auto-repeat; the signal already represents the
      // held state.
      if (xrayModeActive.value) return;
      setXrayModeActive(true);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'Shift') return;
      setXrayModeActive(false);
    };

    // Tab away / window blur should always exit X-ray — otherwise the mode
    // can get "stuck" on if the user releases Shift in a different window.
    const onBlur = () => {
      if (xrayModeActive.value) setXrayModeActive(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [isMobile]);

  return null;
}
