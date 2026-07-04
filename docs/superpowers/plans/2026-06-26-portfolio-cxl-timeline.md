# Portfolio CXL — Concept Timeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le portfolio one-page de Calixte Janssens (CXL), monteuse vidéo, sur le concept « Timeline » (métaphore de montage subtile), en Astro statique déployable sur GitHub Pages.

**Architecture:** Site Astro statique, one-page. Sections rendues côté serveur (`.astro`), interactivité en **vanilla TypeScript** via scripts client Astro. Le playhead/progression et les reveals utilisent les fonctions vanilla de `motion` (`scroll`, `inView`, `animate`) ; aucun framework UI (pas de React). Données de contenu centralisées dans `src/data/`. Thème dark verrouillé, accent ambre unique.

**Tech Stack:** Astro 5, Tailwind v4 (plugin Vite), `motion` (vanilla), GSAP + ScrollTrigger (réservé si scrub/pin nécessaire), TypeScript, déploiement GitHub Pages via GitHub Actions.

## Global Constraints

- **Hébergement** : GitHub Pages, repo `portfolio-cxl` sous `joe-jns` → `astro.config.mjs` doit avoir `site: 'https://joe-jns.github.io'` et `base: '/portfolio-cxl'`. Tous les liens internes/assets passent par `import.meta.env.BASE_URL`.
- **Thème** : dark sur TOUTE la page. Base off-black `#0a0a0b`, jamais `#000000`. Texte blanc-os `#ECEAE4`, jamais blanc pur.
- **Accent unique** : ambre safelight `#F5C33B`. Aucun autre accent coloré nulle part (playhead, liens, focus, CTA, marqueurs).
- **Zéro em-dash (`—`) et zéro en-dash (`–`)** dans tout texte visible. Hyphen `-` uniquement.
- **Typo** : display grotesk self-hosté + un mono pour timecodes/données. `font-display: swap`. Jamais de `<link>` Google Fonts.
- **Motion** : jamais `window.addEventListener('scroll')`. Tout `prefers-reduced-motion: reduce` dégrade en statique. Animer uniquement `transform`/`opacity`.
- **Viewport** : `min-h-[100dvh]`, jamais `h-screen`.
- **Vidéos** : placeholders labellisés `<!-- TODO: ... -->`, `muted loop playsinline preload="none"`, `poster` réservé pour éviter le CLS.
- **Un seul système de radius**, max 1 marquee sur la page, eyebrows ≤ 1 par 3 sections.

---

### Task 1: Scaffold projet Astro + Tailwind v4 + dépendances

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro` (placeholder minimal)
- Create: `.gitignore`

**Interfaces:**
- Produces: projet Astro buildable ; `src/styles/global.css` importé globalement ; `BASE_URL` configuré.

- [ ] **Step 1: Installer Astro et dépendances**

Run dans `C:/Users/micro/portfolio-cxl` :
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --yes
npm install
npm install tailwindcss @tailwindcss/vite motion gsap
```
Si `npm create` refuse car le dossier n'est pas vide (docs/ présent), créer manuellement `package.json` :
```json
{
  "name": "portfolio-cxl",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "motion": "^11.0.0",
    "gsap": "^3.12.0"
  }
}
```
puis `npm install`.

- [ ] **Step 2: Configurer Astro (GitHub Pages + Tailwind Vite plugin)**

Create `astro.config.mjs` :
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://joe-jns.github.io',
  base: '/portfolio-cxl',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Global CSS avec Tailwind v4**

Create `src/styles/global.css` :
```css
@import "tailwindcss";
```

- [ ] **Step 4: Page placeholder + import du CSS**

Create `src/pages/index.astro` :
```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CXL — Calixte Janssens</title>
  </head>
  <body class="bg-[#0a0a0b] text-[#ECEAE4]">
    <h1 class="p-8 text-4xl">CXL — build OK</h1>
  </body>
</html>
```

- [ ] **Step 5: Vérifier dev + build**

Run :
```bash
npm run dev
```
Expected : serveur sur `http://localhost:4321/portfolio-cxl/`, page near-black avec « CXL - build OK » en ambre/blanc. Arrêter le serveur.
```bash
npm run build
```
Expected : `dist/` généré sans erreur.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + Tailwind v4 + motion/gsap, config GitHub Pages"
```

---

### Task 2: Design tokens, typo self-hostée, layout shell

**Files:**
- Create: `src/styles/global.css` (étendre)
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/fonts/` (fichiers woff2 display + mono)
- Modify: `src/pages/index.astro` (utiliser BaseLayout)

**Interfaces:**
- Produces: `BaseLayout.astro` props `{ title: string; description: string }`, slot par défaut pour le contenu ; classes utilitaires de tokens (`--accent`, familles de fonts, échelle radius) disponibles globalement.

- [ ] **Step 1: Télécharger les fonts self-hostées**

Display : un grotesk caractériel libre (ex. **Cabinet Grotesk** via Fontshare, ou **Space Grotesk** via fontsource). Mono : **JetBrains Mono**.
Approche fontsource (simple) :
```bash
npm install @fontsource-variable/space-grotesk @fontsource-variable/jetbrains-mono
```
(Si on préfère Cabinet Grotesk : télécharger les woff2 depuis Fontshare dans `public/fonts/` et déclarer en `@font-face`. Par défaut on part sur fontsource pour la fiabilité.)

- [ ] **Step 2: Définir les tokens dans global.css**

Replace `src/styles/global.css` :
```css
@import "tailwindcss";
@import "@fontsource-variable/space-grotesk";
@import "@fontsource-variable/jetbrains-mono";

@theme {
  --color-ink: #0a0a0b;
  --color-ink-2: #111113;
  --color-bone: #ECEAE4;
  --color-bone-dim: #9b988f;
  --color-accent: #F5C33B;
  --font-display: "Space Grotesk Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
  --radius: 10px;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-display);
  background: var(--color-ink);
  color: var(--color-bone);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection { background: var(--color-accent); color: var(--color-ink); }

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: BaseLayout**

Create `src/layouts/BaseLayout.astro` :
```astro
---
import '../styles/global.css';
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#0a0a0b" />
    <title>{title}</title>
  </head>
  <body class="min-h-[100dvh] bg-ink text-bone antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 4: index.astro utilise BaseLayout**

Replace `src/pages/index.astro` :
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="CXL — Calixte Janssens, monteuse vidéo" description="Calixte Janssens (CXL), monteuse video et cadreuse a Charleroi. Clips, courts-metrages, contenu de marque.">
  <main class="p-8">
    <h1 class="font-display text-6xl tracking-tighter">CXL</h1>
    <p class="mt-4 font-mono text-sm text-accent">00:00:00</p>
  </main>
</BaseLayout>
```

- [ ] **Step 5: Vérifier rendu fonts + tokens**

Run `npm run dev`. Expected : « CXL » en Space Grotesk, timecode mono ambre, fond near-black. Vérifier en DevTools que `bg-ink` = `#0a0a0b`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: design tokens, fonts self-hostees, BaseLayout dark + accent ambre"
```

---

### Task 3: Couche de données (contenu centralisé)

**Files:**
- Create: `src/data/site.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/chapters.ts`

**Interfaces:**
- Produces :
  - `site` : `{ name, alias, role, location, aboutParagraphs: string[], tools: { postprod: string[]; plateau: string[] }, contact: { email: string; instagram: string; youtube: string } }`
  - `projects` : `Project[]` où `Project = { id: string; title: string; role: string; year: string; format: string; videoSrc: string; poster: string }`
  - `chapters` : `Chapter[]` où `Chapter = { code: string; label: string; targetId: string }`

- [ ] **Step 1: site.ts (texte verbatim conservé)**

Create `src/data/site.ts` :
```ts
export const site = {
  name: "Calixte Janssens",
  alias: "CXL",
  role: "Monteuse video & cadreuse",
  location: "Charleroi, Belgique",
  aboutParagraphs: [
    "Je m'appelle Calixte, alias CXL, monteuse video passionnee, basee en Belgique. Depuis plus d'un an, je travaille sur des projets varies : clips musicaux, courts-metrages, contenus de marque et re-montages creatifs.",
    "Mon approche va au-dela du simple decoupage. Je construis des sequences qui respirent, des transitions qui ont du sens, une colorimetrie qui soutient l'emotion. Chaque projet est une partition que j'orchestre image par image.",
    "Actuellement en preparation pour integrer une ecole d'audiovisuel en Belgique, je consolide chaque jour ma maitrise des outils de post-production professionnels.",
  ],
  tools: {
    postprod: ["DaVinci Resolve", "Premiere Pro", "After Effects", "Fusion", "Audition", "Final Cut"],
    plateau: ["Cadrage", "Lumiere", "Prise de son"],
  },
  contact: {
    email: "contact@exemple.be",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
} as const;
```
Note : accents conservés dans le texte affiché (l'absence d'accent ci-dessus est à corriger en vrais accents UTF-8 lors de l'édition réelle ; les chaînes doivent afficher « monteuse vidéo », « basée », etc.). Aucun em-dash.

- [ ] **Step 2: projects.ts (4 placeholders labellisés)**

Create `src/data/projects.ts` :
```ts
export interface Project {
  id: string;
  title: string;
  role: string;
  year: string;
  format: string;
  videoSrc: string;
  poster: string;
}

// TODO: remplacer par les vrais projets de Calixte (video + meta).
export const projects: Project[] = [
  { id: "p1", title: "Clip - a remplacer", role: "Montage, etalonnage", year: "2025", format: "Clip musical", videoSrc: "", poster: "https://picsum.photos/seed/cxl-clip-1/1600/900" },
  { id: "p2", title: "Court-metrage - a remplacer", role: "Montage", year: "2025", format: "Court-metrage", videoSrc: "", poster: "https://picsum.photos/seed/cxl-court-2/1600/900" },
  { id: "p3", title: "Marque - a remplacer", role: "Montage, cadrage", year: "2024", format: "Contenu de marque", videoSrc: "", poster: "https://picsum.photos/seed/cxl-brand-3/1600/900" },
  { id: "p4", title: "Re-montage - a remplacer", role: "Re-montage creatif", year: "2024", format: "Re-edit", videoSrc: "", poster: "https://picsum.photos/seed/cxl-reedit-4/1600/900" },
];
```

- [ ] **Step 3: chapters.ts (navigation timecodes)**

Create `src/data/chapters.ts` :
```ts
export interface Chapter { code: string; label: string; targetId: string; }

export const chapters: Chapter[] = [
  { code: "00:00", label: "Intro", targetId: "hero" },
  { code: "00:12", label: "Travail", targetId: "work" },
  { code: "02:40", label: "A propos", targetId: "about" },
  { code: "03:15", label: "Savoir-faire", targetId: "skills" },
  { code: "04:00", label: "Contact", targetId: "contact" },
];
```

- [ ] **Step 4: Vérifier le typage**

Run `npm run check`. Expected : 0 erreur TypeScript.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: couche de donnees (site, projets placeholders, chapitres)"
```

---

### Task 4: Section Hero (00:00)

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes : `site` (name, alias, role, location).
- Produces : section `id="hero"` ; CTA `<a href="#work">` (intent unique « voir le travail »).

- [ ] **Step 1: Composant Hero**

Create `src/components/Hero.astro` :
```astro
---
import { site } from '../data/site';
---
<section id="hero" class="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-6 pb-16 pt-24 md:px-10 md:pb-20">
  <!-- TODO: remplacer par le reel de fond (video muet autoplay). -->
  <video
    class="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
    autoplay muted loop playsinline preload="none"
    poster="https://picsum.photos/seed/cxl-hero-reel/1920/1080"
    aria-hidden="true"
  ></video>
  <div class="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30"></div>

  <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">00:00 / {site.location}</p>
  <h1 class="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tighter md:text-7xl">
    {site.alias}<span class="text-bone-dim">.</span>
    <span class="block text-bone-dim">{site.name}</span>
  </h1>
  <p class="mt-5 max-w-[42ch] text-lg text-bone-dim md:text-xl">{site.role}. Le montage comme rythme, la couleur comme emotion.</p>
  <div class="mt-8">
    <a href="#work" class="inline-flex items-center gap-2 rounded-[10px] bg-accent px-6 py-3 font-mono text-sm font-medium text-ink transition-transform active:translate-y-[1px] hover:bg-accent/90">
      Voir le travail
    </a>
  </div>
</section>
```
Vérifier : headline ≤ 2 lignes desktop, sous-texte ≤ 20 mots, CTA visible sans scroll, `pt-24` max. Contraste CTA : texte `ink` sur fond `accent` = OK AA.

- [ ] **Step 2: Monter le Hero dans index**

Replace le `<main>` de `src/pages/index.astro` :
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout title="CXL — Calixte Janssens, monteuse vidéo" description="Calixte Janssens (CXL), monteuse video et cadreuse a Charleroi.">
  <main>
    <Hero />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Vérifier visuellement**

Run `npm run dev`. Expected : hero plein écran near-black, poster en fond voilé, « CXL. Calixte Janssens », timecode ambre, bouton ambre lisible, tout tient dans le viewport.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: section hero 00:00 (nom, role, reel de fond placeholder, CTA)"
```

---

### Task 5: Playhead + navigation par timecodes (interactivité)

**Files:**
- Create: `src/components/Playhead.astro`
- Create: `src/scripts/playhead.ts`
- Modify: `src/layouts/BaseLayout.astro` (inclure le Playhead + script)

**Interfaces:**
- Consumes : `chapters`.
- Produces : barre de progression fixe `#playhead-bar` (largeur pilotée par scroll), nav latérale `#chapter-nav` avec ancres cliquables `data-target`. Met à jour l'état actif via IntersectionObserver.

- [ ] **Step 1: Composant Playhead (markup)**

Create `src/components/Playhead.astro` :
```astro
---
import { chapters } from '../data/chapters';
---
<!-- Barre de progression (playhead) en haut -->
<div class="fixed inset-x-0 top-0 z-50 h-[2px] bg-bone/10" aria-hidden="true">
  <div id="playhead-bar" class="h-full w-0 bg-accent"></div>
</div>

<!-- Navigation chapitres (timecodes cliquables) -->
<nav id="chapter-nav" aria-label="Chapitres" class="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
  {chapters.map((c) => (
    <a href={`#${c.targetId}`} data-target={c.targetId}
       class="group flex items-center justify-end gap-2 font-mono text-[11px] text-bone-dim transition-colors hover:text-bone">
      <span class="chapter-label opacity-0 transition-opacity group-hover:opacity-100">{c.label}</span>
      <span class="chapter-code tabular-nums">{c.code}</span>
      <span class="chapter-dot h-2 w-2 rounded-full border border-bone-dim transition-colors"></span>
    </a>
  ))}
</nav>
```

- [ ] **Step 2: Script vanilla (motion scroll + IntersectionObserver)**

Create `src/scripts/playhead.ts` :
```ts
import { scroll } from 'motion';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Progression du playhead pilotee par le scroll (pas de scroll listener manuel).
const bar = document.getElementById('playhead-bar');
if (bar) {
  scroll((progress: number) => {
    bar.style.width = `${progress * 100}%`;
  });
}

// Chapitre actif : surligne le timecode de la section visible.
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#chapter-nav a'));
const byId = new Map(links.map((l) => [l.dataset.target, l]));

const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    links.forEach((l) => {
      l.querySelector('.chapter-dot')?.classList.remove('bg-accent', 'border-accent');
      l.querySelector('.chapter-code')?.classList.remove('text-accent');
    });
    const active = byId.get(entry.target.id);
    active?.querySelector('.chapter-dot')?.classList.add('bg-accent', 'border-accent');
    active?.querySelector('.chapter-code')?.classList.add('text-accent');
  }
}, { rootMargin: '-45% 0px -45% 0px' });

document.querySelectorAll('section[id]').forEach((s) => io.observe(s));

void reduce; // progression reste fonctionnelle meme en reduced-motion (pas d'animation continue)
```

- [ ] **Step 3: Inclure dans BaseLayout**

Modify `src/layouts/BaseLayout.astro` — ajouter dans `<body>` avant `<slot />` et le script après :
```astro
  <body class="min-h-[100dvh] bg-ink text-bone antialiased">
    <Playhead />
    <slot />
    <script>
      import '../scripts/playhead.ts';
    </script>
  </body>
```
et dans le frontmatter : `import Playhead from '../components/Playhead.astro';`

- [ ] **Step 4: Vérifier**

Run `npm run dev`. Ajouter temporairement une 2e section haute (`<section id="work" class="min-h-[100dvh]">`) dans index pour tester le scroll. Expected : barre ambre en haut qui se remplit au scroll ; nav droite avec timecodes ; le timecode de la section visible passe en ambre. Retirer la section temporaire.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: playhead de progression + nav timecodes cliquables (motion scroll + IO)"
```

---

### Task 6: Section Travail (00:12) — clips empilés

**Files:**
- Create: `src/components/Work.astro`
- Create: `src/components/ProjectClip.astro`
- Create: `src/scripts/reveals.ts`
- Modify: `src/pages/index.astro`, `src/layouts/BaseLayout.astro` (import reveals)

**Interfaces:**
- Consumes : `projects` (`Project[]`).
- Produces : section `id="work"` ; chaque projet rendu par `ProjectClip` (props `project: Project`, `index: number`).

- [ ] **Step 1: ProjectClip**

Create `src/components/ProjectClip.astro` :
```astro
---
import type { Project } from '../data/projects';
interface Props { project: Project; index: number; }
const { project, index } = Astro.props;
const num = String(index + 1).padStart(2, '0');
---
<article data-reveal class="group relative min-h-[80vh] overflow-hidden border-t border-bone/10">
  <div class="absolute inset-0 -z-10">
    {project.videoSrc ? (
      <video class="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
             autoplay muted loop playsinline preload="none" poster={project.poster}>
        <source src={project.videoSrc} type="video/mp4" />
      </video>
    ) : (
      <!-- TODO: ajouter project.videoSrc. Poster en attendant. -->
      <img src={project.poster} alt={project.title} loading="lazy"
           class="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-70" />
    )}
    <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>
  </div>

  <div class="flex min-h-[80vh] flex-col justify-end px-6 pb-12 md:px-10 md:pb-16">
    <span class="font-mono text-xs text-accent tabular-nums">{num}</span>
    <h3 class="mt-2 font-display text-3xl font-medium tracking-tight md:text-5xl">{project.title}</h3>
    <p class="mt-3 font-mono text-xs text-bone-dim">
      {project.role} · {project.year} · {project.format}
    </p>
  </div>
</article>
```
Note : `·` utilisé au plus 1 ligne (OK). Pas d'em-dash.

- [ ] **Step 2: Work**

Create `src/components/Work.astro` :
```astro
---
import { projects } from '../data/projects';
import ProjectClip from './ProjectClip.astro';
---
<section id="work" class="relative">
  <header class="px-6 pb-8 pt-20 md:px-10 md:pt-28">
    <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">00:12 / Travail</p>
    <h2 class="mt-3 font-display text-4xl font-medium tracking-tighter md:text-6xl">Selection</h2>
  </header>
  {projects.map((project, i) => <ProjectClip project={project} index={i} />)}
</section>
```

- [ ] **Step 3: Script reveals (motion inView)**

Create `src/scripts/reveals.ts` :
```ts
import { inView, animate } from 'motion';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  if (reduce) { el.style.opacity = '1'; return; }
  el.style.opacity = '0';
  inView(el, () => {
    animate(el, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
      { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
  }, { amount: 0.25 });
});
```

- [ ] **Step 4: Brancher Work + reveals**

Modify `src/pages/index.astro` : ajouter `import Work from '../components/Work.astro';` et `<Work />` après `<Hero />`.
Modify `src/layouts/BaseLayout.astro` : dans le `<script>`, ajouter `import '../scripts/reveals.ts';`.

- [ ] **Step 5: Vérifier**

Run `npm run dev`. Expected : 4 clips plein-cadre empilés, posters Picsum, titres + méta, apparition au scroll, séparateur fin entre clips, nav timecode « Travail » s'active.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: section travail 00:12 (clips empiles, reveals au scroll)"
```

---

### Task 7: Section À propos (02:40)

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes : `site.aboutParagraphs`, `site.role`.
- Produces : section `id="about"`.

- [ ] **Step 1: Composant About**

Create `src/components/About.astro` :
```astro
---
import { site } from '../data/site';
---
<section id="about" class="px-6 py-24 md:px-10 md:py-36">
  <div class="mx-auto max-w-[1100px]">
    <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">02:40 / A propos</p>
    <div class="mt-8 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
      <!-- TODO: portrait optionnel de Calixte. -->
      <img src="https://picsum.photos/seed/cxl-portrait/800/1000" alt="Portrait de Calixte Janssens"
           loading="lazy" class="h-full w-full rounded-[10px] object-cover" />
      <div class="space-y-6">
        {site.aboutParagraphs.map((p) => (
          <p data-reveal class="text-lg leading-relaxed text-bone-dim md:text-2xl">{p}</p>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Brancher**

Modify `src/pages/index.astro` : `import About from '../components/About.astro';` et `<About />` après `<Work />`.

- [ ] **Step 3: Vérifier**

Run `npm run dev`. Expected : section à propos, 3 paragraphes verbatim (vrais accents), portrait placeholder, reveal au scroll, timecode actif. Vérifier qu'il n'y a pas d'eyebrow en trop (compter : hero, work, about = 3 eyebrows pour le moment, OK car ≤ ceil(sections/3) une fois les 5 sections en place... ajuster en Task 10 si dépassement).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: section a propos 02:40 (texte verbatim, portrait placeholder)"
```

---

### Task 8: Section Savoir-faire (03:15)

**Files:**
- Create: `src/components/Skills.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes : `site.tools` (`{ postprod: string[]; plateau: string[] }`).
- Produces : section `id="skills"`. Layout groupé (PAS 3 cartes égales).

- [ ] **Step 1: Composant Skills**

Create `src/components/Skills.astro` :
```astro
---
import { site } from '../data/site';
---
<section id="skills" class="border-t border-bone/10 px-6 py-24 md:px-10 md:py-36">
  <div class="mx-auto max-w-[1100px]">
    <h2 class="font-display text-4xl font-medium tracking-tighter md:text-6xl">Savoir-faire</h2>
    <div class="mt-12 grid gap-12 md:grid-cols-2 md:gap-20">
      <div data-reveal>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-bone-dim">Post-production</p>
        <ul class="mt-5 flex flex-wrap gap-x-3 gap-y-3">
          {site.tools.postprod.map((t) => (
            <li class="rounded-[10px] border border-bone/15 px-4 py-2 font-mono text-sm text-bone">{t}</li>
          ))}
        </ul>
      </div>
      <div data-reveal>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-bone-dim">Plateau</p>
        <ul class="mt-5 flex flex-wrap gap-x-3 gap-y-3">
          {site.tools.plateau.map((t) => (
            <li class="rounded-[10px] border border-bone/15 px-4 py-2 font-mono text-sm text-bone">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</section>
```
Note : ce layout n'utilise pas d'eyebrow timecode (pour respecter le quota eyebrows). Les labels « Post-production »/« Plateau » sont des sous-labels de colonne, pas des eyebrows de section.

- [ ] **Step 2: Brancher**

Modify `src/pages/index.astro` : `import Skills from '../components/Skills.astro';` et `<Skills />` après `<About />`.

- [ ] **Step 3: Vérifier**

Run `npm run dev`. Expected : 2 groupes (post-prod / plateau), outils en pills, radius cohérent (10px), reveal au scroll.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: section savoir-faire 03:15 (groupe post-prod / plateau)"
```

---

### Task 9: Section Contact (04:00) + Footer

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes : `site.contact`, `site.alias`, `site.name`.
- Produces : section `id="contact"` + footer. Un seul intent CTA (contact).

- [ ] **Step 1: Composant Contact**

Create `src/components/Contact.astro` :
```astro
---
import { site } from '../data/site';
---
<section id="contact" class="flex min-h-[80vh] flex-col justify-between border-t border-bone/10 px-6 py-20 md:px-10">
  <div class="mx-auto w-full max-w-[1100px] flex-1 flex flex-col justify-center">
    <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">04:00 / Contact</p>
    <h2 class="mt-4 font-display text-4xl font-medium tracking-tighter md:text-7xl">Travaillons ensemble.</h2>
    <a href={`mailto:${site.contact.email}`}
       class="mt-8 inline-block w-fit rounded-[10px] bg-accent px-6 py-3 font-mono text-sm font-medium text-ink transition-transform active:translate-y-[1px] hover:bg-accent/90">
      La contacter
    </a>
    <div class="mt-10 flex gap-6 font-mono text-sm text-bone-dim">
      <a href={site.contact.instagram} target="_blank" rel="noopener" class="transition-colors hover:text-accent">Instagram</a>
      <a href={site.contact.youtube} target="_blank" rel="noopener" class="transition-colors hover:text-accent">YouTube</a>
      <a href={`mailto:${site.contact.email}`} class="transition-colors hover:text-accent">Email</a>
    </div>
  </div>

  <footer class="mx-auto mt-16 flex w-full max-w-[1100px] items-center justify-between border-t border-bone/10 pt-6 font-mono text-xs text-bone-dim">
    <span>{site.alias} · {site.name}</span>
    <a href="#hero" class="tabular-nums transition-colors hover:text-accent">04:12 / Rewind</a>
  </footer>
</section>
```

- [ ] **Step 2: Brancher**

Modify `src/pages/index.astro` : `import Contact from '../components/Contact.astro';` et `<Contact />` après `<Skills />`.

- [ ] **Step 3: Vérifier**

Run `npm run dev`. Expected : section contact, CTA ambre lisible, liens sociaux, footer avec « Rewind » qui remonte au hero. Vérifier un seul intent CTA contact sur la page (hero CTA = « voir le travail », contact CTA = « la contacter » : intents distincts, OK).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: section contact 04:00 + footer rewind"
```

---

### Task 10: Pré-flight, accessibilité, build, déploiement GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Modify: composants selon findings du pré-flight

**Interfaces:**
- Consumes : tout le site.
- Produces : workflow de déploiement Pages, README, page conforme au pré-flight.

- [ ] **Step 1: Audit pré-flight (checklist design-taste)**

Vérifier et corriger inline :
- Zéro em-dash/en-dash dans tout texte visible (rechercher `—` et `–` dans `src/`).
- **Compte des eyebrows** : timecodes-eyebrows = hero(00:00), work(00:12), contact(04:00) + about(02:40) = 4. Sections = 5. Quota = ceil(5/3) = 2. **Dépassement.** Action : garder l'eyebrow timecode uniquement sur Hero et Work ; pour About et Contact, déplacer le timecode dans la nav latérale seulement et retirer le `<p>` eyebrow de la section (ou le fondre dans le H2). Re-vérifier après correction.
- Un seul accent (ambre) partout, un seul radius (10px) partout.
- Contraste AA : CTA ambre/ink OK ; texte `bone-dim` `#9b988f` sur `ink` `#0a0a0b` ≈ 6.3:1 OK pour large, vérifier pour le corps (utiliser `bone` pour les paragraphes longs si besoin).
- Hero tient dans le viewport ; aucun CTA ne wrap sur 2 lignes desktop.
- Reduced-motion : tester avec l'émulation DevTools, les reveals doivent être instantanés et le contenu visible.
- Mobile (375px) : chaque section passe en 1 colonne, nav latérale cachée (`hidden md:flex`), padding `px-6`.

- [ ] **Step 2: Tester les deux states (motion on/off) + mobile**

Run `npm run dev`, émuler `prefers-reduced-motion: reduce` puis mobile 375px en DevTools. Expected : aucun contenu caché, aucun débordement horizontal, playhead fonctionnel.

- [ ] **Step 3: Build de prod**

Run :
```bash
npm run check && npm run build
```
Expected : 0 erreur TS, `dist/` généré. Vérifier `npm run preview` sur `http://localhost:4321/portfolio-cxl/`.

- [ ] **Step 4: Workflow GitHub Pages**

Create `.github/workflows/deploy.yml` :
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 5: README**

Create `README.md` avec : description, stack, `npm run dev/build`, comment remplacer les placeholders (vidéos dans `src/data/projects.ts`, reel hero dans `Hero.astro`, portrait dans `About.astro`, contacts réels dans `src/data/site.ts`), et note de déploiement (activer Pages → Source: GitHub Actions dans les settings du repo).

- [ ] **Step 6: Commit final**

```bash
git add -A
git commit -m "chore: pre-flight a11y, build prod, workflow GitHub Pages, README"
```

---

## Notes de remplacement (post-build, par Calixte)
- Reel de fond hero : `src/components/Hero.astro` (`<video>` TODO).
- 4 projets : `src/data/projects.ts` (`videoSrc` + méta réelles).
- Portrait : `src/components/About.astro` (img TODO).
- Contacts réels : `src/data/site.ts` (email, Instagram, YouTube).
- Vérifier les accents UTF-8 dans `site.ts` (texte verbatim avec « é », « è », etc.).
