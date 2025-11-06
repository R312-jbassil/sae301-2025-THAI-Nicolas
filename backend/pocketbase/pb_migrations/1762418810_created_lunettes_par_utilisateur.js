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
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_zfva",
        "max": 0,
        "min": 0,
        "name": "nom",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_9s61",
        "max": 0,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_5lvZ",
        "max": null,
        "min": null,
        "name": "prix",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_c3Hv",
        "max": 0,
        "min": 0,
        "name": "taille",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_bopI",
        "max": 0,
        "min": 0,
        "name": "couleur_monture",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_igUw",
        "max": 0,
        "min": 0,
        "name": "couleur_branches",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_KojN",
        "max": 0,
        "min": 0,
        "name": "couleur_verres",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_xkaN",
        "maxSelect": 1,
        "name": "forme_monture",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "rectangulaire",
          "ronde",
          "papillon",
          "carrée"
        ]
      },
      {
        "hidden": false,
        "id": "_clone_EPqF",
        "maxSelect": 1,
        "name": "epaisseur_monture",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "fin",
          "moyen",
          "épais"
        ]
      },
      {
        "hidden": false,
        "id": "_clone_I11y",
        "maxSelect": 1,
        "name": "types_verres",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "correcteurs",
          "solaires",
          "photochromiques",
          "polarisés"
        ]
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1486587212",
        "hidden": false,
        "id": "_clone_j5Ec",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "materiau_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "_clone_c5mg",
        "name": "est_dans_panier",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_BtIK",
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
        "id": "_clone_xumt",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "_clone_qQbQ",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_1656237163",
    "indexes": [],
    "listRule": "",
    "name": "lunettes_par_utilisateur",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n  id,\n  nom,\n  description,\n  prix,\n  taille,\n  couleur_monture,\n  couleur_branches,\n  couleur_verres,\n  forme_monture,\n  epaisseur_monture,\n  types_verres,\n  materiau_id,\n  est_dans_panier,\n  user_id,\n  created,\n  updated\nFROM configuration_lunettes",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1656237163");

  return app.delete(collection);
})
