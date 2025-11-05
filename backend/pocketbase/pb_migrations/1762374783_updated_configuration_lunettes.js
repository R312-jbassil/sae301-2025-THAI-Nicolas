/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_340737475")

  // update field
  collection.fields.addAt(7, new Field({
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
      "carrée"
    ]
  }))

  // update field
  collection.fields.addAt(8, new Field({
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
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_340737475")

  // update field
  collection.fields.addAt(7, new Field({
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
  }))

  // update field
  collection.fields.addAt(8, new Field({
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
      "épais",
      "test"
    ]
  }))

  return app.save(collection)
})
