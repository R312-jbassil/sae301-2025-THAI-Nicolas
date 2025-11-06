/**
 * Types pour les réponses API
 * Centralise les interfaces pour les endpoints API
 */

// ========================================
// RÉPONSES GÉNÉRIQUES
// ========================================

/**
 * Réponse API standard avec succès/erreur
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Réponse API paginée
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

// ========================================
// CHAT IA
// ========================================

/**
 * Message du chat IA
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

/**
 * Conversation du chat IA (collection PocketBase)
 */
export interface ChatIA {
  id: string;
  user_id: string;
  nom: string; // Titre de la conversation
  messages: ChatMessage[]; // Historique JSON
  configuration_resultat?: string; // ID de la config finale (optionnel)
  created: string;
  updated: string;
}

/**
 * Historique de conversation pour le chat
 */
export interface ConversationHistory {
  messages: ChatMessage[];
}

/**
 * Réponse de l'API chat IA
 */
export interface ChatApiResponse {
  action: "modify" | "info" | "error";
  changes?: {
    couleurVerres?: string;
    couleurMonture?: string;
    couleurBranches?: string;
    formeMonture?:
      | "rectangulaire"
      | "ronde"
      | "papillon"
      | "aviateur"
      | "carrée";
    typeVerres?: "correcteurs" | "solaires" | "photochromiques" | "polarisés";
    epaisseur?: "fin" | "moyen" | "épais";
  };
  message: string;
}

/**
 * Requête envoyée à l'API OpenRouter
 */
export interface OpenRouterRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * Réponse de l'API OpenRouter
 */
export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ========================================
// AUTHENTIFICATION
// ========================================

/**
 * Réponse de connexion
 */
export interface LoginResponse {
  success: boolean;
  user?: any;
  error?: string;
  needsVerification?: boolean;
}

/**
 * Réponse d'inscription
 */
export interface RegisterResponse {
  success: boolean;
  user?: any;
  message?: string;
  error?: string;
}

// ========================================
// CONFIGURATIONS
// ========================================

/**
 * Réponse de sauvegarde de configuration
 */
export interface SaveConfigurationResponse {
  success: boolean;
  configuration?: any;
  error?: string;
}

/**
 * Réponse de récupération des configurations
 */
export interface GetConfigurationsResponse {
  success: boolean;
  configurations?: any[];
  error?: string;
}

// ========================================
// PANIER
// ========================================

/**
 * Réponse d'ajout au panier
 */
export interface AddToCartResponse {
  success: boolean;
  error?: string;
}

/**
 * Réponse de récupération du panier
 */
export interface GetCartResponse {
  success: boolean;
  cart?: any;
  error?: string;
}

// ========================================
// COMMANDES
// ========================================

/**
 * Réponse de création de commande
 */
export interface CreateCommandeResponse {
  success: boolean;
  commande?: any;
  error?: string;
}
