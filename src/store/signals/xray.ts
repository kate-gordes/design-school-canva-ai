import { signal } from '@preact/signals-react';

/**
 * Whether the editor is currently in "Design School X-ray" mode — a
 * hold-to-reveal overlay that dims the editor and lights up colour-coded
 * hotspots over key features. Activated by holding Shift on desktop or
 * press-and-holding the floating 🎓 button on mobile.
 *
 * Held interactions only — releasing the trigger flips this back to
 * `false`. Click-to-open on a hotspot also clears it (since the user is
 * about to look at a video and shouldn't have to keep Shift held to
 * watch it).
 */
export const xrayModeActive = signal<boolean>(false);

export function setXrayModeActive(value: boolean) {
  xrayModeActive.value = value;
}
