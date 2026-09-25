/**
 * The Dyslexia profile sets --awcag-font-family to
 * "'OpenDyslexic', 'Comic Sans MS', sans-serif" (see src/profiles/dyslexia.ts),
 * but OpenDyslexic isn't a font any browser ships — without this, the
 * rule silently falls through to 'Comic Sans MS' (rarely installed
 * outside Windows) and then the page's ordinary sans-serif, so the
 * profile's most visible adaptation may render as a no-op.
 *
 * Not called by init() automatically: this library otherwise makes
 * zero network requests on its own, and forcing a third-party CDN
 * fetch on every site that enables the Dyslexia profile would break
 * that guarantee (and any strict CSP). Call this explicitly — with
 * your own self-hosted stylesheet URL if the default CDN doesn't fit —
 * to actually get OpenDyslexic to render.
 */
const DEFAULT_OPEN_DYSLEXIC_CSS_URL = 'https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic/index.css';
const DYSLEXIA_FONT_LINK_ID = 'awcag-dyslexia-font';

/**
 * Loads a stylesheet of `@font-face { font-family: 'OpenDyslexic'; ... }`
 * rules so the Dyslexia profile's font swap actually takes effect.
 * Idempotent. Defaults to the jsDelivr-hosted `@fontsource/opendyslexic`
 * CSS (a third-party request) — pass your own self-hosted URL instead
 * if that CDN or the extra request isn't acceptable for your site.
 */
export function loadDyslexiaFont(url: string = DEFAULT_OPEN_DYSLEXIC_CSS_URL, doc: Document = document): void {
  if (doc.getElementById(DYSLEXIA_FONT_LINK_ID)) return;
  const link = doc.createElement('link');
  link.id = DYSLEXIA_FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = url;
  doc.head.appendChild(link);
}

export function removeDyslexiaFont(doc: Document = document): void {
  doc.getElementById(DYSLEXIA_FONT_LINK_ID)?.remove();
}
