/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_782564964")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date2917126107",
    "max": "",
    "min": "",
    "name": "date_commande",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number4159695454",
    "max": null,
    "min": null,
    "name": "prix",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_782564964")

  // remove field
  collection.fields.removeById("date2917126107")

  // remove field
  collection.fields.removeById("number4159695454")

  return app.save(collection)
})
