export interface Project {
  slug: string;
  title: string;
  role: string;
  year: string;
  format: string;
  client: string;
  image: string; // fichier dans public/
  videoSrc: string; // vide tant qu'il n'y a pas de vraie video
  description: string[];
}

// TODO: remplacer par les vrais projets de Calixte (image + video + textes).
export const projects: Project[] = [
  {
    slug: 'clip',
    title: 'Clip - a remplacer',
    role: 'Montage, etalonnage',
    year: '2025',
    format: 'Clip musical',
    client: 'Artiste a remplacer',
    image: 'p1.jpg',
    videoSrc: '',
    description: [
      "Description du projet a completer : le contexte, l'intention, et le role de Calixte sur le montage et l'etalonnage.",
      "Deuxieme paragraphe a remplacer : l'approche creative, les contraintes, le resultat obtenu.",
    ],
  },
  {
    slug: 'court-metrage',
    title: 'Court-metrage - a remplacer',
    role: 'Montage',
    year: '2025',
    format: 'Court-metrage',
    client: 'Realisation a remplacer',
    image: 'p2.jpg',
    videoSrc: '',
    description: [
      "Description du projet a completer : le contexte, l'intention, et le role de Calixte sur le montage.",
      "Deuxieme paragraphe a remplacer : le rythme, la narration, le travail sur l'image.",
    ],
  },
  {
    slug: 'marque',
    title: 'Marque - a remplacer',
    role: 'Montage, cadrage',
    year: '2024',
    format: 'Contenu de marque',
    client: 'Marque a remplacer',
    image: 'p3.jpg',
    videoSrc: '',
    description: [
      "Description du projet a completer : le besoin de la marque, le format, le role de Calixte sur le cadrage et le montage.",
      "Deuxieme paragraphe a remplacer : la direction visuelle et le livrable final.",
    ],
  },
  {
    slug: 're-montage',
    title: 'Re-montage - a remplacer',
    role: 'Re-montage creatif',
    year: '2024',
    format: 'Re-edit',
    client: 'Projet personnel',
    image: 'p4.jpg',
    videoSrc: '',
    description: [
      "Description du projet a completer : le materiau de depart et l'intention du re-montage.",
      "Deuxieme paragraphe a remplacer : le parti pris de montage et ce que ca raconte.",
    ],
  },
];
