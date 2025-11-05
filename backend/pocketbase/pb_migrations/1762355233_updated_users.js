/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "verificationTemplate": {
      "body": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n  <div style=\"background-color: #589772; padding: 30px; text-align: center;\">\n    <h1 style=\"color: white; margin: 0;\">TaVue</h1>\n  </div>\n  \n  <div style=\"padding: 40px 30px; background-color: #F0F7F4;\">\n    <h2 style=\"color: #1A1A1A; margin-top: 0;\">Bienvenue sur TaVue !</h2>\n    <p style=\"color: #4A5A54; font-size: 16px; line-height: 1.6;\">\n      Merci de vous être inscrit sur {APP_NAME}. Pour activer votre compte et commencer à créer vos lunettes personnalisées, \n      veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :\n    </p>\n    \n    <div style=\"text-align: center; margin: 40px 0;\">\n      <a href=\"{APP_URL}/verify-email?token={TOKEN}\" \n         style=\"background-color: #589772; color: white; padding: 15px 40px; \n                text-decoration: none; border-radius: 50px; font-weight: bold; \n                display: inline-block; font-size: 16px;\">\n        Vérifier mon email\n      </a>\n    </div>\n    \n    <p style=\"color: #4A5A54; font-size: 14px; line-height: 1.6;\">\n      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :\n      <br><br>\n      <a href=\"{APP_URL}/verify-email?token={TOKEN}\" style=\"color: #589772; word-break: break-all;\">\n        {APP_URL}/verify-email?token={TOKEN}\n      </a>\n    </p>\n    \n    <hr style=\"border: none; border-top: 1px solid #ddd; margin: 40px 0;\">\n    \n    <p style=\"color: #4A5A54; font-size: 13px; margin: 0;\">\n      Vous avez reçu cet email car quelqu'un a créé un compte sur TaVue avec cette adresse.\n      <br>Si ce n'est pas vous, vous pouvez ignorer cet email.\n    </p>\n  </div>\n  \n  <div style=\"background-color: #1A1A1A; padding: 20px; text-align: center;\">\n    <p style=\"color: #F0F7F4; margin: 0; font-size: 14px;\">\n      © 2025 TaVue - Lunettes personnalisées\n    </p>\n  </div>\n</div>"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "verificationTemplate": {
      "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    }
  }, collection)

  return app.save(collection)
})
