/**
 * Types TypeScript pour les modèles de données PocketBase
 * Centralise toutes les interfaces pour garantir la cohérence
 */

// ========================================
// COLLECTIONS PRINCIPALES
// ========================================

/**
 * Collection: users
 * Utilisateurs authentifiés de l'application
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  nom?: string;
  prenom?: string;
  avatar?: string;
  verified: boolean;
  created: string;
  updated: string;
}

/**
 * Collection: configuration_lunettes
 * Configurations de lunettes créées par les utilisateurs
 */
export interface ConfigurationLunette {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  taille: string; // Format: "52-18"
  couleur_monture: string; // Hex: "#1A1A1A"
  couleur_branches: string; // Hex: "#1A1A1A"
  couleur_verres: string; // Hex: "#4A5A54"
  forme_monture: "rectangulaire" | "ronde" | "papillon";
  epaisseur_monture: "fin" | "moyen" | "épais";
  types_verres: "correcteurs" | "solaires" | "photochromiques";
  user_id: string; // Relation vers users
  materiau_id?: string; // Relation vers materiaux (optionnel)
  est_dans_panier: boolean;
  created: string;
  updated: string;
}

/**
 * Collection: lunettes (ancienne structure - compatibilité)
 * @deprecated Utiliser ConfigurationLunette à la place
 */
export interface Lunette {
  id: string;
  nom: string;
  user_id: string;
  materiau_monture: string;
  materiau_branches: string;
  couleur_monture: string;
  couleur_branches: string;
  couleur_verres: string;
  type_verres: string;
  forme: string;
  taille: string;
  largeur_pont: number;
  taille_verres: number;
  prix: number;
  svg_id?: string;
  created: string;
  updated: string;
}

/**
 * Collection: materiaux
 * Matériaux disponibles pour les lunettes
 */
export interface Materiau {
  id: string;
  libelle: string;
  prix_supplementaire: number;
  created: string;
  updated: string;
}

/**
 * Collection: svg_ia
 * SVG générés par l'intelligence artificielle
 */
export interface SvgIA {
  id: string;
  lunette_id: string;
  svg_code: string;
  parametres: string; // JSON stringifié des paramètres de génération
  genere_par_ia: boolean;
  created: string;
  updated: string;
}

/**
 * Collection: commandes
 * Commandes passées par les utilisateurs
 */
export interface Commande {
  id: string;
  user_id: string;
  configuration_lunettes: string[]; // Relations multiples vers configuration_lunettes
  date_commande: string;
  prix_total: number;
  created: string;
  updated: string;
}

/**
 * Collection: carts
 * Paniers pour récupération des paniers abandonnés
 */
export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: string; // JSON stringifié des items du panier
  total: number;
  abandonné: boolean;
  email_sent_j1?: boolean;
  email_sent_j3?: boolean;
}

// ========================================
// VUES (VIEWS) POCKETBASE
// ========================================

/**
 * Vue: nombres_lunettes_sauvegardes
 * Nombre de configurations par utilisateur (hors panier)
 */
export interface NombreLunettesSauvegardes {
  id: string;
  user_id: string;
  nombre_configurations: number;
}

/**
 * Vue: montant_panier_par_utilisateur
 * Montant total et nombre d'articles au panier
 */
export interface MontantPanierParUtilisateur {
  id: string;
  user_id: string;
  montant_total: number;
  nombre_articles: number;
}

/**
 * Vue: nombre_lunettes_panier
 * Nombre de lunettes dans le panier par utilisateur
 */
export interface NombreLunettesPanier {
  id: string;
  user_id: string;
  nombre_lunettes: number;
}

/**
 * Vue: lunettes_par_utilisateur
 * Toutes les lunettes d'un utilisateur avec détails
 */
export interface LunettesParUtilisateur {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  taille: string;
  couleur_monture: string;
  couleur_branches: string;
  couleur_verres: string;
  forme_monture: string;
  epaisseur_monture: string;
  types_verres: string;
  user_id: string;
  materiau_id?: string;
  est_dans_panier: boolean;
  created: string;
  updated: string;
}
