# Portfolio CXL — Concept « La Timeline » — Design

Date : 2026-06-26
Statut : validé (structure), prêt pour plan d'implémentation

## 1. Contexte

Refonte complète du portfolio de **Calixte Janssens (CXL)**, monteuse vidéo et cadreuse basée à Charleroi (Belgique). Clips musicaux, courts-métrages, contenu de marque, re-montages créatifs. Début de carrière, en préparation d'une école d'audiovisuel.

L'ancien site (`joe-jns.github.io/portfolio-cxl/`) est jugé trop basique. On repart de zéro. On **conserve** uniquement le texte « à propos » et l'idée du hero (nom + rôle + localisation).

### Objectif du site
Polyvalent : un **nom et un portfolio montrables** à la fois pour décrocher des clients (artistes, marques) ET pour des candidatures (école audiovisuel, travail). La qualité de présentation prime ; conversion (contact) présente mais non agressive.

### Public
Mixte : clients potentiels + jury d'école / recruteurs.

## 2. Le concept : « La Timeline »

Angle différenciateur : **elle est avant tout monteuse.** Sa promesse est le montage, le rythme, l'étalonnage — pas la caméra. Le site doit vendre ça.

La **timeline de montage** est utilisée comme **métaphore d'organisation et langage de motion**, PAS comme un clone skeuomorphe de Premiere/DaVinci. Pas de fausse UI de logiciel en `<div>` (ce serait un AI-tell). Concrètement :

- **Playhead** : fine ligne ambre qui suit la progression réelle du scroll.
- **Timecodes cliquables** sur le côté = navigation par chapitres réelle (fonctionnel, pas décoratif).
- **Transitions cut/fondu** entre sections, pour la sensation de séquence montée.
- Intensité **subtile** : ça reste un beau site éditorial ; la timeline se sent, ne s'impose pas. Choix retenu pour l'intemporalité.

## 3. Direction visuelle

- **Base near-black cinéma** : off-black `#0a0a0b` (jamais de noir pur). Contexte naturel de l'étalonnage/montage.
- **Texte blanc-os** (pas blanc pur), hiérarchie par poids + couleur, pas par taille brute.
- **Accent unique verrouillé : ambre safelight** (~`#f5c33b`), utilisé partout : playhead, liens, marqueurs, CTA, focus. Aucun autre accent coloré. Pas d'AI-purple, pas de glow néon.
- **Typo** : grotesk display serré et caractériel (PP Neue Montreal ou Cabinet Grotesk — à finaliser, self-host / fallback) + **un mono** (JetBrains Mono / Geist Mono) réservé aux timecodes et données.
- **Page Theme Lock** : dark sur tout le site, aucune section ne s'inverse.
- Dials : `DESIGN_VARIANCE 8 / MOTION_INTENSITY 7 / VISUAL_DENSITY 3`.

## 4. Architecture (one-page, lu comme une séquence)

Navigation = timecodes cliquables (chapitres). Playhead ambre = progression de scroll.

1. **`00:00` Hero**
   - CXL / Calixte Janssens · « Monteuse vidéo & cadreuse, Charleroi ».
   - Reel muet autoplay en fond (placeholder labellisé), voile sombre pour lisibilité.
   - Un seul CTA : *Voir le travail*. Le playhead démarre ici.
   - Contraintes : tient dans le viewport, headline ≤ 2 lignes, max 4 éléments texte.

2. **`00:12` Le travail (cœur du site)**
   - Projets en pièces plein-cadre empilées verticalement. Chaque projet = un « clip » : vidéo + titre kinétique + ligne méta sobre (rôle · année · format).
   - Transition en cut franc entre projets.
   - 4 placeholders au départ (vidéos `<!-- TODO -->` labellisées), prêts à recevoir les vrais fichiers.

3. **`02:40` À propos**
   - Texte verbatim conservé (3 paragraphes existants), révélé au scroll comme une séquence qui se monte (stagger ligne par ligne).
   - Portrait optionnel (placeholder).

4. **`03:15` Savoir-faire**
   - Post-prod : DaVinci Resolve, Premiere Pro, After Effects, Fusion, Audition, Final Cut.
   - Plateau : cadre, lumière, prise de son.
   - Layout groupé post-prod / plateau. PAS 3 cartes égales. Marquee d'outils possible (max 1 marquee sur la page).

5. **`04:00` Contact**
   - Email, Instagram, YouTube. Un seul intent CTA : *La contacter*.

6. **Footer** minimal : timecode de fin, lien « rewind » (retour au début).

## 5. Motion

- **Playhead / progression** : `useScroll` (Motion) ou GSAP ScrollTrigger. Jamais `window.addEventListener('scroll')`.
- **Scrub timeline / pin** si besoin : GSAP ScrollTrigger, pattern canonique (`start: "top top"`, cleanup strict).
- **Reveals** : Motion `whileInView` stagger pour le texte à propos et les méta projets.
- **Cuts entre sections** : transitions d'opacité/transform rapides.
- **reduced-motion** : tout ce qui dépasse MOTION 3 dégrade en statique ; autoplay reels respectent `prefers-reduced-motion`.
- GSAP et Motion isolés dans des composants/îlots séparés (jamais mélangés dans le même arbre).

## 6. Stack technique

- **Astro** (statique) + **Tailwind v4** + **GSAP ScrollTrigger** (scrub/playhead) + **Motion** (micro-interactions), îlots React/vanilla pour l'interactif.
- Déploiement : **GitHub Pages** (comme le site actuel `joe-jns.github.io/portfolio-cxl/`). Statique, aucun serveur.
- Fonts self-hostées (`font-display: swap`), pas de `<link>` Google Fonts en prod.
- Vidéos : `<video>` muet/loop/playsinline, `poster` réservé pour éviter le CLS, lazy hors viewport.

## 7. Contenu conservé (verbatim « à propos »)

> Je m'appelle Calixte, alias CXL, monteur vidéo passionné, basé en Belgique. Depuis plus d'un an, je travaille sur des projets variés : clips musicaux, courts-métrages, contenus de marque et re-montages créatifs.
>
> Mon approche va au-delà du simple découpage. Je construis des séquences qui respirent, des transitions qui ont du sens, une colorimétrie qui soutient l'émotion. Chaque projet est une partition que j'orchestre image par image.
>
> Actuellement en préparation pour intégrer une école d'audiovisuel en Belgique, je consolide chaque jour ma maîtrise des outils de post-production professionnels.

(Ajuster le genre/accord selon préférence de Calixte ; le site dira « monteuse » dans les titres.)

## 8. Garde-fous anti-slop (pré-flight)

- Zéro em-dash partout (titres, méta, boutons, alt).
- Un seul accent (ambre) sur toute la page.
- Un seul système de radius.
- Hero tient dans le viewport, max 4 éléments texte, pt ≤ 6rem.
- Pas de fausse UI logiciel en `<div>`, pas de faux screenshots.
- Timecodes = navigation fonctionnelle (autorisé), pas des labels de version décoratifs.
- Max 1 marquee, eyebrows rationnés (≤ 1 / 3 sections).
- Vraies vidéos/images (placeholders labellisés en attendant les fichiers réels).
- Contraste WCAG AA sur CTA, formulaires, focus.
- reduced-motion + dark cohérent + mobile collapse explicite par section.

## 9. Hors périmètre (pour l'instant)

- Pas de blog, pas de page tarifs, pas de multi-langue, pas de section clients/références (à ajouter plus tard si besoin).
- Pas de CMS : contenu en dur dans des fichiers de données Astro, facile à éditer.

## 10. Placeholders à remplacer (à fournir par Calixte plus tard)

- Reel de fond hero (vidéo).
- 4 projets : vidéo + titre + rôle + année + format.
- Portrait à propos (optionnel).
- Liens réels Instagram / YouTube, email de contact réel.
