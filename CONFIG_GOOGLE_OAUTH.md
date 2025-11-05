# Configuration de l'authentification Google OAuth avec PocketBase

## 📋 Vue d'ensemble

L'authentification OAuth permet aux utilisateurs de se connecter avec leur compte Google sans créer de mot de passe. C'est plus rapide et plus sécurisé.

## 1️⃣ Créer un projet Google Cloud

### Étape 1 : Accéder à Google Cloud Console

1. Allez sur https://console.cloud.google.com/
2. Connectez-vous avec votre compte Google
3. En haut à gauche, cliquez sur **"Select a project"** (Sélectionner un projet)
4. Cliquez sur **"NEW PROJECT"** (Nouveau projet)

### Étape 2 : Créer le projet

1. **Nom du projet** : `TaVue` (ou ce que vous voulez)
2. **Organization** : Laissez par défaut (ou choisissez votre organisation)
3. Cliquez sur **"CREATE"** (Créer)
4. Attendez quelques secondes que le projet soit créé
5. Sélectionnez votre nouveau projet dans le menu déroulant en haut

## 2️⃣ Configurer l'écran de consentement OAuth

### Étape 3 : Accéder aux APIs & Services

1. Dans le menu hamburger (☰) à gauche, allez dans **"APIs & Services"** → **"OAuth consent screen"**
2. Sélectionnez **"External"** (pour permettre à n'importe qui de se connecter)
3. Cliquez sur **"CREATE"** (Créer)

### Étape 4 : Remplir les informations de l'application

**Page 1 : OAuth consent screen**

```
App name: TaVue
User support email: votre-email@gmail.com (ou @edu.univ-fcomte.fr)
App logo: (optionnel, vous pouvez l'ajouter plus tard)
Application home page: http://localhost:4321 (en dev) ou https://tavue.nicolas-thai.fr (en prod)
Application privacy policy link: http://localhost:4321/privacy (ou créez une page de confidentialité)
Application terms of service link: http://localhost:4321/terms (ou créez une page de CGU)
Authorized domains: localhost (en dev) ou nicolas-thai.fr (en prod)
Developer contact information: votre-email@gmail.com
```

Cliquez sur **"SAVE AND CONTINUE"**

**Page 2 : Scopes**

1. Cliquez sur **"ADD OR REMOVE SCOPES"**
2. Cochez les scopes suivants :
   - `../auth/userinfo.email` (Email)
   - `../auth/userinfo.profile` (Profil de base)
   - `openid`
3. Cliquez sur **"UPDATE"**
4. Cliquez sur **"SAVE AND CONTINUE"**

**Page 3 : Test users** (seulement en mode développement)

1. Cliquez sur **"ADD USERS"**
2. Ajoutez votre email @edu.univ-fcomte.fr (et d'autres emails de test si besoin)
3. Cliquez sur **"SAVE AND CONTINUE"**

**Page 4 : Summary**

- Vérifiez que tout est correct
- Cliquez sur **"BACK TO DASHBOARD"**

## 3️⃣ Créer les identifiants OAuth

### Étape 5 : Créer un OAuth Client ID

1. Dans le menu de gauche, allez dans **"Credentials"** (Identifiants)
2. Cliquez sur **"+ CREATE CREDENTIALS"** en haut
3. Sélectionnez **"OAuth client ID"**

### Étape 6 : Configurer le client OAuth

```
Application type: Web application
Name: TaVue OAuth Client

Authorized JavaScript origins:
  - http://localhost:4321 (développement)
  - http://localhost:8090 (PocketBase local)
  - https://tavue.nicolas-thai.fr (production - à ajouter plus tard)

Authorized redirect URIs:
  - http://localhost:8090/api/oauth2-redirect (développement)
  - https://tavue.nicolas-thai.fr:443/api/oauth2-redirect (production - à ajouter plus tard)
```

⚠️ **IMPORTANT** : L'URL de redirection DOIT pointer vers votre serveur PocketBase (port 8090 en local), PAS vers votre application Astro (port 4321) !

Cliquez sur **"CREATE"**

### Étape 7 : Récupérer vos identifiants

Une popup va s'afficher avec :

- **Client ID** : quelque chose comme `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret** : quelque chose comme `GOCSPX-abcdefghijklmnop`

⚠️ **IMPORTANT** : Notez ces deux valeurs, vous en aurez besoin ! Vous pouvez toujours les retrouver en cliquant sur votre OAuth client dans la liste.

## 4️⃣ Configurer PocketBase

### Étape 8 : Activer Google OAuth dans PocketBase

1. Allez dans PocketBase admin : http://localhost:8090/\_/
2. Allez dans **Collections** → **users**
3. Cliquez sur l'onglet **"Options"**
4. Faites défiler jusqu'à **"OAuth2 providers"**
5. Activez **Google** (toggle à ON)

### Étape 9 : Remplir les identifiants

```
Client ID: [Collez le Client ID de Google]
Client Secret: [Collez le Client Secret de Google]
```

Cliquez sur **"Save"** en bas de la page

## 5️⃣ Tester l'authentification Google

### Méthode 1 : Test depuis PocketBase Admin

1. Dans PocketBase admin, allez dans Collections → users
2. Cliquez sur **"+ New record"**
3. Vous devriez voir un bouton **"Auth with Google"**
4. Cliquez dessus pour tester

### Méthode 2 : Test depuis votre application

Votre bouton Google dans `/authentification` est déjà prêt ! Il suffit maintenant de le rendre fonctionnel.

## 6️⃣ Activer les boutons OAuth dans votre application

Les boutons sont déjà dans l'interface, il faut juste les connecter à la fonction `loginWithOAuth()`.

Voici ce qui va se passer :

1. L'utilisateur clique sur le bouton Google
2. Il est redirigé vers Google pour se connecter
3. Google le redirige vers PocketBase avec un token
4. PocketBase crée/connecte l'utilisateur
5. L'utilisateur est redirigé vers votre application (galerie)

Le code est déjà dans `pb.ts`, il faut juste ajouter les event listeners sur les boutons !

## 7️⃣ Vérifications avant de tester

✅ **Checklist :**

- [ ] Projet Google Cloud créé
- [ ] OAuth consent screen configuré
- [ ] Test users ajoutés (si en mode développement)
- [ ] OAuth Client ID créé
- [ ] Client ID et Secret notés
- [ ] Google OAuth activé dans PocketBase
- [ ] Client ID et Secret configurés dans PocketBase
- [ ] PocketBase tourne sur http://localhost:8090
- [ ] Astro tourne sur http://localhost:4321

## 8️⃣ En cas d'erreur

### Erreur : "redirect_uri_mismatch"

- Vérifiez que l'URL de redirection dans Google Cloud est exactement : `http://localhost:8090/api/oauth2-redirect`
- Pas de slash à la fin !
- Le port doit être 8090 (PocketBase), pas 4321 (Astro)

### Erreur : "Access blocked: This app's request is invalid"

- Vérifiez que vous avez bien rempli l'écran de consentement OAuth
- Ajoutez votre email dans les "Test users"

### Erreur : "Client ID invalide"

- Vérifiez que vous avez bien copié le Client ID et Secret dans PocketBase
- Pas d'espaces avant ou après

## 9️⃣ Pour la production

Quand vous déploierez sur votre serveur, il faudra :

1. **Dans Google Cloud Console** :

   - Ajouter `https://tavue.nicolas-thai.fr` dans Authorized JavaScript origins
   - Ajouter `https://tavue.nicolas-thai.fr:443/api/oauth2-redirect` dans Authorized redirect URIs

2. **Dans PocketBase en production** :

   - Settings → Application : URL = `https://tavue.nicolas-thai.fr`
   - Les identifiants OAuth restent les mêmes

3. **Passer en mode Production** (optionnel mais recommandé) :
   - Dans Google Cloud Console → OAuth consent screen
   - Cliquez sur "PUBLISH APP"
   - Soumettez l'application pour vérification (si vous voulez que tout le monde puisse s'inscrire)

---

## 🎯 Prochaine étape

Maintenant que Google OAuth est configuré dans PocketBase, je vais modifier le code pour connecter les boutons OAuth de votre interface !

Dites-moi quand vous avez terminé la configuration dans Google Cloud Console et PocketBase, et je modifierai le code pour que les boutons fonctionnent ! 🚀
