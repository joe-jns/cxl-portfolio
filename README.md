# CXL - Portfolio Calixte Janssens

Portfolio one-page de Calixte Janssens (CXL), monteuse video et cadreuse basee a Charleroi. Direction "experimental / WebGL" : images traitees en shader (distorsion, RGB split, grain, etalonnage froid), scroll fluide, marquee cinetique.

## Stack

- [Astro 5](https://astro.build/) - framework statique SSG
- [Tailwind CSS v4](https://tailwindcss.com/) - via plugin Vite
- [Three.js](https://threejs.org/) - shaders WebGL (hero, portrait, apercu projets)
- [Lenis](https://lenis.darkroom.engineering/) - scroll fluide
- [Motion](https://motion.dev/) - barre de progression + reveals (vanilla, pas de React)
- TypeScript strict
- Fonts self-hostees : Space Grotesk Variable + JetBrains Mono Variable

## Commandes

```bash
npm run dev      # developpement (http://localhost:4321/cxl-portfolio/)
npm run build    # build de production
npm run preview  # apercu du build
npm run check    # verification TypeScript
```

## Remplacer les placeholders

Les visuels sont des images locales dans `public/` (telechargees pour la demo). A remplacer par les vrais visuels de Calixte. **Important** : garder les fichiers en local dans `public/` (le WebGL refuse les images distantes sans en-tetes CORS).

**Image du hero** - `public/placeholder-hero.jpg`
- Remplacer par une vraie image (ou une frame de reel) au format paysage. Pour une vraie video, voir `src/scripts/hero-webgl.ts` (passer a une `VideoTexture`).

**Images des projets** - `public/p1.jpg` ... `public/p4.jpg`
- Remplacer chaque image (format portrait ~4:5). Les titres / metadonnees sont dans `src/data/projects.ts` (`title`, `role`, `year`, `format`).

**Portrait (A propos)** - `public/portrait.jpg`
- Remplacer par un vrai portrait (format ~4:5).

**Contacts reels** - `src/data/site.ts`
- `email`, `instagram`, `youtube`.

## Structure

- `src/pages/index.astro` - la page (assemble les sections + scripts + grain global)
- `src/components/` - `HeroWebGL`, `WorkWebGL`, `AboutWebGL`, `SkillsMarquee`, `ContactX`
- `src/scripts/` - `hero-webgl.ts` (shader distorsion), `work-webgl.ts` (apercu hover), `lenis.ts` (scroll), `playhead.ts` (progression), `reveals.ts`
- `src/data/` - `site.ts`, `projects.ts`

Tout honore `prefers-reduced-motion` (WebGL fige, marquee stoppe, scroll natif).

## Deploiement sur GitHub Pages

Le site se deploie sur la branche `gh-pages` via le package `gh-pages`.

```bash
# build + publication sur la branche gh-pages
npm run deploy
```

- Code source : branche `main`
- Site publie : branche `gh-pages` (servie par GitHub Pages)
- Settings du repo - **Pages** - Source : **Deploy from a branch** - `gh-pages` / `root`
- Site en ligne : `https://joe-jns.github.io/cxl-portfolio/`

A refaire a chaque mise a jour (remplacement des visuels, etc.) : `npm run deploy`.
