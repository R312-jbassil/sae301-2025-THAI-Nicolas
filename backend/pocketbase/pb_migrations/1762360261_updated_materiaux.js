/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1486587212")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1952380356",
    "max": null,
    "min": null,
    "name": "prix_supplementaire",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1486587212")

  // remove field
  collection.fields.removeById("number1952380356")

  return app.save(collection)
})
