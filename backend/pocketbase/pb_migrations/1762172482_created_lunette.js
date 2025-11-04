/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "",
    "deleteRule": "",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
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
        "id": "text3949269562",
        "max": 0,
        "min": 0,
        "name": "code_svg",
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
        "id": "text345886070",
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
        "id": "text3264248446",
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
        "id": "text2480739828",
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
        "id": "select1081523038",
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
          "carée"
        ]
      },
      {
        "hidden": false,
        "id": "select3701563584",
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
        "id": "select90514272",
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
        "hidden": false,
        "id": "number438371369",
        "max": null,
        "min": null,
        "name": "taille_verres",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_340737475",
    "indexes": [],
    "listRule": "",
    "name": "lunette",
    "system": false,
    "type": "base",
    "updateRule": "",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_340737475");

  return app.delete(collection);
})
