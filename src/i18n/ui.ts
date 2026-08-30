import { CATEGORY_LABELS, type ProfileCategory } from '../core/types';
import type { Locale } from './types';

export interface UiStrings {
  toggleOpenLabel: string;
  toggleCloseLabel: string;
  panelTitle: string;
  categoryLabels: Record<ProfileCategory, string>;
}

export const UI_STRINGS: Record<Locale, UiStrings> = {
  en: {
    toggleOpenLabel: 'Open accessibility settings',
    toggleCloseLabel: 'Close accessibility settings',
    panelTitle: 'Accessibility needs',
    categoryLabels: CATEGORY_LABELS,
  },
  fr: {
    toggleOpenLabel: "Ouvrir les paramètres d'accessibilité",
    toggleCloseLabel: "Fermer les paramètres d'accessibilité",
    panelTitle: "Besoins d'accessibilité",
    categoryLabels: {
      vision: 'Vision',
      reading: 'Lecture',
      cognitive: 'Cognitif',
      motor: 'Motricité',
      hearing: 'Audition',
      sensory: 'Sensoriel',
      aging: 'Âge',
    },
  },
  fi: {
    toggleOpenLabel: 'Avaa saavutettavuusasetukset',
    toggleCloseLabel: 'Sulje saavutettavuusasetukset',
    panelTitle: 'Saavutettavuustarpeet',
    categoryLabels: {
      vision: 'Näkö',
      reading: 'Lukeminen',
      cognitive: 'Kognitiivinen',
      motor: 'Motoriikka',
      hearing: 'Kuulo',
      sensory: 'Aistit',
      aging: 'Ikääntyminen',
    },
  },
};
