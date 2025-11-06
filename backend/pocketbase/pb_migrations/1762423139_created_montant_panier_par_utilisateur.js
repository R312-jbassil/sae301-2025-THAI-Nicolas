/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_8UKC",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json2397497392",
        "maxSize": 1,
        "name": "montant_total",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "number3388303801",
        "max": null,
        "min": null,
        "name": "nombre_articles",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_3404846220",
    "indexes": [],
    "listRule": "",
    "name": "montant_panier_par_utilisateur",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n  (ROW_NUMBER() OVER()) as id,\n  user_id,\n  SUM(prix) as montant_total,\n  COUNT(*) as nombre_articles\nFROM configuration_lunettes\nWHERE est_dans_panier = true\nGROUP BY user_id",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3404846220");

  return app.delete(collection);
})
