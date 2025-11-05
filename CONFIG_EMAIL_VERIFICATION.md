# Configuration de la vérification d'email dans PocketBase

## 1. Configuration du compte email Infomaniak

1. Rendez-vous sur https://manager.infomaniak.com/
2. Accueil → Mail Service → Nom du domaine réservé
3. Ajouter un nouveau compte de messagerie (ex: noreply@votre-domaine.ch)

## 2. Configuration dans PocketBase (localhost:8090/\_/)

### Paramètres de l'application

1. Allez dans **Settings** → **Application**
2. Définissez l'URL de l'application :
   - En développement : `http://localhost:4321`
   - En production : `https://tavue.nicolas-thai.fr`

### Paramètres de messagerie SMTP

1. Allez dans **Settings** → **Mail settings**
2. Configurez les paramètres suivants :

```
SMTP server host: mail.infomaniak.com
Port: 587
TLS Encryption: STARTTLS (cochez la case)
Username: votre-email@domaine.ch
Password: votre-mot-de-passe
Sender name: TaVue
Sender address: votre-email@domaine.ch
```

### Test de l'envoi d'email

1. Dans **Mail settings**, cliquez sur "Send test email"
2. Entrez votre adresse @edu.univ-fcomte.fr
3. Vérifiez la réception

## 3. Configuration du template d'email de vérification

1. Allez dans **Settings** → **Mail templates**
2. Sélectionnez **Verification** template
3. Modifiez le contenu pour correspondre à votre charte graphique :

**Sujet suggéré :**

```
Vérifiez votre compte TaVue
```

**Corps suggéré (HTML) :**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #589772; padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">TaVue</h1>
  </div>

  <div style="padding: 40px 30px; background-color: #F0F7F4;">
    <h2 style="color: #1A1A1A; margin-top: 0;">Bienvenue sur TaVue !</h2>
    <p style="color: #4A5A54; font-size: 16px; line-height: 1.6;">
      Merci de vous être inscrit. Pour activer votre compte et commencer à créer
      vos lunettes personnalisées, veuillez vérifier votre adresse email en
      cliquant sur le bouton ci-dessous :
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a
        href="{APP_URL}/verify-email?token={TOKEN}"
        style="background-color: #589772; color: white; padding: 15px 40px; 
                text-decoration: none; border-radius: 50px; font-weight: bold; 
                display: inline-block; font-size: 16px;"
      >
        Vérifier mon email
      </a>
    </div>

    <p style="color: #4A5A54; font-size: 14px; line-height: 1.6;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre
      navigateur :
      <br /><br />
      <a
        href="{APP_URL}/verify-email?token={TOKEN}"
        style="color: #589772; word-break: break-all;"
      >
        {APP_URL}/verify-email?token={TOKEN}
      </a>
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />

    <p style="color: #4A5A54; font-size: 13px; margin: 0;">
      Vous avez reçu cet email car quelqu'un a créé un compte sur TaVue avec
      cette adresse.
      <br />Si ce n'est pas vous, vous pouvez ignorer cet email.
    </p>
  </div>

  <div style="background-color: #1A1A1A; padding: 20px; text-align: center;">
    <p style="color: #F0F7F4; margin: 0; font-size: 14px;">
      © 2025 TaVue - Lunettes personnalisées
    </p>
  </div>
</div>
```

## 4. Variables disponibles dans les templates

PocketBase remplace automatiquement ces variables :

- `{APP_URL}` : URL de votre application
- `{TOKEN}` : Token de vérification unique
- `{ACTION_URL}` : URL complète avec le token (équivalent à {APP_URL}/verify-email?token={TOKEN})

## 5. Flux de vérification implémenté

1. **Inscription** (`/authentification`) :

   - Création du compte
   - Envoi automatique de l'email de vérification
   - Message : "Vérifiez votre email"
   - Redirection vers le formulaire de connexion après 3s

2. **Connexion** (`/authentification`) :

   - Vérification si l'email est validé
   - Si non validé : message d'erreur avec bouton "Renvoyer l'email"
   - Si validé : connexion réussie

3. **Page de vérification** (`/verify-email?token=...`) :

   - État de chargement
   - État de succès → bouton "Se connecter"
   - État d'erreur → bouton "Retour"

4. **Page compte** (`/compte`) :
   - Affichage du statut de vérification
   - Bouton "Renvoyer" si non vérifié
   - Badge vert "Email vérifié ✓" si vérifié

## 6. Test du système

1. Créez un nouveau compte avec un vrai email
2. Vérifiez la réception de l'email
3. Cliquez sur le lien de vérification
4. Vérifiez que la page `/verify-email` affiche le succès
5. Connectez-vous avec le compte vérifié
6. Vérifiez que la connexion fonctionne

## 7. Dépannage

**L'email n'arrive pas :**

- Vérifiez les paramètres SMTP dans PocketBase
- Vérifiez les logs de PocketBase (onglet Logs)
- Testez avec "Send test email"
- Vérifiez les spams

**Le token est invalide :**

- Les tokens expirent après 72h
- Utilisez le bouton "Renvoyer l'email"

**L'URL de vérification est incorrecte :**

- Vérifiez l'URL de l'application dans Settings → Application
- Assurez-vous que la route `/verify-email` existe

## 8. En production

N'oubliez pas de :

1. Changer l'URL de l'application dans PocketBase en production
2. Mettre à jour les paramètres SMTP si nécessaire
3. Tester l'envoi d'email depuis le serveur de production
4. Configurer SPF/DKIM pour Infomaniak (améliore la délivrabilité)
