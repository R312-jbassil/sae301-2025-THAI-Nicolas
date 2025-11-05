/**
 * Modèles de lunettes prédéfinis
 * Chaque modèle peut être personnalisé dans le configurateur
 */

export interface Modele {
  id: string;
  nom: string;
  description: string;
  descriptionLongue: string;
  prix: number;
  image: string;
  formeMonture: "rectangulaire" | "ronde" | "papillon" | "carrée";
  typeVerres: "correcteurs" | "solaires" | "photochromiques" | "polarisés";
  caracteristiques: string[];
  couleurMonture: string;
  couleurBranches: string;
  couleurVerres: string;
  epaisseur: "fin" | "moyen" | "épais";
  taille: string;
  nouveaute?: boolean;
  bestseller?: boolean;
}

export const modeles: Modele[] = [
  {
    id: "elegance",
    nom: "ÉLÉGANCE",
    description: "Un design classique et intemporel pour un look sophistiqué",
    descriptionLongue:
      "Le modèle ÉLÉGANCE incarne la sophistication avec ses lignes épurées et son design intemporel. Parfait pour un usage quotidien, ce modèle rectangulaire s'adapte à toutes les formes de visage. La monture noire mate apporte une touche de raffinement à votre style.",
    prix: 149,
    image: "/lunettes.svg",
    formeMonture: "rectangulaire",
    typeVerres: "correcteurs",
    caracteristiques: [
      "Monture légère et confortable",
      "Verres anti-reflets inclus",
      "Convient aux visages ovales et carrés",
      "Protection UV 400",
      "Charnières flexibles",
    ],
    couleurMonture: "#1A1A1A",
    couleurBranches: "#1A1A1A",
    couleurVerres: "#4A5A54",
    epaisseur: "moyen",
    taille: "52-18",
    bestseller: true,
  },
  {
    id: "vintage",
    nom: "VINTAGE",
    description: "Un style rétro revisité pour les amateurs de caractère",
    descriptionLongue:
      "Le modèle VINTAGE est un hommage aux lunettes iconiques des années 60. Avec sa forme ronde parfaitement équilibrée et ses finitions soignées, ce modèle apporte une touche bohème et artistique à votre look. Idéal pour exprimer votre personnalité unique.",
    prix: 169,
    image: "/lunettes.svg",
    formeMonture: "ronde",
    typeVerres: "correcteurs",
    caracteristiques: [
      "Design inspiré des années 60",
      "Monture en acétate premium",
      "Parfait pour les visages carrés et rectangulaires",
      "Verres traités anti-rayures",
      "Légèreté exceptionnelle",
    ],
    couleurMonture: "#8b5a3c",
    couleurBranches: "#8b5a3c",
    couleurVerres: "#4A5A54",
    epaisseur: "fin",
    taille: "48-16",
    nouveaute: true,
  },
  {
    id: "soleil",
    nom: "SOLEIL",
    description:
      "Protection optimale avec style pour vos journées ensoleillées",
    descriptionLongue:
      "SOLEIL est le compagnon idéal pour vos aventures estivales. Ces lunettes de soleil combinent protection maximale et design moderne. Les verres polarisés éliminent les reflets gênants et protègent vos yeux des rayons UV nocifs, tout en offrant un confort visuel exceptionnel.",
    prix: 189,
    image: "/lunettes.svg",
    formeMonture: "carrée",
    typeVerres: "polarisés",
    caracteristiques: [
      "Verres polarisés pour éliminer les reflets",
      "Protection UV 400 maximale",
      "Idéal pour la conduite",
      "Monture résistante aux chocs",
      "Design sportif et élégant",
    ],
    couleurMonture: "#589772",
    couleurBranches: "#589772",
    couleurVerres: "#8b5a3c",
    epaisseur: "moyen",
    taille: "54-19",
    bestseller: true,
  },
  {
    id: "feminin",
    nom: "FÉMININ",
    description: "Délicatesse et élégance pour sublimer votre regard",
    descriptionLongue:
      "Le modèle FÉMININ est conçu pour mettre en valeur la délicatesse de vos traits. Sa forme papillon apporte une touche de glamour et de sophistication. Les finitions dorées et les détails raffinés font de ce modèle un véritable accessoire de mode.",
    prix: 179,
    image: "/lunettes.svg",
    formeMonture: "papillon",
    typeVerres: "correcteurs",
    caracteristiques: [
      "Forme papillon flatteuse",
      "Détails dorés raffinés",
      "Parfait pour les visages ronds et ovales",
      "Monture ultra-légère",
      "Design exclusif et élégant",
    ],
    couleurMonture: "#d4a5a5",
    couleurBranches: "#c8a882",
    couleurVerres: "#7fa5c1",
    epaisseur: "fin",
    taille: "50-17",
    nouveaute: true,
  },
  {
    id: "sport",
    nom: "SPORT",
    description: "Performance et confort pour vos activités sportives",
    descriptionLongue:
      "SPORT est conçu pour les personnes actives qui ne font aucun compromis sur le style. Ce modèle combine légèreté, résistance et adhérence optimale pour rester en place pendant vos activités les plus intenses. Les verres photochromiques s'adaptent automatiquement à la luminosité.",
    prix: 229,
    image: "/lunettes.svg",
    formeMonture: "rectangulaire",
    typeVerres: "photochromiques",
    caracteristiques: [
      "Verres photochromiques adaptatifs",
      "Adhérence maximale anti-glisse",
      "Résistant aux chocs et à l'eau",
      "Design aérodynamique",
      "Parfait pour le sport et les activités outdoor",
    ],
    couleurMonture: "#1A1A1A",
    couleurBranches: "#589772",
    couleurVerres: "#4A5A54",
    epaisseur: "épais",
    taille: "56-20",
    bestseller: true,
  },
  {
    id: "minimaliste",
    nom: "MINIMALISTE",
    description: "L'essentiel du style dans sa forme la plus pure",
    descriptionLongue:
      "MINIMALISTE célèbre la beauté de la simplicité. Avec ses lignes épurées et son design sans fioritures, ce modèle s'intègre parfaitement dans un style de vie moderne et épuré. La finesse de la monture la rend presque invisible, mettant ainsi en valeur votre visage.",
    prix: 159,
    image: "/lunettes.svg",
    formeMonture: "ronde",
    typeVerres: "correcteurs",
    caracteristiques: [
      "Design ultra-minimaliste",
      "Monture fine et discrète",
      "Confort optimal toute la journée",
      "Matériaux hypoallergéniques",
      "Style intemporel et moderne",
    ],
    couleurMonture: "#c8a882",
    couleurBranches: "#c8a882",
    couleurVerres: "#4A5A54",
    epaisseur: "fin",
    taille: "50-17",
    nouveaute: true,
  },
];

/**
 * Récupérer un modèle par son ID
 */
export function getModeleById(id: string): Modele | undefined {
  return modeles.find((m) => m.id === id);
}

/**
 * Récupérer les modèles bestsellers
 */
export function getBestsellers(): Modele[] {
  return modeles.filter((m) => m.bestseller);
}

/**
 * Récupérer les nouveautés
 */
export function getNouveautes(): Modele[] {
  return modeles.filter((m) => m.nouveaute);
}
