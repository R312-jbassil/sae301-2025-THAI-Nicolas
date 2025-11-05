/**
 * Configuration PocketBase pour TaVue
 * SDK Client pour l'authentification et les opérations CRUD
 * Mode: développement (localhost) / production (déploiement VPS)
 */

import PocketBase from "pocketbase";

// Configuration de l'URL selon l'environnement
let path = "";
if (import.meta.env.MODE === "development") {
  path = "http://localhost:8090"; // localhost = machine de dev
} else {
  path = "https://tavue.nicolas-thai.fr:443"; // URL du site en production
}

// Instance singleton PocketBase
export const pb = new PocketBase(path);

// Activer le stockage automatique des tokens d'authentification
pb.autoCancellation(false);

/**
 * Types TypeScript pour les collections PocketBase
 */

// Collection: users (utilisateurs authentifiés)
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  created: string;
  updated: string;
}

// Collection: lunette (modèles de lunettes)
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

// Collection: materiau (matériaux disponibles)
export interface Materiau {
  id: string;
  nom: string;
  type: "monture" | "branches" | "verres";
  prix_supplement: number;
  disponible: boolean;
  stock_limite?: boolean;
  quantite_restante?: number;
  created: string;
  updated: string;
}

// Collection: svg_ia (SVG générés par IA)
export interface SvgIA {
  id: string;
  lunette_id: string;
  svg_code: string;
  parametres: string; // JSON stringifié des paramètres de génération
  genere_par_ia: boolean;
  created: string;
  updated: string;
}

// Collection: commande (commandes passées)
export interface Commande {
  id: string;
  user_id: string;
  lunette_id: string;
  statut: "en_attente" | "validee" | "en_production" | "expediee" | "livree";
  prix_total: number;
  adresse_livraison: string;
  telephone: string;
  notes?: string;
  created: string;
  updated: string;
}

// Collection: carts (paniers pour récupération abandonnés)
export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: string; // JSON stringifié des items du panier
  total: number;
  abandonné: boolean;
  email_sent_j1?: boolean;
  email_sent_j3?: boolean;
  email_sent_j7?: boolean;
  created: string;
  updated: string;
}

/**
 * Helpers d'authentification
 */

/**
 * Connecter un utilisateur avec email/password
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    return { success: true, user: authData.record };
  } catch (error: any) {
    console.error("Erreur de connexion:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer un nouveau compte utilisateur
 */
export async function registerUser(
  email: string,
  password: string,
  passwordConfirm: string,
  name?: string
) {
  try {
    const userData = {
      email,
      password,
      passwordConfirm,
      name: name || email.split("@")[0],
      emailVisibility: true,
    };

    const record = await pb.collection("users").create(userData);

    // Auto-login après inscription
    await loginWithEmail(email, password);

    return { success: true, user: record };
  } catch (error: any) {
    console.error("Erreur d'inscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Authentification OAuth (Google, Apple, etc.)
 */
export async function loginWithOAuth(
  provider: "google" | "apple" | "microsoft"
) {
  try {
    const authData = await pb.collection("users").authWithOAuth2({ provider });
    return { success: true, user: authData.record };
  } catch (error: any) {
    console.error(`Erreur OAuth ${provider}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Déconnecter l'utilisateur
 */
export function logout() {
  pb.authStore.clear();
}

/**
 * Vérifier si l'utilisateur est connecté
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Obtenir l'utilisateur actuel
 */
export function getCurrentUser(): User | null {
  if (!isAuthenticated()) return null;
  return pb.authStore.model as unknown as User;
}

/**
 * Helpers pour les collections
 */

/**
 * Sauvegarder un modèle de lunettes
 */
export async function saveLunette(data: Partial<Lunette>) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Utilisateur non connecté");

    const lunetteData = {
      ...data,
      user_id: user.id,
    };

    const record = await pb.collection("lunette").create(lunetteData);
    return { success: true, lunette: record };
  } catch (error: any) {
    console.error("Erreur sauvegarde lunette:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les lunettes de l'utilisateur connecté
 */
export async function getUserLunettes() {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Utilisateur non connecté");

    const records = await pb.collection("lunette").getFullList({
      filter: `user_id = "${user.id}"`,
      sort: "-created",
    });

    return { success: true, lunettes: records };
  } catch (error: any) {
    console.error("Erreur récupération lunettes:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer une lunette
 */
export async function deleteLunette(id: string) {
  try {
    await pb.collection("lunette").delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("Erreur suppression lunette:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer tous les matériaux disponibles
 */
export async function getMateriaux(type?: "monture" | "branches" | "verres") {
  try {
    const filter = type
      ? `type = "${type}" && disponible = true`
      : "disponible = true";
    const records = await pb.collection("materiau").getFullList({
      filter,
      sort: "nom",
    });

    return { success: true, materiaux: records };
  } catch (error: any) {
    console.error("Erreur récupération matériaux:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Sauvegarder un SVG généré
 */
export async function saveSvg(
  lunetteId: string,
  svgCode: string,
  parametres: object,
  genereParIA: boolean = false
) {
  try {
    const svgData = {
      lunette_id: lunetteId,
      svg_code: svgCode,
      parametres: JSON.stringify(parametres),
      genere_par_ia: genereParIA,
    };

    const record = await pb.collection("svg_ia").create(svgData);
    return { success: true, svg: record };
  } catch (error: any) {
    console.error("Erreur sauvegarde SVG:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une commande
 */
export async function createCommande(
  lunetteId: string,
  adresseLivraison: string,
  telephone: string,
  notes?: string
) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Utilisateur non connecté");

    // Récupérer la lunette pour obtenir le prix
    const lunette = await pb.collection("lunette").getOne(lunetteId);

    const commandeData = {
      user_id: user.id,
      lunette_id: lunetteId,
      statut: "en_attente",
      prix_total: lunette.prix,
      adresse_livraison: adresseLivraison,
      telephone,
      notes,
    };

    const record = await pb.collection("commande").create(commandeData);
    return { success: true, commande: record };
  } catch (error: any) {
    console.error("Erreur création commande:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Gestion du panier
 */

/**
 * Sauvegarder ou mettre à jour le panier
 */
export async function saveCart(items: any[], total: number) {
  try {
    const user = getCurrentUser();
    const userId = user?.id;

    // Générer un session_id si pas d'utilisateur connecté
    const sessionId = userId ? null : getOrCreateSessionId();

    const cartData = {
      user_id: userId,
      session_id: sessionId,
      items: JSON.stringify(items),
      total,
      abandonné: false,
    };

    // Vérifier si un panier existe déjà
    const filter = userId
      ? `user_id = "${userId}" && abandonné = false`
      : `session_id = "${sessionId}" && abandonné = false`;

    const existingCarts = await pb.collection("carts").getFullList({ filter });

    let record;
    if (existingCarts.length > 0) {
      // Mettre à jour le panier existant
      record = await pb
        .collection("carts")
        .update(existingCarts[0].id, cartData);
    } else {
      // Créer un nouveau panier
      record = await pb.collection("carts").create(cartData);
    }

    return { success: true, cart: record };
  } catch (error: any) {
    console.error("Erreur sauvegarde panier:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer le panier actuel
 */
export async function getCart() {
  try {
    const user = getCurrentUser();
    const userId = user?.id;
    const sessionId = getOrCreateSessionId();

    const filter = userId
      ? `user_id = "${userId}" && abandonné = false`
      : `session_id = "${sessionId}" && abandonné = false`;

    const carts = await pb.collection("carts").getFullList({ filter });

    if (carts.length > 0) {
      return { success: true, cart: carts[0] };
    }

    return { success: true, cart: null };
  } catch (error: any) {
    console.error("Erreur récupération panier:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper pour générer/récupérer un session_id unique
 */
function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem("tavue_session_id");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("tavue_session_id", sessionId);
  }

  return sessionId;
}

/**
 * Écouter les changements d'authentification en temps réel
 */
export function onAuthChange(callback: (user: User | null) => void) {
  pb.authStore.onChange(() => {
    callback(getCurrentUser());
  });
}

// Export par défaut pour compatibility
export default pb;
