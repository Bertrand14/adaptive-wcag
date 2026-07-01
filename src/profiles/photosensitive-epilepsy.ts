import type { Profile } from '../core/types';
import { reducedMotion } from './adaptations';

function pauseAutoplayingMedia(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLMediaElement>('video[autoplay], audio[autoplay]').forEach((el) => el.pause());
}

export const photosensitiveEpilepsyProfile: Profile = {
  id: 'photosensitive-epilepsy',
  label: 'Photosensitive Epilepsy',
  description: 'Immediately stops animations, transitions, and autoplaying media that can trigger seizures.',
  category: 'sensory',
  htmlAttribute: 'data-awcag-photosensitive-epilepsy',
  rules: [...reducedMotion],
  // One-shot: pauses whatever autoplaying <video>/<audio> exists at
  // activation time. This is the one profile that needs a real DOM
  // side effect rather than a CSS variable — see Profile.onActivate's
  // doc comment for why that's an intentional, bounded exception.
  // Media inserted afterwards (e.g. by an SPA) isn't caught; not undone
  // on disable, since there's no safe way to know if resuming playback
  // is actually wanted.
  onActivate: pauseAutoplayingMedia,
};
