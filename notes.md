## Update acteur

### Mongo

-> sélectionner l'acteur
-> modifier son nom
-> trouver tous les films dans lequel il est référencé
-> modifier le nom dans l'ensemble de ces films

db.products.updateOne(
   { _id: 100 },
   { $set: { "details.make": "Kustom Kidz" } }
)

https://www.mongodb.com/docs/manual/reference/operator/update/positional/
-> db.movies.updateMany(
  {
    "actors.id": ObjectId(
      "670fbb656722eb7facbd188f"
    )
  },
  {	 $set: { "actors.$.name": "boo" }
	}
)

### SQLite

modification de la table acteur seulement.

## ToDO

- update liste acteurs d'un film
- insert d'un film avec données associées existantes (acteurs, ...)
- front avec formulaire