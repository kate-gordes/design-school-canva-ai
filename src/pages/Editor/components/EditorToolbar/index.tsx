import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Button } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import { useAppContext } from '@/hooks/useAppContext';
import { selectedElementType } from '@/store';
import styles from './EditorToolbar.module.css';
import TextToolbar from '@/pages/Editor/components/EditorToolbar/Toolbars/TextToolbar';
import TextShapeToolbar from '@/pages/Editor/components/EditorToolbar/Toolbars/TextShapeToolbar';
import { FlyoutMenu, FlyoutMenuItem } from '@canva/easel/flyout_menu';
import { MoreHorizontalIcon, PaintRollerIcon, TransparencyIcon } from '@canva/easel/icons';

// No local toolbar content types here; individual toolbars own their data types

export default function EditorToolbar(): React.ReactNode {
  useSignals();
  const { state } = useAppContext();
  // Unify legacy AppContext selection (Whiteboard TextObject/ShapeTextObject)
  // with the signal-based Canvas element selection (Presentation/Spreadsheet/Document).
  const signalType = selectedElementType.value;
  const selectedType: 'text' | 'shape' | 'none' =
    signalType === 'text' || signalType === 'shape' ? signalType : state.selectedObjectType;

  // Generic shell: refs and hidden item keys; specific toolbar handles content and logic
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
  const hiddenKeysRef = useRef<string[]>([]);
  const cachedWidthsRef = useRef<Map<string, number>>(new Map());
  const lastContainerWidthRef = useRef<number>(0);
  // const lastDecisionAtRef = useRef<number>(0);
  const [hiddenLabels, setHiddenLabels] = useState<Set<string>>(new Set());

  useEffect(() => {
    hiddenKeysRef.current = hiddenKeys;
  }, [hiddenKeys]);

  // Centralized responsive hiding: measure items inside the toolbar and decide which to hide
  useLayoutEffect(() => {
    const toolbarEl = toolbarRef.current;
    const containerEl = containerRef.current;
    if (!toolbarEl || !containerEl) return;

    const arraysEqual = (a: string[], b: string[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    let rafId: number | null = null;
    let queued = false;

    type Unit = {
      key: string;
      el: HTMLButtonElement;
      width: number;
      label: string;
      labelLower: string;
    };

    const announceToolbarRect = () => {
      const r = toolbarEl.getBoundingClientRect();
      const detail = {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
      window.dispatchEvent(new CustomEvent('editor-toolbar-updated', { detail }));
    };

    const measureNow = () => {
      const inline =
        toolbarEl.querySelector<HTMLElement>('[data-toolbar-inline="true"]') || toolbarEl;
      // Collect Easel buttons in DOM order (reliable for order) using aria-label
      const buttonEls = Array.from(
        inline.querySelectorAll<HTMLButtonElement>('button[aria-label]'),
      );

      const units: Unit[] = [];
      for (let i = 0; i < buttonEls.length; i++) {
        const el = buttonEls[i];
        const label = el.getAttribute('aria-label') || `btn-${i}`;
        const labelLower = label.toLowerCase();
        const cs = getComputedStyle(el);
        const ml = parseFloat(cs.marginLeft || '0') || 0;
        const mr = parseFloat(cs.marginRight || '0') || 0;
        let width = el.offsetWidth + ml + mr;
        const next = el.nextElementSibling as HTMLElement | null;
        if (next && next.classList.contains(styles.columnDivider)) {
          const ncs = getComputedStyle(next);
          const nml = parseFloat(ncs.marginLeft || '0') || 0;
          const nmr = parseFloat(ncs.marginRight || '0') || 0;
          width += next.offsetWidth + nml + nmr;
        }
        const key = `${label}#${i}`;
        if (width === 0) {
          const cached = cachedWidthsRef.current.get(key);
          if (typeof cached === 'number' && cached > 0) {
            width = cached;
          }
        }
        const prev = cachedWidthsRef.current.get(key) ?? 0;
        if (width > prev) cachedWidthsRef.current.set(key, width);
        units.push({ key, el, width, label, labelLower });
      }

      const containerRight = containerEl.getBoundingClientRect().right;
      const MORE_RESERVE = 56; // approximate width for more button + gap/divider

      // Identify the inline More unit, if present
      const moreUnit = units.find(u => u.labelLower === 'more');

      // Build a working hidden set from current state
      const workingHidden = new Set(hiddenKeysRef.current);

      const visibleUnits = () => units.filter(u => !workingHidden.has(u.key));
      const isHideable = (u: Unit) => u.labelLower !== 'more';

      const setHiddenForUnit = (u: Unit, hide: boolean) => {
        if (!isHideable(u)) return;
        u.el.classList.toggle(styles.hiddenItem, hide);
        const next = u.el.nextElementSibling as HTMLElement | null;
        if (next && next.classList.contains(styles.columnDivider)) {
          next.classList.toggle(styles.hiddenItem, hide);
        }
      };

      const setMoreVisible = (show: boolean) => {
        if (!moreUnit) return;
        moreUnit.el.classList.toggle(styles.hiddenItem, !show);
      };

      const overflows = (): boolean => {
        const reserve = workingHidden.size > 0 ? MORE_RESERVE : 0;
        const availRight = containerRight - reserve;
        const vis = visibleUnits();
        for (let i = 0; i < vis.length; i++) {
          const u = vis[i];
          const rect = u.el.getBoundingClientRect();
          const next = u.el.nextElementSibling as HTMLElement | null;
          const extra =
            next && next.classList.contains(styles.columnDivider)
              ? next.getBoundingClientRect().width
              : 0;
          if (rect.right + extra > availRight - 1) return true;
        }
        return false;
      };

      // Ensure More is visible iff we have any hidden items
      setMoreVisible(workingHidden.size > 0);

      // Hide: while any visible unit is overflowing, ensure More is visible and hide rightmost item
      if (overflows()) {
        const wasEmpty = workingHidden.size === 0;
        if (moreUnit) setMoreVisible(true);
        let hidCount = 0;
        for (;;) {
          const vis = visibleUnits().filter(isHideable);
          if (vis.length === 0) break;
          let rightmostIdx = -1;
          let maxRight = -Infinity;
          for (let i = 0; i < vis.length; i++) {
            const r = vis[i].el.getBoundingClientRect().right;
            if (r > maxRight) {
              maxRight = r;
              rightmostIdx = i;
            }
          }
          if (rightmostIdx === -1) break;
          const toHide = vis[rightmostIdx];
          workingHidden.add(toHide.key);
          setHiddenForUnit(toHide, true);
          hidCount++;
          // If we previously had no hidden items, require at least two items hidden before stopping
          const canStop = !overflows() && (!wasEmpty || hidCount >= 2);
          if (canStop) break;
          if (visibleUnits().filter(isHideable).length === 0) break;
        }
      } else {
        // Unhide: attempt to unhide from rightmost hidden one-by-one while nothing overflows
        const allKeys = units.map(u => u.key);
        const hiddenDomOrder = allKeys.filter(k => workingHidden.has(k));
        for (let i = hiddenDomOrder.length - 1; i >= 0; i--) {
          const key = hiddenDomOrder[i];
          const unit = units.find(u => u.key === key);
          if (!unit || !isHideable(unit)) continue;
          workingHidden.delete(key);
          setHiddenForUnit(unit, false);
          // Hide More if this was last hidden
          if (workingHidden.size === 0 && moreUnit) setMoreVisible(false);
          if (overflows()) {
            workingHidden.add(key);
            setHiddenForUnit(unit, true);
            if (moreUnit) setMoreVisible(true);
            break;
          }
        }
      }

      // Final guard: ensure More button itself fits by hiding one more item if necessary
      if (moreUnit && !moreUnit.el.classList.contains(styles.hiddenItem)) {
        const moreRight = moreUnit.el.getBoundingClientRect().right;
        if (moreRight > containerRight - MORE_RESERVE - 1) {
          const vis = visibleUnits().filter(isHideable);
          if (vis.length > 0) {
            // hide the current rightmost visible item
            let rightmostIdx = -1;
            let maxRight = -Infinity;
            for (let i = 0; i < vis.length; i++) {
              const r = vis[i].el.getBoundingClientRect().right;
              if (r > maxRight) {
                maxRight = r;
                rightmostIdx = i;
              }
            }
            if (rightmostIdx !== -1) {
              const toHide = vis[rightmostIdx];
              workingHidden.add(toHide.key);
              setHiddenForUnit(toHide, true);
            }
          }
        }
      }

      // Finalize hidden keys/labels and apply
      const finalHiddenKeys = units.filter(u => workingHidden.has(u.key)).map(u => u.key);
      const newHiddenLabels = new Set<string>(
        units.filter(u => workingHidden.has(u.key)).map(u => (u.label || '').toLowerCase()),
      );

      if (!arraysEqual(finalHiddenKeys, hiddenKeysRef.current)) {
        hiddenKeysRef.current = finalHiddenKeys;
        setHiddenKeys(finalHiddenKeys);
        setHiddenLabels(newHiddenLabels);
      } else {
        setHiddenLabels(newHiddenLabels);
      }

      lastContainerWidthRef.current = containerRight - containerEl.getBoundingClientRect().left;

      queued = false;
      rafId = null;

      // Announce toolbar rect after layout decisions
      announceToolbarRect();
    };

    const queueMeasure = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(measureNow);
    };

    const roContainer = new ResizeObserver(queueMeasure);
    const roToolbar = new ResizeObserver(queueMeasure);
    const moToolbar = new MutationObserver(queueMeasure);
    roContainer.observe(containerEl);
    roToolbar.observe(toolbarEl);
    moToolbar.observe(toolbarEl, { childList: true, subtree: true, attributes: true });
    window.addEventListener('resize', queueMeasure);
    const raf = requestAnimationFrame(measureNow);
    // Also announce immediately in case nothing changes
    announceToolbarRect();
    return () => {
      cancelAnimationFrame(raf);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', queueMeasure);
      roContainer.disconnect();
      roToolbar.disconnect();
      moToolbar.disconnect();
    };
  }, [selectedType]);

  const hasHidden = hiddenLabels.size > 0;
  const isHidden = (label: string) => hiddenLabels.has(label.toLowerCase());

  return (
    // Plain div: attaches [data-editor-toolbar-root] hook used by layout probes.
    <div data-editor-toolbar-root="true">
      <Box
        className={`${styles.toolbarContainer} ${(() => {
          if (!state.objectPanelDocked) return styles.withLeftRailUndocked;
          switch (state.dockedPanelName) {
            case 'Brand':
              return styles.withLeftRailDockedBrand;
            case 'BrandSidebar':
              return styles.withLeftRailDockedBrandSidebar;
            default:
              return styles.withLeftRailDocked;
          }
        })()}`}
        width="full"
        ref={containerRef}
      >
        {selectedType === 'text' && (
          <Box
            className={styles.toolbar}
            display="flex"
            alignItems="center"
            justifyContent="center"
            ref={toolbarRef}
            data-editor-toolbar-root="true"
          >
            {/* Plain div: [data-toolbar-inline] hook used by measure pass to scope buttons. */}
            <div data-toolbar-inline="true">
              <TextToolbar hiddenKeys={hiddenKeys} />
              {/* Inline More at the end so it truly replaces the last item */}
              <Button
                ariaLabel="More"
                variant="secondary"
                size="medium"
                className={`${styles.iconButton} ${!hasHidden ? styles.hiddenItem : ''}`}
              >
                <MoreHorizontalIcon size="medium" />
              </Button>
              {hasHidden && (
                <FlyoutMenu
                  trigger={props => (
                    // Plain span: hidden FlyoutMenu trigger; the visible More button above
                    // is the real affordance. Span kept raw because it wires to props.onClick/
                    // aria-controls/aria-haspopup/aria-expanded from FlyoutMenu's render prop.
                    <span
                      onClick={props.onClick}
                      aria-controls={props.ariaControls}
                      aria-haspopup={props.ariaHasPopup}
                      aria-expanded={props.pressed}
                      className={styles.hiddenTrigger}
                    />
                  )}
                >
                  {isHidden('Styles') && (
                    <FlyoutMenuItem
                      start={<TransparencyIcon size="medium" />}
                      onClick={() => console.log('Styles')}
                    >
                      Styles
                    </FlyoutMenuItem>
                  )}
                </FlyoutMenu>
              )}
            </div>
          </Box>
        )}
        {selectedType === 'shape' && (
          <Box
            className={styles.toolbar}
            display="flex"
            alignItems="center"
            justifyContent="center"
            ref={toolbarRef}
          >
            {/* Plain div: [data-toolbar-inline] hook used by measure pass to scope buttons. */}
            <div data-toolbar-inline="true">
              <TextShapeToolbar hiddenKeys={hiddenKeys} />
              <Button
                ariaLabel="More"
                variant="secondary"
                size="medium"
                className={`${styles.iconButton} ${!hasHidden ? styles.hiddenItem : ''}`}
              >
                <MoreHorizontalIcon size="medium" />
              </Button>
              {hasHidden && (
                <FlyoutMenu
                  trigger={props => (
                    // Plain span: hidden FlyoutMenu trigger; the visible More button above
                    // is the real affordance. Span kept raw because it wires to props.onClick/
                    // aria-controls/aria-haspopup/aria-expanded from FlyoutMenu's render prop.
                    <span
                      onClick={props.onClick}
                      aria-controls={props.ariaControls}
                      aria-haspopup={props.ariaHasPopup}
                      aria-expanded={props.pressed}
                      className={styles.hiddenTrigger}
                    />
                  )}
                >
                  {isHidden('Styles') && (
                    <FlyoutMenuItem
                      start={<PaintRollerIcon size="medium" />}
                      onClick={() => console.log('Styles')}
                    >
                      Styles
                    </FlyoutMenuItem>
                  )}
                </FlyoutMenu>
              )}
            </div>
          </Box>
        )}
      </Box>
    </div>
  );
}
