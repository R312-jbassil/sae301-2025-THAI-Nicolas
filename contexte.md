# Contexte du Projet TaVue - Configurateur de Lunettes Personnalisées

## 📋 Résumé du Projet

TaVue est une plateforme e-commerce innovante permettant aux utilisateurs de créer et commander des paires de lunettes entièrement personnalisées. Le site propose un **configurateur interactif** basé sur une expérience utilisateur engageante, combinant technologie et psychologie comportementale pour maximiser les conversions et l'engagement utilisateur.

**Cible démographique :** Marché unisexe, 25-50 ans  
**Philosophie de marque :** Fabrication française, style raffiné, minimaliste et épuré

---

## 🎯 Objectif Marketing SMART

**Objectif :** Augmenter le taux de conversion des utilisateurs occasionnels en clients payants en impliquant émotionnellement l'utilisateur dans la création de son modèle unique, avec un **taux cible de 35% de conversion** sur 6 mois et une **augmentation de 25-30% du taux de récupération des paniers abandonnés** via séquences email.

**Mesures :**

- Nombre de configurations enregistrées / Nombre de visiteurs
- Nombre de créations de compte post-personnalisation
- Taux d'abandon de panier et taux de récupération
- Valeur moyenne des commandes

---

## 🏗️ Architecture Technique

### Stack Technologique Requis

- **Framework Frontend :** Astro JS
- **Styling :** Tailwind CSS
- **Backend / Base de données :** PocketBase (base de données locale SQLite)
- **Authentification :** PocketBase + OAuth (Google, Apple)
- **Génération SVG :** IA OpenRouter (gpt-oss-20b)
- **Déploiement :** VPS avec GitHub Actions, certificat Let's Encrypt (HTTPS)
- **Hébergement DNS :** Domaine personnalisé

### Structure du Projet Astro

```
src/
├── layouts/          # Templates réutilisables (Layout.astro)
├── pages/            # Pages du site (configurateur, authentification, produits)
├── components/       # Composants réutilisables
├── api/             # Endpoints (api/saveSVG.js, authentification)
├── styles/          # Configuration Tailwind personnalisée
└── utils/           # Utilitaires (appels PocketBase, gestion SVG)
```

### Modèles de Données PocketBase

- **Collection users :** Utilisateurs authentifiés
- **Collection glasses_models :** Modèles de lunettes sauvegardés
- **Collection materials :** Matériaux disponibles (monture, branches)
- **Collection svg_library :** Bibliothèque SVG des lunettes configurées
- **Collection orders :** Commandes passées
- **Collection carts :** Paniers (pour récupération abandonnés)

---

## 📄 Pages du Site

### 1. **Page Configurateur (Personnalisation)**

- Formulaires interactifs pour personnaliser :
  - Matériau monture & branches
  - Largeur du pont
  - Taille des verres
  - Couleurs & finitions
- Prévisualisation en temps réel du SVG
- Barre de progression (nudge : effet de progression)
- CTA émotionnel pour sauvegarde
- Option par défaut intelligente pré-configurée (nuance harmonieuse)
- Indication de rareté si limitations stock/matériau

### 2. **Page Authentification**

- Formulaires d'inscription / connexion minimaliste
- Authentification OAuth (Google, Apple) en évidence
- Redirection vers création de compte APRÈS personnalisation (biais escalade engagement)
- Messages contextuels selon l'étape utilisateur

### 3. **Page Galerie de Produits**

- Affichage des modèles sauvegardés par l'utilisateur
- Visualisation des détails de chaque paire
- Bouton modification / suppression
- Preuve sociale : "200+ utilisateurs ont personnalisé ce modèle"
- Avis et notations
- Possibilité d'ajouter au panier directement

### 4. **Page Détail Produit (Vue Unique)**

- Visualisation détaillée SVG de la paire
- Caractéristiques techniques
- Essai à domicile 5 jours (nudge : effet de dotation)
- CTA d'achat avec urgence temporelle

---

## 🧠 Nudges Marketing & Biais Cognitifs à Implémenter

### 1. **Création de Compte Post-Personnalisation (Biais : Escalade d'Engagement)**

**Implémentation :**

- Laisser utilisateur personnaliser SANS compte obligatoire
- Au moment de "Sauvegarder" → Redirection formulaire création compte
- Afficher investissement temps ("Vous avez dépensé 5 min sur ce modèle unique")
- Message émotionnel : "Créez votre compte pour sauvegarder MON modèle unique"

**Impact psychologique :** L'utilisateur a déjà investi du temps et de l'attachement émotionnel → Probabilité d'inscription ↑

---

### 2. **Barre de Progression dans le Configurateur (Effet de Progression)**

**Implémentation :**

- Afficher progression visuelle (30% → 60% → 80%)
- À 80%, activer CTA "Finaliser ma création"
- Message motivant : "Plus que 20% pour finaliser MON modèle !"

**Impact psychologique :** Effet Zeigarnik - l'utilisateur est poussé à compléter la boucle pour obtenir satisfaction

---

### 3. **Call To Action Émotionnel (Effet d'Appropriation)**

**Implémentation :**

- Remplacer CTA neutres par verbes émotionnels
- Exemples de formulations :
  - ❌ "Sauvegarder" → ✅ "Créer MON modèle unique"
  - ❌ "Ajouter au panier" → ✅ "Commander MES lunettes personnalisées"
  - ❌ "Continuer" → ✅ "Finaliser MA création"
  - ❌ "S'inscrire" → ✅ "Protéger MON modèle UNIQUE"

**Impact psychologique :** Sentiment d'appropriation renforce engagement émotionnel et probabilité d'action

---

### 4. **Option par Défaut Intelligente (Biais du Statu Quo)**

**Implémentation :**

- Pré-configurer le configurateur avec choix harmonieux par défaut :
  - Matériau classique mais refined (acétate noir)
  - Couleur intemporelle
  - Proportions équilibrées
- Au lieu de laisser formulaire vide → Utilisateur part d'une base solide
- 90% garderont le défaut ou l'utiliseront comme base

**Impact psychologique :** Réduit paralysie du choix, augmente taux d'achèvement

---

### 5. **Preuve Sociale (Biais de Conformité Sociale)**

**Implémentation :**

- Afficher : "Plus de 200 utilisateurs ont déjà customisé ce modèle"
- Badge "Bestseller" sur modèles populaires
- Intégrer avis et notations (4.8/5 ⭐)
- Témoignages utilisateurs : "J'adore mes lunettes personnalisées !"
- Section "Modèles tendance cette semaine"

**Impact psychologique :** Conformité sociale rassure et valide les choix → Réduit incertitude, augmente confiance

---

### 6. **Authentification 1-Clic (Aversion à la Perte)**

**Implémentation :**

- Proposer connexion via Google, Apple, Microsoft en évidence
- Alternative : formulaire email/password minimal
- Message : "Connexion sécurisée en 1 clic"
- Design : Boutons OAuth XXL, formulaire traditionnel en secondaire

**Impact psychologique :**

- Temps de connexion divisé par 10
- Peur de la perte de données sensibles résolue (confiance maximale)
- Réduction friction = augmentation taux conversion

---

### 7. **Rareté & Exclusivité (Effet de Rareté)**

**Implémentation :**

- Afficher limitation réelle : "Seulement 15 paires disponibles en matériau cuir Hermès"
- Badge "Matériau limité" sur produits exclusifs
- Countdown si stock faible : "⏰ 3 paires restantes"
- JAMAIS artificiel - données réelles depuis PocketBase

**Impact psychologique :** FOMO (Fear Of Missing Out) augmente valeur perçue et urgence d'achat

---

### 8. **Récupération Panier Abandonné (Effet Zeigarnik + Aversion à la Perte)**

**Implémentation :**

- Sauvegarder panier même si utilisateur quitte
- Séquence email automatisée (jours 1, 3, 7) :
  - J1 : "Vous avez oublié vos lunettes ! 👓"
  - J3 : "Votre création MON unique attend..."
  - J7 : "-15% pour récupérer votre panier"
- Bouton "Restaurer mon panier" personnalisé
- Afficher investissement temps : "Vous aviez configuré 5 min"

**Cible :** Récupérer 25-35% des 72% de paniers abandonnés = +18-25% CA supplémentaire

**Impact psychologique :** Zeigarnik (tâche inachevée) + Aversion à la perte (réduction temporaire)

---

### 9. **Essai à Domicile - Effet de Dotation**

**Implémentation :**

- CTA : "Essayer 5 paires GRATUITEMENT pendant 5 jours"
- Message : "Découvrez vos lunettes chez vous, sans engagement"
- Processus : Utilisateur choisit 5 modèles → Livraison gratuite → Retour simple
- Seules paires "essayées" convertissent en achat réel

**Impact psychologique :**

- Réciprocité : utilisateur se sent redevable
- Effet de dotation : après avoir porté 5 jours → difficile de renvoyer
- Confiance maximale : test produit réel avant achat

---

## 🎨 Directives Design & Contenu

### Ton Rédactionnel

- **Minimaliste et épuré** (cohérent avec identité TaVue)
- **Émotionnel sans lourdeur** (utiliser "MON", "MES", "UNIQUE")
- **Concis et impactant** (une idée par CTA)
- **Français premium** (pas de "clickbait")

### Éléments Non-Traitables par l'IA VS Code

- Identité visuelle complète (palettes Tailwind déjà définies)
- Design des composants (déjà en maquette Figma)
- Photographies produits
- Illustrations custom

### Contenu à Générer

- Descriptions produits intégrant nudges MKG
- Messages contextuels (success, error, empty states)
- Microcopy des CTA (voir nudge #3)
- Emails de récupération panier
- Témoignages utilisateurs

---

## 🔧 Contraintes Techniques Importantes

### Sécurité & Authentification

- ✅ Utiliser PocketBase pour authentification OAuth
- ✅ Certificat HTTPS Let's Encrypt obligatoire
- ✅ Règles d'accès PocketBase strictes (lire/écrire ses propres données)
- ✅ API endpoints sécurisés (api/saveSVG.js, etc.)

### Performance & UX

- ✅ SVG optimisé (génération via IA, validation)
- ✅ Prévisualisation temps réel du configurateur
- ✅ Responsive design (mobile-first, tested sur 1920px desktop)
- ✅ Transitions visuelles fluides (CSS animations, Tailwind)

### Accessibilité & SEO

- ✅ Métadonnées HTML (title, description, Open Graph)
- ✅ Structure sémantique (heading hierarchy, ARIA labels)
- ✅ Contraste & lisibilité conformes WCAG
- ✅ Alt text sur images & SVG

### Déploiement & CI/CD

- ✅ Pipeline GitHub Actions automatisé
- ✅ Déploiement VPS (port 80 ou 443)
- ✅ Dossier PocketBase dans racine projet (`/pocketbase`)
- ✅ Documentation complète (deployment.txt, users.txt)

---

## 📊 Métriques à Tracker

- **Taux de completion du configurateur :** % d'utilisateurs qui finalisent configuration
- **Taux de création de compte :** % qui créent compte post-personnalisation
- **Taux de conversion configurateur → achat :** % configurations sauvegardées transformées en commandes
- **Taux d'abandon panier & récupération :** baseline 72% abandon, cible 25-35% récupération
- **AOV (Average Order Value) :** montant moyen par commande
- **Score de satisfaction :** avis, notations, NPS

---

## 🚀 Checklist Implémentation Nudges MKG

- [ ] Formulaire vide remplacé par config par défaut harmonieuse
- [ ] Barre progression visible & motivante dans configurateur
- [ ] CTA utilisant "MON", "MES", "UNIQUE", "PERSONNALISÉ"
- [ ] Redirection création compte juste avant sauvegarde
- [ ] Affichage preuve sociale (nombre utilisateurs, avis, badges)
- [ ] Boutons OAuth XXL & évidents (vs formulaire email)
- [ ] Affichage limitations stock/matériau si réelles
- [ ] Séquence email panier abandonné configurée
- [ ] Landing page essai domicile avec CTA dédié
- [ ] Microcopy contextualisée (temps investi, étapes, urgence)

---

## 📝 Notes pour l'IA Intégrée VS Code

Cette IA doit donc :

1. **Respecter l'architecture Astro** (layouts → pages → components)
2. **Suivre la philosophie de marque TaVue** (minimaliste, épuré, français)
3. **Intégrer les nudges MKG** identifiés dans le code & les messages (voir checklist)
4. **Générer du contenu rédactionnel** aligné avec la psychologie comportementale
5. **Utiliser PocketBase correctement** (appels API, validations, règles d'accès)
6. **Respecter les directives design** (Tailwind, pas de modifications visuelles)
7. **Optimiser conversions** (UX fluide, friction minimale, emotional engagement maximal)
8. **Sécuriser les données** (authentification, autorisations, validations)

---

**Document généré pour le projet TaVue - Configurateur de lunettes personnalisées**  
**Version :** 1.0  
**Date :** 2025-11-04
