/**
 * Translated `label`/`description` per profile id. English isn't listed
 * here: it lives directly on each `Profile` object in `../profiles/*` and
 * is used as-is (and as the fallback when a locale is missing an id, e.g.
 * a profile added before its translation was written).
 */

interface ProfileText {
  label: string;
  description: string;
}

export const PROFILE_TRANSLATIONS: Record<'fr' | 'fi', Record<string, ProfileText>> = {
  fr: {
    adhd: {
      label: 'TDAH',
      description: "Supprime les distractions animées et met en évidence l'élément actif pour favoriser la concentration.",
    },
    aphasia: {
      label: 'Aphasie',
      description: 'Supprime les distractions visuelles et les animations pour faciliter la compréhension.',
    },
    autism: {
      label: 'Trouble du spectre autistique',
      description: 'Réduit la surcharge cognitive en stabilisant la mise en page et en limitant les effets visuels.',
    },
    cataract: {
      label: 'Cataracte',
      description: 'Renforce le contraste, la taille du texte et les bordures pour les yeux sensibles au faible contraste.',
    },
    'cognitive-difficulties': {
      label: 'Difficultés cognitives',
      description: 'Réduit les distractions et le bruit visuel pour faciliter la concentration et la lecture.',
    },
    'cognitive-fatigue': {
      label: 'Fatigue cognitive',
      description: "Supprime les animations et ajoute de l'espacement pour réduire la charge mentale lors de sessions longues.",
    },
    'color-blindness': {
      label: 'Daltonisme',
      description: 'Ne repose plus uniquement sur la couleur : souligne les liens et renforce les bordures et contours de focus.',
    },
    dyslexia: {
      label: 'Dyslexie',
      description: 'Améliore le confort de lecture, le suivi du texte et réduit la confusion visuelle.',
    },
    'hearing-impairment': {
      label: 'Déficience auditive',
      description: "Rend les sous-titres natifs et les notifications visuelles (zones ARIA live/alertes) plus faciles à repérer.",
    },
    'keyboard-only': {
      label: 'Clavier uniquement',
      description: "Rend l'élément actif impossible à manquer pour les personnes qui n'utilisent jamais de souris.",
    },
    'low-vision': {
      label: 'Basse vision',
      description: 'Améliore la lisibilité grâce à un texte plus grand, un contraste renforcé et des cibles plus grandes.',
    },
    'macular-degeneration': {
      label: 'Dégénérescence maculaire',
      description: 'Agrandit le texte et les contrôles et ajoute de l\'espace pour la perte de vision centrale.',
    },
    'memory-difficulties': {
      label: 'Difficultés de mémoire',
      description: "Garde l'interface stable et prévisible : aucune animation, repères de focus cohérents.",
    },
    migraine: {
      label: 'Migraine',
      description: 'Réduit les déclencheurs courants de migraine : animations, contraste violent et lumière vive.',
    },
    'motor-disability': {
      label: 'Handicap moteur',
      description: 'Agrandit les boutons, liens et champs de formulaire, et ajoute de l\'espacement entre eux.',
    },
    photophobia: {
      label: 'Photophobie',
      description: 'Adoucit la luminosité, la saturation et les animations pour les yeux sensibles à la lumière.',
    },
    'photosensitive-epilepsy': {
      label: 'Épilepsie photosensible',
      description: 'Arrête immédiatement les animations, transitions et médias en lecture automatique pouvant déclencher des crises.',
    },
    'reading-difficulties': {
      label: 'Difficultés de lecture',
      description: "Améliore l'espacement, l'alignement et la taille du texte pour les lecteurs en difficulté sans être dyslexiques.",
    },
    senior: {
      label: 'Senior',
      description: "Une combinaison douce de texte plus grand, meilleur contraste, contrôles plus grands et moins d'animations.",
    },
    tremor: {
      label: 'Tremblements',
      description: "Utilise des contrôles très grands et bien espacés pour les mains qui ne peuvent pas viser une petite cible de façon fiable.",
    },
    'tunnel-vision': {
      label: 'Vision tunnel',
      description: "Réduit la largeur du contenu et ajoute de l'espacement pour limiter ce qui doit être balayé en périphérie.",
    },
    'visual-fatigue': {
      label: 'Fatigue visuelle',
      description: "Soulage la fatigue oculaire lors de longues sessions de lecture grâce à un contraste plus doux, un texte plus grand et plus d'espace.",
    },
    'voice-command': {
      label: 'Commande vocale',
      description: 'Agrandit et espace les éléments interactifs pour un ciblage vocal fiable.',
    },
  },
  fi: {
    adhd: {
      label: 'ADHD',
      description: 'Poistaa häiritsevän liikkeen ja korostaa aktiivisen elementin keskittymisen tueksi.',
    },
    aphasia: {
      label: 'Afasia',
      description: 'Poistaa visuaaliset häiriötekijät ja liikkeen ymmärtämisen helpottamiseksi.',
    },
    autism: {
      label: 'Autismikirjo',
      description: 'Vähentää kognitiivista kuormitusta vakauttamalla asettelun ja rajoittamalla visuaalisia efektejä.',
    },
    cataract: {
      label: 'Kaihi',
      description: 'Lisää kontrastia ja tekstin kokoa sekä vahvistaa reunoja silmille, joilla on vaikeuksia matalan kontrastin sisällön kanssa.',
    },
    'cognitive-difficulties': {
      label: 'Kognitiiviset vaikeudet',
      description: 'Vähentää häiriötekijöitä ja visuaalista kohinaa keskittymisen ja lukemisen helpottamiseksi.',
    },
    'cognitive-fatigue': {
      label: 'Kognitiivinen väsymys',
      description: 'Poistaa liikkeen ja lisää tilaa vähentääkseen henkistä kuormaa pitkien istuntojen aikana.',
    },
    'color-blindness': {
      label: 'Värisokeus',
      description: 'Ei enää luota pelkkään väriin: alleviivaa linkit ja vahvistaa reunat ja fokusääriviivat.',
    },
    dyslexia: {
      label: 'Lukihäiriö',
      description: 'Parantaa lukumukavuutta ja tekstin seurattavuutta sekä vähentää visuaalista sekaannusta.',
    },
    'hearing-impairment': {
      label: 'Kuulovamma',
      description: 'Tekee natiiveista tekstityksistä ja visuaalisista ilmoituksista (ARIA live -alueet/hälytykset) helpommin huomattavia.',
    },
    'keyboard-only': {
      label: 'Vain näppäimistö',
      description: 'Tekee aktiivisesta elementistä mahdotonta jäädä huomaamatta niille, jotka eivät koskaan käytä hiirtä.',
    },
    'low-vision': {
      label: 'Heikkonäköisyys',
      description: 'Parantaa luettavuutta suuremman tekstin, vahvemman kontrastin ja suurempien kohteiden avulla.',
    },
    'macular-degeneration': {
      label: 'Silmänpohjan rappeuma',
      description: 'Suurentaa tekstiä ja ohjaimia sekä lisää tilaa keskeisen näön menetyksen vuoksi.',
    },
    'memory-difficulties': {
      label: 'Muistivaikeudet',
      description: 'Pitää käyttöliittymän vakaana ja ennustettavana: ei liikettä, johdonmukaiset fokusmerkit.',
    },
    migraine: {
      label: 'Migreeni',
      description: 'Vähentää yleisiä migreenin laukaisijoita: liikettä, voimakasta kontrastia ja kirkasta valoa.',
    },
    'motor-disability': {
      label: 'Liikuntarajoite',
      description: 'Suurentaa painikkeita, linkkejä ja lomakekenttiä sekä lisää niiden väliin tilaa.',
    },
    photophobia: {
      label: 'Valonarkuus',
      description: 'Pehmentää kirkkautta, kylläisyyttä ja liikettä valolle herkille silmille.',
    },
    'photosensitive-epilepsy': {
      label: 'Valoherkkä epilepsia',
      description: 'Pysäyttää välittömästi animaatiot, siirtymät ja automaattisesti toistettavan median, jotka voivat laukaista kohtauksia.',
    },
    'reading-difficulties': {
      label: 'Lukemisen vaikeudet',
      description: 'Parantaa tekstin välistystä, tasausta ja kokoa lukijoille, joilla on vaikeuksia ilman lukihäiriötä.',
    },
    senior: {
      label: 'Seniori',
      description: 'Lempeä yhdistelmä suurempaa tekstiä, parempaa kontrastia, suurempia ohjaimia ja vähemmän liikettä.',
    },
    tremor: {
      label: 'Vapina',
      description: 'Käyttää erittäin suuria ja hyvin aseteltuja ohjaimia käsille, jotka eivät voi luotettavasti osua pieneen kohteeseen.',
    },
    'tunnel-vision': {
      label: 'Putkinäkö',
      description: 'Kaventaa sisällön leveyttä ja lisää tilaa, jotta reunalla tarvitsee silmäillä vähemmän.',
    },
    'visual-fatigue': {
      label: 'Silmien väsymys',
      description: 'Helpottaa silmien rasitusta pitkissä lukuistunnoissa pehmeämmän kontrastin, suuremman tekstin ja enemmän tilan avulla.',
    },
    'voice-command': {
      label: 'Äänikomento',
      description: 'Suurentaa ja välistää interaktiiviset elementit luotettavan äänikohdistuksen mahdollistamiseksi.',
    },
  },
};
