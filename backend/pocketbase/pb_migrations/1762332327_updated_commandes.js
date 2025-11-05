/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_782564964")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number4159695454",
    "max": null,
    "min": null,
    "name": "prix_total",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_782564964")

  // update field
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
})
