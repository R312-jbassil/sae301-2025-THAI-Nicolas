/**
 * Fonctions utilitaires pour PocketBase
 *
 * ✅ ARCHITECTURE REFACTORISÉE
 *
 * Ce fichier contient UNIQUEMENT les fonctions métier (auth, CRUD, etc.)
 * Les types et la configuration sont dans des modules séparés :
 *
 * 📁 src/lib/
 *    ├── pocketbase.ts      → Instance PocketBase singleton
 *    └── openrouter.ts      → Configuration OpenRouter AI
 *
 * 📁 src/types/
 *    ├── models.ts          → Interfaces PocketBase (User, ConfigurationLunette, etc.)
 *    └── api.ts             → Types API (ChatMessage, ApiResponse, etc.)
 *
 * 🔄 Ce fichier réexporte tout pour la compatibilité avec le code existant.
 *    Les imports depuis "utils/pb" continuent de fonctionner !
 */

// ========================================
// RÉ-EXPORTS DES NOUVEAUX MODULES
// ========================================
// Ces réexports permettent de garder la compatibilité avec le code existant
export type * from "../types/models";
export type * from "../types/api";

// Importer et réexporter l'instance PocketBase depuis lib/
import { pb } from "../lib/pocketbase";
export { pb };

// Importer les types depuis types/ pour les utiliser dans les fonctions
import type {
  User,
  ConfigurationLunette,
  Lunette,
  NombreLunettesSauvegardes,
  LunettesParUtilisateur,
} from "../types/models";

import type { ChatMessage, ChatIA } from "../types/api";

/**
 * ========================================
 * FONCTIONS D'AUTHENTIFICATION
 * ========================================
 */

/**
 * Sauvegarder l'authentification dans un cookie HTTP
 */
export function savePocketBaseCookie() {
  if (typeof document !== "undefined" && pb.authStore.isValid) {
    const cookieData = {
      token: pb.authStore.token,
      model: pb.authStore.model,
    };

    // Créer un cookie qui expire dans 7 jours
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    document.cookie = `pb_auth=${encodeURIComponent(
      JSON.stringify(cookieData)
    )}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }
}

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

    // Sauvegarder dans un cookie HTTP pour Astro SSR
    savePocketBaseCookie();

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
  nom?: string
) {
  try {
    const userData = {
      email,
      password,
      passwordConfirm,
      nom: nom || email.split("@")[0], // ✅ Utilise "nom" au lieu de "name"
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

    // Sauvegarder dans un cookie HTTP pour Astro SSR
    savePocketBaseCookie();

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

  // Supprimer le cookie pb_auth
  if (typeof document !== "undefined") {
    document.cookie =
      "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  }
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
      user_id: user.id,
      est_dans_panier: false, // Par défaut, pas dans le panier
      ...data, // Données passées en dernier pour écraser les valeurs par défaut
    };

    if (import.meta.env.DEV) {
      console.log(
        "💾 Sauvegarde config avec est_dans_panier:",
        configData.est_dans_panier
      );
    }

    const record = await pb
      .collection("configuration_lunettes")
      .create(configData);

    if (import.meta.env.DEV) {
      console.log(
        "✅ Config créée:",
        record.id,
        "est_dans_panier:",
        record.est_dans_panier
      );
    }

    return { success: true, configuration: record };
  } catch (error: any) {
    console.error("Erreur sauvegarde configuration:", error);
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
 * Récupérer le nombre de configurations sauvegardées (hors panier) pour l'utilisateur connecté
 * Utilise la vue PocketBase nombres_lunettes_sauvegardes
 * @param userId - ID de l'utilisateur (optionnel, utilise getCurrentUser() si non fourni)
 */
export async function getNombreLunettesSauvegardes(userId?: string) {
  try {
    // Si userId n'est pas fourni, essayer de récupérer l'utilisateur courant
    let targetUserId = userId;
    if (!targetUserId) {
      const user = getCurrentUser();
      if (!user) {
        return { success: true, nombre: 0 };
      }
      targetUserId = user.id;
    }

    const result = await pb
      .collection("nombres_lunettes_sauvegardes")
      .getFirstListItem<NombreLunettesSauvegardes>(
        `user_id = "${targetUserId}"`
      );

    return { success: true, nombre: result.nombre_configurations };
  } catch (error: any) {
    // Si l'utilisateur n'a aucune configuration, retourner 0
    if (error.status === 404) {
      return { success: true, nombre: 0 };
    }
    console.error("Erreur récupération nombre lunettes:", error);
    return { success: false, error: error.message, nombre: 0 };
  }
}

/**
 * Récupérer les lunettes de l'utilisateur via la vue lunettes_par_utilisateur
 * @param userId - ID de l'utilisateur (optionnel, utilise getCurrentUser() si non fourni)
 * @param dansLePanier - true = lunettes au panier, false = lunettes en galerie, undefined = toutes
 */
export async function getLunettesParUtilisateur(
  userId?: string,
  dansLePanier?: boolean
) {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const user = getCurrentUser();
      if (!user) {
        return {
          success: false,
          error: "Utilisateur non connecté",
          lunettes: [],
        };
      }
      targetUserId = user.id;
    }

    // Construire le filtre
    let filter = `user_id = "${targetUserId}"`;
    if (dansLePanier !== undefined) {
      filter += ` && est_dans_panier = ${dansLePanier}`;
    }

    const records = await pb
      .collection("lunettes_par_utilisateur")
      .getFullList<LunettesParUtilisateur>({
        filter,
        sort: "-created",
      });

    return { success: true, lunettes: records };
  } catch (error: any) {
    console.error("Erreur récupération lunettes par utilisateur:", error);
    return { success: false, error: error.message, lunettes: [] };
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

/**
 * ========================================
 * CHAT IA - Gestion de l'historique
 * ========================================
 */

/**
 * Récupérer la conversation active de l'utilisateur
 * (la plus récente ou en créer une nouvelle)
 */
export async function getChatConversation(userId?: string): Promise<{
  success: boolean;
  conversation?: ChatIA;
  error?: string;
}> {
  try {
    const currentUserId = userId || getCurrentUser()?.id;
    if (!currentUserId) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    // Chercher la conversation la plus récente
    const conversations = await pb.collection("chat_ia").getList<ChatIA>(1, 1, {
      filter: `user_id = "${currentUserId}"`,
      sort: "-updated",
    });

    if (conversations.items.length > 0) {
      const conv = conversations.items[0];

      // Limiter l'historique à 50 messages max (25 échanges)
      if (conv.messages && conv.messages.length > 50) {
        conv.messages = conv.messages.slice(-50);
        await pb.collection("chat_ia").update(conv.id, {
          messages: conv.messages,
        });
      }

      return { success: true, conversation: conv };
    } else {
      // Créer une nouvelle conversation
      const newConv = await pb.collection("chat_ia").create<ChatIA>({
        user_id: currentUserId,
        nom: "Nouvelle conversation",
        messages: [],
      });

      return { success: true, conversation: newConv };
    }
  } catch (error) {
    console.error("Erreur getChatConversation:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Ajouter un message à la conversation
 */
export async function addChatMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Récupérer la conversation actuelle
    const conversation = await pb
      .collection("chat_ia")
      .getOne<ChatIA>(conversationId);

    // Ajouter le nouveau message
    const newMessage: ChatMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(conversation.messages || []), newMessage];

    // Limiter à 50 messages max
    const limitedMessages = updatedMessages.slice(-50);

    // Générer un titre si c'est le premier message utilisateur
    let nom = conversation.nom;
    if (nom === "Nouvelle conversation" && role === "user") {
      // Prendre les 30 premiers caractères du message comme titre
      nom = content.substring(0, 30) + (content.length > 30 ? "..." : "");
    }

    // Mettre à jour la conversation
    await pb.collection("chat_ia").update(conversationId, {
      messages: limitedMessages,
      nom,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur addChatMessage:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Réinitialiser l'historique de conversation (reset)
 */
export async function resetChatConversation(userId?: string): Promise<{
  success: boolean;
  newConversation?: ChatIA;
  error?: string;
}> {
  try {
    const currentUserId = userId || getCurrentUser()?.id;
    if (!currentUserId) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    // Créer une nouvelle conversation vide
    const newConv = await pb.collection("chat_ia").create<ChatIA>({
      user_id: currentUserId,
      nom: "Nouvelle conversation",
      messages: [],
    });

    return { success: true, newConversation: newConv };
  } catch (error) {
    console.error("Erreur resetChatConversation:", error);
    return { success: false, error: String(error) };
  }
}

// Export par défaut pour compatibility
export default pb;
