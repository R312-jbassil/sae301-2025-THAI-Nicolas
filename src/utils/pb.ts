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
  verified: boolean;
  created: string;
  updated: string;
}

// Collection: configuration_lunettes (configurations de lunettes)
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

// Ancienne interface pour compatibilité (à supprimer plus tard)
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

// Collection: materiaux (matériaux disponibles)
export interface Materiau {
  id: string;
  libelle: string; // Nom du matériau
  prix_supplementaire: number; // Prix supplémentaire
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

// Collection: commandes (commandes passées)
export interface Commande {
  id: string;
  user_id: string; // Relation vers users
  configuration_lunettes: string[]; // Relations multiples vers configuration_lunettes
  date_commande: string;
  prix_total: number;
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

    // Vérifier si l'email est validé
    if (!authData.record.verified) {
      // Déconnecter l'utilisateur si email non vérifié
      pb.authStore.clear();
      return {
        success: false,
        error:
          "Veuillez vérifier votre email avant de vous connecter. Un email de vérification vous a été envoyé.",
        needsVerification: true,
      };
    }

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

    // Envoyer l'email de vérification
    await pb.collection("users").requestVerification(email);

    return {
      success: true,
      user: record,
      message:
        "Compte créé avec succès ! Un email de vérification vous a été envoyé.",
    };
  } catch (error: any) {
    console.error("Erreur d'inscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Renvoyer un email de vérification
 */
export async function resendVerificationEmail(email: string) {
  try {
    await pb.collection("users").requestVerification(email);
    return {
      success: true,
      message: "Email de vérification renvoyé avec succès",
    };
  } catch (error: any) {
    console.error("Erreur renvoi email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Confirmer la vérification de l'email avec le token
 */
export async function confirmVerification(token: string) {
  try {
    await pb.collection("users").confirmVerification(token);
    return {
      success: true,
      message:
        "Email vérifié avec succès ! Vous pouvez maintenant vous connecter.",
    };
  } catch (error: any) {
    console.error("Erreur confirmation email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Authentification OAuth (Google, Apple, etc.)
 */
export async function loginWithOAuth(provider: "google" | "apple" | "github") {
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
 * Sauvegarder une configuration de lunettes
 */
export async function saveConfiguration(data: Partial<ConfigurationLunette>) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Utilisateur non connecté");

    const configData = {
      ...data,
      user_id: user.id,
      est_dans_panier: false, // Par défaut, pas dans le panier
    };

    const record = await pb
      .collection("configuration_lunettes")
      .create(configData);
    return { success: true, configuration: record };
  } catch (error: any) {
    console.error("Erreur sauvegarde configuration:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Sauvegarder un modèle de lunettes (ancienne fonction - à migrer)
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
 * Récupérer les configurations de lunettes de l'utilisateur connecté
 */
export async function getUserConfigurations(dansePanier: boolean = false) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Utilisateur non connecté");

    const filter = dansePanier
      ? `user_id = "${user.id}" && est_dans_panier = true`
      : `user_id = "${user.id}" && est_dans_panier = false`;

    const records = await pb.collection("configuration_lunettes").getFullList({
      filter,
      sort: "-created",
      expand: "materiau_id", // Récupérer aussi les infos du matériau
    });

    return { success: true, configurations: records };
  } catch (error: any) {
    console.error("Erreur récupération configurations:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les lunettes de l'utilisateur connecté (ancienne fonction - à migrer)
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
 * Supprimer une configuration
 */
export async function deleteConfiguration(id: string) {
  try {
    await pb.collection("configuration_lunettes").delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("Erreur suppression configuration:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Ajouter une configuration au panier
 */
export async function addToCart(configId: string) {
  try {
    await pb.collection("configuration_lunettes").update(configId, {
      est_dans_panier: true,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Erreur ajout au panier:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Retirer une configuration du panier
 */
export async function removeFromCart(configId: string) {
  try {
    await pb.collection("configuration_lunettes").update(configId, {
      est_dans_panier: false,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Erreur retrait du panier:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer une lunette (ancienne fonction - à migrer)
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
export async function getMateriaux() {
  try {
    const records = await pb.collection("materiaux").getFullList({
      sort: "libelle",
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
 * Créer une commande à partir du panier
 */
export async function createCommande() {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Utilisateur non connecté");

    // Récupérer toutes les configurations dans le panier
    const cartResult = await getUserConfigurations(true);
    if (
      !cartResult.success ||
      !cartResult.configurations ||
      cartResult.configurations.length === 0
    ) {
      throw new Error("Panier vide");
    }

    // Calculer le prix total
    const prixTotal = cartResult.configurations.reduce(
      (total: number, config: any) => {
        return total + (config.prix || 0);
      },
      0
    );

    // Récupérer les IDs des configurations
    const configIds = cartResult.configurations.map((config: any) => config.id);

    const commandeData = {
      user_id: user.id,
      configuration_lunettes: configIds,
      date_commande: new Date().toISOString(),
      prix_total: prixTotal,
    };

    const record = await pb.collection("commandes").create(commandeData);

    // Retirer les configurations du panier après la commande
    for (const configId of configIds) {
      await removeFromCart(configId);
    }

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
