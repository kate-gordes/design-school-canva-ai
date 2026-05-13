# Port Result Schema

## Slot Audit — written by `css-auditor`

Written to `.porter-workspace/<PageName>/audits/<SLOT_NAME>.json`.

```typescript
interface SlotAudit {
  slotName: string;
  sourcePath: string;
  sourceFiles: string[]; // all .tsx and .css files read, in order
  auditTable: AuditRow[];
  easelComponentSpec: EaselComponentSpec[]; // every Easel component call with layout props (Step 7b)
  valuesToInline: InlineValue[]; // @value tokens that must be inlined (Rules A, F)
  composesChains: ComposesChain[]; // composes: chains resolved to concrete properties
  inlineSvgAssets: SvgAsset[]; // .inline.svg imports found
  structuralFlags: StructuralFlags;
  requiredAdvisories: AdvisoryFlag[];
}

interface EaselComponentSpec {
  component: string; // e.g. "Box", "Rows", "Button", "CircleButton"
  sourceFile: string; // which .tsx file this appears in
  sourceLineApprox: string; // approximate location
  props: Record<string, string>; // all visual/layout props — paddingX, gap, spacing, variant, size, etc.
  className?: string; // e.g. "styles.container" if a className prop is applied
}

interface AuditRow {
  element: string; // human description e.g. "auth button span"
  sourceFile: string; // e.g. "auth_buttons.css"
  properties: Record<string, string>; // resolved concrete values from source, e.g. { fontSize: "14px" }
  notes?: string; // any resolution notes or ambiguity
}

interface InlineValue {
  name: string; // e.g. "largeUp"
  value: string; // e.g. "(min-width: 1200px)"
  foundIn: string; // css file path
  rule: 'A' | 'F' | 'S'; // which rule requires inlining
}

interface ComposesChain {
  selector: string; // e.g. ".loginButton"
  composesFrom: string; // e.g. "textBoldMedium"
  resolvedProperties: Record<string, string>; // all properties from the chain
  missingInPrototype: boolean; // true if cross-file composes won't resolve
}

interface SvgAsset {
  importPath: string; // e.g. "./icons/play.inline.svg"
  resolvedPath: string; // absolute path in monorepo
  fillToReplace: string; // e.g. "#191E26" — the fill value to replace with "currentColor"
}

interface StructuralFlags {
  hasNavContentHeight: boolean;
  gradientPattern: 'fullBleed' | 'contained' | 'none';
  hasThemeBoundary: boolean;
  headerVariant: 'overlay' | 'overlay-light' | 'standard' | null;
}
```

## Page Shell — written by `page-porter` orchestrator (Step 3b)

Written to `.porter-workspace/<PageName>/results/page-shell.json`.

```typescript
interface PageShell {
  hasShell: boolean; // false for anonymous/non-shell pages
  navWrapper: {
    sourcePath: string; // e.g. "ui/nav/logged_in_shell/shell_layout/shell_layout.tsx"
    width: string; // resolved px value or null
    position: string; // "fixed" | "sticky" | "relative"
    zIndex: string; // e.g. "100"
  } | null;
  mainContent: {
    margin: string; // resolved — e.g. "8px 8px 8px 0"
    borderRadius: string; // resolved px — e.g. "16px"
    boxShadow: string; // resolved full shadow string
    overflow: string; // always "hidden"
    background: string; // resolved token or hex
  } | null;
  scrollContainer: {
    overflowY: string; // "auto" | "scroll"
    height: string; // resolved — e.g. "100vh" or "calc(100vh - 80px)"
  } | null;
  backgroundGradient: string | null; // full CSS gradient string, or null if none
  pageHeightConstraint: string | null; // height/min-height on the outermost page element
}
```

## Port Result — written by `slot-porter`

Written to `.porter-workspace/<PageName>/results/<SLOT_NAME>.json`.

```typescript
interface PortResult {
  slotName: string;
  status: 'complete' | 'failed' | 'partial';
  filesWritten: string[]; // prototype-relative paths
  easelValidationStatus: 'clean' | 'passing' | 'needs-work';
  easelErrors: string[];
  deviations: Deviation[]; // REQUIRED — every place prototype differs from monorepo source
  notes: string[]; // any decisions or warnings beyond deviations
  validation: SlotValidationSummary | null; // populated after slot-validator runs
}

interface Deviation {
  file: string; // e.g. "index.tsx"
  line: string; // e.g. "approx 45"
  monorepoCode: string; // what the source had
  prototypeCode: string; // what the prototype has
  reason: 'vite' | 'logic' | 'dom-complexity'; // the valid reason code
  description: string; // specific explanation
}

interface SlotValidationSummary {
  pass: boolean;
  mismatches: Mismatch[];
  retries: number; // number of porter retry cycles completed (max 2)
}
```

## Validation Report — written by `slot-validator` (per slot, read-only)

Written to `.porter-workspace/<PageName>/validation/<SLOT_NAME>.json`.

```typescript
interface SlotValidationReport {
  slotName: string;
  pass: boolean; // true if no HIGH or MEDIUM mismatches
  mismatches: Mismatch[];
  infoFindings: InfoFinding[];
}

interface Mismatch {
  element: string; // e.g. "auth button span"
  property: string; // e.g. "fontSize" | "easelComponent" | "missing-element" | "undocumented-deviation" | "css-value-mismatch"
  expected: string; // from monorepo source
  actual: string; // from prototype
  severity: 'high' | 'medium' | 'low';
  sourceFile: string; // the monorepo source file that is authoritative for this value
  auditTableRow?: string; // which audit row this corresponds to (optional)
}

interface InfoFinding {
  element: string;
  property: 'visual-sanity';
  severity: 'info';
  note: string; // description of visual discrepancy
  sourceFileToCheck: string; // which source file to investigate
}
```

Note: the slot-validator writes one file per slot to `validation/<SLOT_NAME>.json`. There is no single `validation.json` — the orchestrator aggregates across all slots internally.
