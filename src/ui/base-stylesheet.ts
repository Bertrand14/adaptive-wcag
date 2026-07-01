/**
 * Every rule here is scoped behind a profile's html[data-awcag-*]
 * attribute selector. With no profile active, none of these selectors
 * match anything, so the stylesheet has zero effect on the host page —
 * the engine never has to guess "neutral" defaults for scalar values.
 *
 * Several CSS variables are set by more than one profile (see
 * src/profiles/adaptations.ts for the shared rule bundles). The lists
 * below are the single source of truth for "which profiles' attributes
 * must gate this variable's consuming rule" — every profile that sets
 * one of these variables must appear in the matching list, or its
 * effect silently never renders.
 */
const sel = (ids: string[]): string => ids.map((id) => `[data-awcag-${id}]`).join(', ');

const MOTION_PROFILES = [
  'autism',
  'migraine',
  'visual-fatigue',
  'cognitive-difficulties',
  'photophobia',
  'aphasia',
  'adhd',
  'cognitive-fatigue',
  'memory-difficulties',
  'photosensitive-epilepsy',
  'senior',
];

const FOCUS_PROFILES = [
  'autism',
  'cognitive-difficulties',
  'color-blindness',
  'aphasia',
  'adhd',
  'memory-difficulties',
  'motor-disability',
  'keyboard-only',
];

const SPACING_PROFILES = [
  'dyslexia',
  'visual-fatigue',
  'cognitive-difficulties',
  'macular-degeneration',
  'tunnel-vision',
  'reading-difficulties',
  'adhd',
  'cognitive-fatigue',
  'motor-disability',
  'senior',
];

const FONT_SCALE_PROFILES = ['dyslexia', 'low-vision', 'visual-fatigue', 'cataract', 'macular-degeneration', 'reading-difficulties', 'senior'];

const VISUAL_FILTER_PROFILES = ['dyslexia', 'low-vision', 'migraine', 'visual-fatigue', 'photophobia', 'cataract', 'senior'];

const BORDER_PROFILES = ['low-vision', 'color-blindness', 'cataract', 'macular-degeneration', 'motor-disability', 'tremor', 'voice-command', 'senior'];

const CONTROL_SIZE_PROFILES = ['low-vision', 'macular-degeneration', 'motor-disability', 'tremor', 'voice-command', 'senior'];

const TEXT_ALIGN_PROFILES = ['dyslexia', 'reading-difficulties'];

const MAX_WIDTH_PROFILES = ['dyslexia', 'tunnel-vision'];

/**
 * Exported so tests can verify, from the actual profile catalog, that
 * every profile setting a given CSS variable is listed in the group
 * that gates it here — the mapping above is hand-maintained and has no
 * other safety net against a group silently missing an entry.
 */
export const GATED_VAR_GROUPS: Record<string, string[]> = {
  '--awcag-animation-duration': MOTION_PROFILES,
  '--awcag-transition-duration': MOTION_PROFILES,
  '--awcag-focus-outline-width': FOCUS_PROFILES,
  '--awcag-focus-outline-style': FOCUS_PROFILES,
  '--awcag-line-height': SPACING_PROFILES,
  '--awcag-paragraph-spacing': SPACING_PROFILES,
  '--awcag-font-scale': FONT_SCALE_PROFILES,
  '--awcag-visual-filter': VISUAL_FILTER_PROFILES,
  '--awcag-border-width': BORDER_PROFILES,
  '--awcag-control-min-size': CONTROL_SIZE_PROFILES,
  '--awcag-text-align': TEXT_ALIGN_PROFILES,
  '--awcag-max-line-width': MAX_WIDTH_PROFILES,
  '--awcag-icon-scale': ['low-vision'],
  '--awcag-control-spacing': ['voice-command'],
  '--awcag-font-family': ['dyslexia'],
  '--awcag-letter-spacing': ['dyslexia'],
  '--awcag-word-spacing': ['dyslexia'],
};

export const BASE_STYLESHEET = `
html[data-awcag-dyslexia] body,
html[data-awcag-dyslexia] p,
html[data-awcag-dyslexia] li,
html[data-awcag-dyslexia] dd,
html[data-awcag-dyslexia] blockquote {
  font-family: var(--awcag-font-family) !important;
  letter-spacing: var(--awcag-letter-spacing) !important;
  word-spacing: var(--awcag-word-spacing) !important;
}

html:is(${sel(TEXT_ALIGN_PROFILES)}) p,
html:is(${sel(TEXT_ALIGN_PROFILES)}) li,
html:is(${sel(TEXT_ALIGN_PROFILES)}) blockquote {
  text-align: var(--awcag-text-align) !important;
}

html:is(${sel(MAX_WIDTH_PROFILES)}) p,
html:is(${sel(MAX_WIDTH_PROFILES)}) li,
html:is(${sel(MAX_WIDTH_PROFILES)}) blockquote {
  max-width: var(--awcag-max-line-width);
}

/* Reading-comfort spacing: dyslexia's own (stronger) values, plus every
   profile composing the shared comfortableSpacing module (milder
   values, see src/profiles/adaptations.ts). */
html:is(${sel(SPACING_PROFILES)}) body,
html:is(${sel(SPACING_PROFILES)}) p,
html:is(${sel(SPACING_PROFILES)}) li,
html:is(${sel(SPACING_PROFILES)}) dd,
html:is(${sel(SPACING_PROFILES)}) blockquote {
  line-height: var(--awcag-line-height) !important;
}

html:is(${sel(SPACING_PROFILES)}) p,
html:is(${sel(SPACING_PROFILES)}) li,
html:is(${sel(SPACING_PROFILES)}) blockquote {
  margin-bottom: var(--awcag-paragraph-spacing);
}

html:is(${sel(FONT_SCALE_PROFILES)}) {
  font-size: calc(100% * var(--awcag-font-scale, 1));
}

/* Shared visual filter resource: several profiles boost contrast,
   several others soften it. Only one value ever renders per element,
   so the ConflictResolver's tier ordering picks the winner when
   several of these profiles are active together. */
html:is(${sel(VISUAL_FILTER_PROFILES)}) body {
  filter: var(--awcag-visual-filter);
}

html[data-awcag-low-vision] svg {
  transform: scale(var(--awcag-icon-scale));
  transform-origin: center;
}

html:is(${sel(BORDER_PROFILES)}) button,
html:is(${sel(BORDER_PROFILES)}) input,
html:is(${sel(BORDER_PROFILES)}) select,
html:is(${sel(BORDER_PROFILES)}) textarea,
html:is(${sel(BORDER_PROFILES)}) [role='button'] {
  border-width: var(--awcag-border-width) !important;
  border-style: solid;
}

/* Color blindness: don't rely on link color alone (WCAG 1.4.1). */
html[data-awcag-color-blindness] a {
  text-decoration: underline !important;
  text-underline-offset: 2px;
}

html:is(${sel(CONTROL_SIZE_PROFILES)}) button,
html:is(${sel(CONTROL_SIZE_PROFILES)}) input,
html:is(${sel(CONTROL_SIZE_PROFILES)}) select,
html:is(${sel(CONTROL_SIZE_PROFILES)}) textarea,
html:is(${sel(CONTROL_SIZE_PROFILES)}) [role='button'] {
  min-height: var(--awcag-control-min-size);
  min-width: var(--awcag-control-min-size);
}

html[data-awcag-voice-command] button,
html[data-awcag-voice-command] input,
html[data-awcag-voice-command] [role='button'] {
  margin: var(--awcag-control-spacing) !important;
}

/* Shared reducedMotion module. */
html:is(${sel(MOTION_PROFILES)}) *,
html:is(${sel(MOTION_PROFILES)}) *::before,
html:is(${sel(MOTION_PROFILES)}) *::after {
  animation-duration: var(--awcag-animation-duration) !important;
  animation-iteration-count: 1 !important;
  transition-duration: var(--awcag-transition-duration) !important;
  scroll-behavior: auto !important;
  box-shadow: none !important;
  text-shadow: none !important;
  background-attachment: initial !important;
}

/* Shared simplifiedFocus module (and keyboard-only's stronger override
   of the same variables). */
html:is(${sel(FOCUS_PROFILES)}) :focus-visible {
  outline-width: var(--awcag-focus-outline-width) !important;
  outline-style: var(--awcag-focus-outline-style) !important;
  outline-color: currentColor !important;
  outline-offset: 2px !important;
}

/* Hearing impairment: purely structural, no CSS variables involved. */
html[data-awcag-hearing-impairment] video::cue {
  font-size: 1.3em !important;
  background: rgba(0, 0, 0, 0.85) !important;
  color: #fff !important;
}

html[data-awcag-hearing-impairment] [aria-live],
html[data-awcag-hearing-impairment] [role='alert'],
html[data-awcag-hearing-impairment] [role='status'] {
  outline: 3px solid currentColor !important;
  outline-offset: 2px !important;
}
`.trim();

const BASE_STYLESHEET_ID = 'awcag-base-styles';

export function injectBaseStylesheet(doc: Document = document): void {
  if (doc.getElementById(BASE_STYLESHEET_ID)) return;
  const style = doc.createElement('style');
  style.id = BASE_STYLESHEET_ID;
  style.textContent = BASE_STYLESHEET;
  doc.head.appendChild(style);
}

export function removeBaseStylesheet(doc: Document = document): void {
  doc.getElementById(BASE_STYLESHEET_ID)?.remove();
}
