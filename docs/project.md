# Adaptive WCAG

> An intelligent accessibility engine that automatically adapts any website to the user's needs.

---

# Vision

Adaptive WCAG is an open-source accessibility library designed to improve the user experience for people with disabilities or specific accessibility needs.

Unlike traditional accessibility widgets that expose dozens of technical settings (font size, colors, spacing, contrast...), Adaptive WCAG asks only one question:

> **"What are your accessibility needs?"**

The library automatically applies the most appropriate interface adaptations without requiring technical knowledge from the user.

The goal is to make accessibility effortless.

---

# Philosophy

Most accessibility widgets require users to understand accessibility techniques.

Example:

- Increase font size
- Increase line spacing
- Increase contrast
- Change font
- Disable animations

For many users this is confusing.

Adaptive WCAG instead works with **profiles**.

Example:

☑ Dyslexia

☑ Autism

☑ Low vision

☑ Essential tremor

The engine automatically combines the required adaptations.

No configuration.

No technical vocabulary.

No trial and error.

---

# Objectives

- Improve accessibility on any website.
- Require zero technical knowledge from end users.
- Be installable on any web project.
- Work with any JavaScript framework.
- Be lightweight.
- Be fully open source.
- Respect WCAG recommendations.
- Combine multiple accessibility profiles simultaneously.

---

# Installation Targets

Adaptive WCAG should work with:

- HTML
- React
- Vue
- Angular
- Svelte
- Next.js
- Nuxt
- Laravel
- Symfony
- WordPress
- Astro

The core engine must remain framework-independent.

---

# Main Components

## Core Engine

Responsible for:

- profile management
- adaptation engine
- conflict resolution
- DOM manipulation
- persistence
- event system

---

## User Interface

Provides:

- floating accessibility button
- accessibility panel
- profile selector
- accessibility information

The UI remains optional.

Developers may create their own interface.

---

## Adaptation Engine

Receives selected profiles.

Example:

Dyslexia

-

Autism

-

Low Vision

↓

Produces one unified interface configuration.

---

## Persistence

Selected profiles are automatically saved.

Possible storage:

- localStorage
- sessionStorage
- custom storage adapter

After reopening the website, adaptations are immediately restored.

---

# Accessibility Profiles

Profiles represent user needs.

Each profile activates a predefined collection of interface adaptations.

Users never configure individual settings.

---

## Dyslexia

Objectives

- Improve reading comfort
- Reduce visual confusion
- Improve text tracking

Possible adaptations

- dyslexia-friendly font
- increased line spacing
- increased letter spacing
- increased paragraph spacing
- left aligned text
- limited paragraph width
- slightly larger font size
- improved contrast

---

## Low Vision

Objectives

Improve readability.

Possible adaptations

- larger text
- stronger contrast
- larger icons
- thicker borders
- enlarged buttons
- larger clickable areas

---

## Color Blindness

Objectives

Improve perception of visual information.

Possible adaptations

- remove color-only indicators
- improve visual differentiation
- stronger outlines
- additional icons where possible

---

## Photophobia

Objectives

Reduce visual fatigue.

Possible adaptations

- softer colors
- reduced brightness
- reduced saturation
- remove flashing elements

---

## Autism Spectrum

Objectives

Reduce cognitive overload.

Possible adaptations

- disable decorative animations
- reduce visual noise
- simplify focus styles
- reduce transitions
- stabilize layouts
- reduce unnecessary visual effects

---

## ADHD

Objectives

Improve concentration.

Possible adaptations

- remove distracting animations
- simplify interface
- improve reading focus
- highlight active elements
- reduce competing visual elements

---

## Motor Disabilities

Objectives

Improve interaction.

Possible adaptations

- larger buttons
- larger links
- larger form controls
- larger spacing
- improved focus indicators

---

## Hearing Impairment

Objectives

Improve access to multimedia.

Possible adaptations

- highlight captions
- highlight transcripts
- emphasize visual notifications

---

# Combining Profiles

Users may activate multiple profiles simultaneously.

Example

Dyslexia

-

Low Vision

-

ADHD

The engine merges every adaptation.

If two adaptations conflict, the engine applies predefined priority rules.

Example

Animation duration

Autism → disabled

General profile → enabled

Result

Animations remain disabled.

---

# Conflict Resolution

The engine contains predefined priorities.

Accessibility always has priority over aesthetics.

Safety always has priority over visual effects.

Readability always has priority over layout.

---

# Principles

Adaptive WCAG never asks users to choose:

- fonts
- colors
- spacing
- contrast
- cursor size

The engine makes these decisions automatically according to accessibility research and best practices.

---

# Developer API

Example

```javascript
AdaptiveWCAG.init();
```

Enable default interface.

---

```javascript
AdaptiveWCAG.init({
    ui: false,
});
```

Engine only.

---

```javascript
AdaptiveWCAG.open();
```

Open accessibility panel.

---

```javascript
AdaptiveWCAG.close();
```

Close accessibility panel.

---

```javascript
AdaptiveWCAG.enable("dyslexia");
```

Enable one profile.

---

```javascript
AdaptiveWCAG.disable("dyslexia");
```

Disable one profile.

---

```javascript
AdaptiveWCAG.getProfiles();
```

Return active profiles.

---

# Events

Example

```javascript
AdaptiveWCAG.on("profileEnabled");
```

```javascript
AdaptiveWCAG.on("profileDisabled");
```

```javascript
AdaptiveWCAG.on("updated");
```

---

# Performance Goals

- Lightweight
- Lazy loaded UI
- No framework dependency
- Minimal DOM manipulation
- CSS-first architecture
- Smooth transitions

---

# Accessibility Goals

The project itself must satisfy:

- WCAG 2.2 AA
- keyboard navigation
- screen readers
- reduced motion preferences
- high contrast compatibility

---

# Browser Support

Modern browsers:

- Chrome
- Firefox
- Edge
- Safari
- Brave
- Opera

---

# Future Roadmap

## Version 1

Core engine

React package

Default UI

Profiles

Persistence

---

## Version 2

Vue package

Angular package

WordPress plugin

Laravel package

---

## Version 3

Community-created profiles

Analytics API

Accessibility reports

Developer tools

---

# License

MIT License

---

# Mission

Accessibility should not require expertise.

Users should only describe their needs.

Adaptive WCAG handles the rest.
