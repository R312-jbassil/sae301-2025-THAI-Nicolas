import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  console.log("=== API Chat appelée ===");

  try {
    const { message, conversationHistory } = await request.json();
    console.log("Message reçu:", message);

    // Récupérer les variables d'environnement
    const OR_TOKEN = import.meta.env.OR_TOKEN;
    const OR_URL = import.meta.env.OR_URL;
    const NOM_MODEL = import.meta.env.NOM_MODEL;

    console.log("Variables env:", {
      hasToken: !!OR_TOKEN,
      url: OR_URL,
      model: NOM_MODEL,
    });

    if (!OR_TOKEN || !OR_URL || !NOM_MODEL) {
      console.error("Configuration manquante!");
      return new Response(
        JSON.stringify({ error: "Configuration API manquante" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construire le prompt système pour l'assistant lunettes
    const systemPrompt = `Tu es un assistant IA pour le configurateur de lunettes TaVue. 
Ton rôle est de MODIFIER DIRECTEMENT la configuration des lunettes en fonction des demandes en langage naturel de l'utilisateur.

Tu dois analyser la demande et retourner un objet JSON avec les modifications à appliquer.

FORMAT DE RÉPONSE OBLIGATOIRE :
{
  "action": "modify",
  "changes": {
    "couleurVerres": "#HEX" (optionnel),
    "couleurMonture": "#HEX" (optionnel),
    "couleurBranches": "#HEX" (optionnel),
    "formeMonture": "rectangulaire|ronde|papillon|aviateur|carrée" (optionnel),
    "typeVerres": "correcteurs|solaires|photochromiques|polarisés" (optionnel),
    "epaisseur": "fin|moyen|épais" (optionnel)
  },
  "message": "Message de confirmation à afficher à l'utilisateur"
}

COULEURS DISPONIBLES :
- Noir: #1A1A1A
- Gris: #4A5A54
- Marron: #8B4513
- Beige: #D4B896
- Bleu: #2E5A87
- Vert: #5c8d6f
- Rouge: #C41E3A
- Rose: #E6A8D7
- Violet: #7B68EE
- Orange: #FF8C00
- Jaune: #FFD700
- Blanc: #FFFFFF

Si l'utilisateur demande une couleur non listée, trouve le code HEX le plus proche.

EXEMPLES :
- "mets les verres en rouge" → {"action": "modify", "changes": {"couleurVerres": "#C41E3A"}, "message": "Verres changés en rouge !"}
- "je veux une monture noire" → {"action": "modify", "changes": {"couleurMonture": "#1A1A1A"}, "message": "Monture changée en noir !"}
- "forme ronde avec branches bleues" → {"action": "modify", "changes": {"formeMonture": "ronde", "couleurBranches": "#2E5A87"}, "message": "Forme ronde et branches bleues appliquées !"}
- "tout en noir" → {"action": "modify", "changes": {"couleurMonture": "#1A1A1A", "couleurBranches": "#1A1A1A", "couleurVerres": "#1A1A1A"}, "message": "Configuration entièrement noire appliquée !"}

Réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire.
Si la demande n'est pas claire, demande des précisions en utilisant : {"action": "clarify", "message": "Votre question ici"}`;

    // Construire l'historique de conversation pour l'API
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    console.log("Appel à OpenRouter avec le modèle:", NOM_MODEL);
    console.log("Nombre de messages dans l'historique:", messages.length);

    // Appeler l'API OpenRouter avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 secondes timeout

    const response = await fetch(`${OR_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OR_TOKEN}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tavue.nicolas-thai.fr",
        "X-Title": "TaVue Assistant",
      },
      body: JSON.stringify({
        model: NOM_MODEL,
        messages: messages,
        temperature: 0.3, // Baisser pour plus de cohérence
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("Réponse OpenRouter status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur OpenRouter:", errorData);
      return new Response(
        JSON.stringify({
          error: "Erreur lors de l'appel à l'API: " + errorData,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Réponse complète OpenRouter:", JSON.stringify(data, null, 2));

    const aiMessage =
      data.choices[0]?.message?.content ||
      "Désolé, je n'ai pas pu générer une réponse.";
    console.log("Message IA extrait:", aiMessage);

    return new Response(JSON.stringify({ message: aiMessage }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur dans l'API chat:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
