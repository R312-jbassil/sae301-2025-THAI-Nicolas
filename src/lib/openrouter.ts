/**
 * Configuration OpenRouter AI
 * Centralise les paramètres pour l'API OpenRouter
 */

// Récupération des variables d'environnement
const OR_TOKEN = import.meta.env.OR_TOKEN || "";
const OR_BASE_URL = import.meta.env.OR_URL || "https://openrouter.ai/api/v1";
const NOM_MODEL =
  import.meta.env.NOM_MODEL || "meta-llama/llama-3.1-8b-instruct:free";

/**
 * Configuration OpenRouter depuis les variables d'environnement
 */
export const openrouterConfig = {
  /** Token d'authentification OpenRouter */
  token: OR_TOKEN,

  /** URL de base de l'API OpenRouter */
  baseUrl: OR_BASE_URL,

  /** URL complète pour les requêtes de chat */
  url: `${OR_BASE_URL}/chat/completions`,

  /** Modèle à utiliser (ex: meta-llama/llama-3.1-8b-instruct:free) */
  model: NOM_MODEL,
};

/**
 * Vérifier si la configuration OpenRouter est complète
 */
export function isOpenRouterConfigured(): boolean {
  return !!(
    openrouterConfig.token &&
    openrouterConfig.url &&
    openrouterConfig.model
  );
}

export default openrouterConfig;
