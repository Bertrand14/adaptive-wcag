import type { EventBus } from '../core/EventBus';
import type { ProfileManager } from '../core/ProfileManager';
import type { Profile, ProfileCategory } from '../core/types';
import { getUiStrings, translateProfile, type Locale, type UiStrings } from '../i18n';

const CATEGORY_ORDER: ProfileCategory[] = ['vision', 'reading', 'cognitive', 'motor', 'hearing', 'sensory', 'aging'];

const PANEL_STYLESHEET = `
:host {
  all: initial;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  color-scheme: light;
}
.awcag-toggle {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 2147483000;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  border: 2px solid #1a1a1a;
  background: #ffffff;
  color: #1a1a1a;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.awcag-toggle:focus-visible,
.awcag-panel a:focus-visible,
.awcag-panel button:focus-visible,
.awcag-panel input:focus-visible {
  outline: 3px solid #0b63ce;
  outline-offset: 2px;
}
.awcag-panel {
  position: fixed;
  bottom: 5rem;
  right: 1.25rem;
  z-index: 2147483000;
  width: min(20rem, calc(100vw - 2.5rem));
  max-height: 70vh;
  overflow-y: auto;
  background: #ffffff;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 1rem;
}
.awcag-panel[hidden] {
  display: none;
}
.awcag-panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
}
.awcag-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}
.awcag-category {
  border: none;
  margin: 0 0 1rem;
  padding: 0;
}
.awcag-category:last-of-type {
  margin-bottom: 0;
}
.awcag-category legend {
  padding: 0;
  margin-bottom: 0.15rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}
.awcag-profile {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid #e0e0e0;
}
.awcag-profile:first-of-type {
  border-top: none;
}
.awcag-profile input {
  margin-top: 0.2rem;
  width: 1.1rem;
  height: 1.1rem;
}
.awcag-profile label {
  font-weight: 600;
  cursor: pointer;
}
.awcag-profile p {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: #444;
}
`;

/**
 * Floating button + panel, rendered in a Shadow DOM so its own styles
 * never leak into (or get overridden by) the host page. Manages focus
 * itself: traps Tab while open, restores focus to the toggle on close,
 * closes on Escape.
 */
export class Panel {
  private host: HTMLElement;
  private shadow: ShadowRoot;
  private panelEl: HTMLDivElement;
  private toggleButton: HTMLButtonElement;
  private checkboxes = new Map<string, HTMLInputElement>();
  private isOpen = false;
  private lastFocused: HTMLElement | null = null;
  private unsubscribe: () => void;
  private strings: UiStrings;

  constructor(
    private manager: ProfileManager,
    private events: EventBus,
    container: Element | ShadowRoot = document.body,
    private locale: Locale = 'en',
  ) {
    this.strings = getUiStrings(locale);
    this.host = document.createElement('div');
    this.shadow = this.host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = PANEL_STYLESHEET;
    this.shadow.appendChild(style);

    this.toggleButton = this.buildToggleButton();
    this.panelEl = this.buildPanel();

    this.shadow.appendChild(this.toggleButton);
    this.shadow.appendChild(this.panelEl);
    container.appendChild(this.host);

    (this.shadow as unknown as EventTarget).addEventListener('keydown', this.onKeydown);
    this.unsubscribe = this.events.on('updated', () => this.syncCheckboxes());
  }

  private buildToggleButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'awcag-toggle';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', this.strings.toggleOpenLabel);
    button.textContent = '♿';
    button.addEventListener('click', () => this.toggle());
    return button;
  }

  private buildPanel(): HTMLDivElement {
    const panel = document.createElement('div');
    panel.className = 'awcag-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'awcag-panel-title');
    panel.hidden = true;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'awcag-close';
    closeButton.setAttribute('aria-label', this.strings.toggleCloseLabel);
    closeButton.textContent = '✕';
    closeButton.addEventListener('click', () => this.close());
    panel.appendChild(closeButton);

    const title = document.createElement('h2');
    title.id = 'awcag-panel-title';
    title.textContent = this.strings.panelTitle;
    panel.appendChild(title);

    const byCategory = new Map<ProfileCategory, Profile[]>();
    for (const profile of this.manager.getCatalog()) {
      const group = byCategory.get(profile.category) ?? [];
      group.push(profile);
      byCategory.set(profile.category, group);
    }

    for (const category of CATEGORY_ORDER) {
      const profiles = byCategory.get(category);
      if (profiles?.length) panel.appendChild(this.buildCategoryGroup(category, profiles));
    }

    return panel;
  }

  private buildCategoryGroup(category: ProfileCategory, profiles: Profile[]): HTMLFieldSetElement {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'awcag-category';

    const legend = document.createElement('legend');
    legend.textContent = this.strings.categoryLabels[category];
    fieldset.appendChild(legend);

    for (const profile of profiles) {
      fieldset.appendChild(this.buildProfileRow(profile));
    }

    return fieldset;
  }

  private buildProfileRow(profile: Profile): HTMLDivElement {
    const row = document.createElement('div');
    row.className = 'awcag-profile';

    const checkboxId = `awcag-checkbox-${profile.id}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = this.manager.isActive(profile.id);
    checkbox.addEventListener('change', () => this.manager.toggle(profile.id));
    this.checkboxes.set(profile.id, checkbox);

    const text = translateProfile(this.locale, profile);
    const textWrap = document.createElement('div');
    const label = document.createElement('label');
    label.setAttribute('for', checkboxId);
    label.textContent = text.label;
    const description = document.createElement('p');
    description.textContent = text.description;
    textWrap.appendChild(label);
    textWrap.appendChild(description);

    row.appendChild(checkbox);
    row.appendChild(textWrap);
    return row;
  }

  private syncCheckboxes(): void {
    for (const [id, checkbox] of this.checkboxes) {
      checkbox.checked = this.manager.isActive(id);
    }
  }

  private getFocusable(): HTMLElement[] {
    return Array.from(this.panelEl.querySelectorAll<HTMLElement>('button, input, a[href], [tabindex]'));
  }

  private onKeydown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!this.isOpen) return;
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.close();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = this.getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const activeInShadow = this.shadow.activeElement as HTMLElement | null;

    if (event.shiftKey && activeInShadow === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeInShadow === last) {
      event.preventDefault();
      first.focus();
    }
  };

  open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    // For an open shadow root, document.activeElement resolves to the
    // shadow host (not the focused element inside it) when focus is
    // already within our own tree — e.g. right after clicking the
    // toggle button. Treat that case as "no external focus to restore"
    // so close() falls back to the toggle button instead of trying to
    // focus a non-focusable host div.
    const active = document.activeElement as HTMLElement | null;
    this.lastFocused = active === this.host ? null : active;
    this.panelEl.hidden = false;
    this.toggleButton.setAttribute('aria-expanded', 'true');
    this.getFocusable()[0]?.focus();
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.panelEl.hidden = true;
    this.toggleButton.setAttribute('aria-expanded', 'false');
    (this.lastFocused ?? this.toggleButton).focus();
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  destroy(): void {
    this.unsubscribe();
    this.host.remove();
  }
}
