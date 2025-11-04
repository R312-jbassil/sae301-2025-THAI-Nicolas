/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1486587212")

  // update collection data
  unmarshal({
    "name": "materiaux"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1486587212")

  // update collection data
  unmarshal({
    "name": "materiau"
  }, collection)

  return app.save(collection)
})
