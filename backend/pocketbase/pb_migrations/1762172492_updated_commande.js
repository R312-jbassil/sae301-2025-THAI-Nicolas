/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_782564964")

  // update collection data
  unmarshal({
    "name": "commandes"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_782564964")

  // update collection data
  unmarshal({
    "name": "commande"
  }, collection)

  return app.save(collection)
})
