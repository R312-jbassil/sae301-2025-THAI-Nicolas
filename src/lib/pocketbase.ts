/**
 * Configuration de PocketBase
 * Instance singleton pour toute l'application
 */

import PocketBase from "pocketbase";

// Configuration de l'URL selon l'environnement
const POCKETBASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8090" // Développement local
    : "https://tavue.nicolas-thai.fr:443"; // Production VPS

/**
 * Instance PocketBase singleton
 * Utilisé dans toute l'application pour les appels API
 */
export const pb = new PocketBase(POCKETBASE_URL);

// Désactiver l'annulation automatique des requêtes
pb.autoCancellation(false);

export default pb;
