import { useEffect } from 'react';
import { mobileAIEditMode, updateMobileAIEditModeDimensions } from '@/store';

/**
 * TypeScript declarations for VirtualKeyboard API
 */
declare global {
  interface Navigator {
    virtualKeyboard?: VirtualKeyboard;
  }
  interface VirtualKeyboard extends EventTarget {
    overlaysContent: boolean;
    boundingRect: DOMRectReadOnly;
    show(): void;
    hide(): void;
  }
  interface VirtualKeyboardGeometryChangeEvent extends Event {
    target: VirtualKeyboard;
  }
}

/**
 * Hook for managing virtual keyboard behavior on mobile devices.
 *
 * Uses the VirtualKeyboard API when available (Chrome Android 94+, Edge 94+).
 * Falls back to visualViewport API for unsupported browsers (Safari iOS, Firefox).
 *
 * With interactive-widget=overlays-content, the viewport stays stable and
 * the keyboard overlays content. This hook sets --keyboard-height CSS variable
 * for positioning elements above the keyboard.
 */
export function useVirtualKeyboard() {
  useEffect(() => {
    const hasVirtualKeyboard = 'virtualKeyboard' in navigator && navigator.virtualKeyboard;

    if (hasVirtualKeyboard) {
      // VirtualKeyboard API (Chrome Android) - viewport doesn't resize automatically
      navigator.virtualKeyboard!.overlaysContent = true;

      const handleGeometryChange = () => {
        const { height } = navigator.virtualKeyboard!.boundingRect;
        updateMobileAIEditModeDimensions(height, window.innerHeight);
        // Set CSS custom property for keyboard-aware positioning
        document.documentElement.style.setProperty('--keyboard-height', `${height}px`);
        // Note: Scroll reset is handled by MobileCanvaAIPanel only in selection mode
      };

      handleGeometryChange();
      navigator.virtualKeyboard!.addEventListener('geometrychange', handleGeometryChange);

      return () => {
        navigator.virtualKeyboard!.removeEventListener('geometrychange', handleGeometryChange);
        navigator.virtualKeyboard!.overlaysContent = false;
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      };
    } else {
      // Fallback for iOS Safari/Chrome, Firefox
      // With overlays-content, visualViewport.height may not change
      // But visualViewport.offsetTop DOES change when keyboard pushes content up
      const viewport = window.visualViewport;
      if (!viewport) return;

      // Track keyboard state
      let inputFocused = false;
      let keyboardWasOpen = false;
      let estimatedHeight = 0;

      const updateKeyboardState = (kbHeight: number) => {
        updateMobileAIEditModeDimensions(kbHeight, viewport.height);
        document.documentElement.style.setProperty('--keyboard-height', `${kbHeight}px`);
        keyboardWasOpen = kbHeight > 0;
      };

      const handleResize = () => {
        // Method 1: Check if viewport height shrunk (works with resizes-content)
        const heightDiff = window.innerHeight - viewport.height;

        // Method 2: Check offsetTop (iOS sometimes scrolls viewport up)
        const offsetTop = viewport.offsetTop;

        // Use the largest detected keyboard height
        const detectedHeight = Math.max(0, heightDiff, offsetTop);

        // If we detect actual keyboard height, use it and remember it
        if (detectedHeight > 50) {
          estimatedHeight = detectedHeight;
          updateKeyboardState(detectedHeight);
          return;
        }

        // If viewport reports no keyboard, trust it (keyboard was dismissed)
        if (keyboardWasOpen && detectedHeight < 50) {
          updateKeyboardState(0);
          return;
        }

        // If input just focused and we can't detect keyboard, estimate for iOS
        if (inputFocused && !keyboardWasOpen) {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          if (isIOS) {
            estimatedHeight = Math.round(window.innerHeight * 0.4);
            updateKeyboardState(estimatedHeight);
          }
        }
      };

      const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.isContentEditable
        ) {
          inputFocused = true;
          // Delay to let keyboard animate open
          setTimeout(handleResize, 300);
        }
      };

      const handleFocusOut = () => {
        inputFocused = false;
        // Delay to let keyboard animate closed
        setTimeout(() => {
          if (!inputFocused) {
            updateKeyboardState(0);
          }
        }, 100);
      };

      // Also listen to scroll events on viewport - iOS fires these when keyboard animates
      const handleScroll = () => {
        // Small delay to let viewport settle
        setTimeout(handleResize, 50);
      };

      handleResize();
      viewport.addEventListener('resize', handleResize);
      viewport.addEventListener('scroll', handleScroll);
      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);

      return () => {
        viewport.removeEventListener('resize', handleResize);
        viewport.removeEventListener('scroll', handleScroll);
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      };
    }
  }, []);

  // Return keyboard state from signal for convenience
  return {
    keyboardOpen: mobileAIEditMode.value.keyboardOpen,
    keyboardHeight: mobileAIEditMode.value.keyboardHeight,
    isSupported: 'virtualKeyboard' in navigator,
  };
}

export default useVirtualKeyboard;
