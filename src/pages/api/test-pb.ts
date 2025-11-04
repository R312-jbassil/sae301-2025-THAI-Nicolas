/**
 * Endpoint API de test PocketBase
 * GET /api/test-pb
 */

import type { APIRoute } from "astro";
import { pb } from "../../utils/pocketbase";

export const GET: APIRoute = async () => {
  try {
    // Test de connexion basique avec le health check
    const health = await pb.health.check();

    // Test simple : récupérer les collections publiques sans auth
    // On teste juste que PocketBase répond
    let collectionsTest = "Non testé (nécessite auth admin)";

    try {
      // Essayer de lire une collection publique si elle existe
      const testRead = await pb.collection("lunette").getList(1, 1);
      collectionsTest = "Collections accessibles ✅";
    } catch (e: any) {
      // C'est normal si aucune donnée n'existe encore
      if (e.status === 404 || e.status === 403) {
        collectionsTest =
          "Collections existent mais vides ou protégées (normal) ✅";
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Connexion PocketBase réussie ✅",
        pbUrl: pb.baseUrl,
        health: health,
        collectionsTest: collectionsTest,
        info: "PocketBase est connecté et répond correctement",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur de connexion PocketBase ❌",
        error: error.message,
        pbUrl: pb.baseUrl,
        details: "Vérifie que PocketBase tourne sur le port 8090",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
