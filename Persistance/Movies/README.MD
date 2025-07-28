# Moteur de recherche de films avec MongoDB

Cet exercice se concentre sur l'implémentation de requêtes MongoDB complexes combinant filtres, projections, tri et une combinaison de plusieurs critères.

L'exercice couvre les notions de base de requêtes MongoDB avec le pilote NodeJS, en particulier la construction dynamique de filtres, l'utilisation des opérateurs de comparaison et logiques, ainsi que la manipulation des projections et du tri.

Le code source initial du serveur vous est fourni dans le répertoire `server`. Vous devez lancer le serveur avec la commande `npm start` dans le répertoire `server`.

N'oubliez pas d'installer les dépendances nécessaires avec `npm ci` dans avant de lancer le serveur.

## Objectif de l'exercice

L'objectif principal est d'implémenter la fonction `searchMovies` dans le fichier [movieManager.js](./server/src/movieManager.js) qui permettra de :

1. **Extraire et valider les paramètres de requête** pour construire des filtres dynamiques
2. **Construire des filtres dynamiques** basés sur les paramètres de requête
3. **Appliquer des projections** pour contrôler les champs retournés
4. **Implémenter le tri** sur différents critères
5. **Combiner tous ces éléments** dans une seule requête MongoDB

## Structure des données

Une banque de données vous est fournie dans le fichier [movies.json](./server/data/movies.json). Des valeurs par défauts pour le nom de la BD et la collection sont définies dans le fichier [env.js](./server/src/env.js). Vous pouvez modifier ces valeurs si nécessaire.

La collection dans MongoDB est vidée et remplie avec ces données à chaque lancement du serveur.

Chaque film dans la base de données MongoDB a la structure suivante :

```javascript
{
  _id: ObjectId,
  title: "The Matrix",
  year: 1999,
  genre: ["Action", "Sci-Fi"],
  director: "Wachowski Sisters",
  country: "USA",
  language: "English",
  runtime: 136, // en minutes
  imdbRating: 8.7,
  budget: 63000000,
  boxOffice: 467222824,
  releaseDate: "1999-03-31T00:00:00.000Z", // format ISO 8601
}
```

## Travail à compléter

### GET /movies/search

Cette route unique est le point d'entrée pour la recherche de films. Elle permet d'appliquer un ensemble de paramètres de recherche et retourner le résultat trouvé dans la base de données. Tous les paramètres sont optionnels et se trouvent dans l'URI. La route doit supporter les paramètres de requête suivants :

**Paramètres de filtrage :**
- `year` - Année exacte (a priorité sur les plages d'années)
- `yearFrom` & `yearTo` - Plage d'années
- `genre` - Liste de genres (OU logique) séparés par des virgules (par exemple `genre=Action,Sci-Fi`)
- `director` - Recherche partielle dans le nom du réalisateur (par exemple `director=Nolan` pour `Christopher Nolan`)
- `country` - Pays exact
- `language` - Langue exacte
- `minRating` & `maxRating` - Plage de note IMDB
- `minRuntime` & `maxRuntime` - Plage de durée
- `minBudget` & `maxBudget` - Plage de budget

**Paramètres de tri :**
- `sortBy` - Champ de tri (year, imdbRating, runtime, boxOffice, title)
- `sortOrder` - Ordre de tri (`asc` ou `desc`)

**Paramètres de sortie :**
- `fields` - Liste de champs à inclure/exclure (séparés par des virgules). Un champ à exclure doit commencer par un tiret (`-`), par exemple `fields=-budget,-boxOffice`.

## Exemples de requêtes

Voici quelques exemples de requêtes que vous pouvez implémenter :

```bash
# Films avec note minimale de 9 du Japon datant de l'année 2001
GET /movies/search?minRating=9.0&country=Japan&year=2001

# Films du directeur Nolan avec un budget minimum de 162.5 millions, triés par box office décroissant et seulement titre, budget et box office retournés
GET /movies/search?director=Nolan&minBudget=162500000&sortBy=boxOffice&sortOrder=desc&fields=title,budget,boxOffice
```

Le fichier [TESTS.md](./server/TESTS.md) contient plus d'exemples de requêtes pour tester votre implémentation avec les réponses attendues. Vous pouvez les exécuter dans un terminal ou un outil comme Postman ou ThunderClient.

Pour vous aider, un middleware affiche le contenu de l'objet `query` dans la console du serveur pour chaque requête reçue avant de lancer la recherche.

## Configuration de la base de données

Avant de commencer l'exercice, assurez-vous d'avoir configuré une instance de MongoDB. Le fichier [env.js](./server/src/env.js) vous permettra de configurer les informations nécessaires de votre instance MongoDB.

## Fonctionnalités à implémenter

### Construction de filtres dynamiques

Vous devez implémenter la logique pour construire un objet de filtre MongoDB basé sur les paramètres de requête. Voici quelques astuces :

- **Filtres de plage** : Utiliser `$gte` et `$lte` pour les plages numériques
- **Filtres de tableau** : Utiliser `$in` pour les recherches dans des tableaux
- **Recherche textuelle** : Utiliser `$regex` pour la recherche partielle

### Projections dynamiques et tri

Implémenter la gestion des champs à inclure ou exclure :
- Toujours exclure `_id` dans les réponses
- Champs à inclure : `fields=title,year,rating`
- Champs à exclure : `fields=-budget,-boxOffice`
- Rappel : on ne peut pas combiner inclusion et exclusion dans les projections MongoDB.
- Tri ascendant ou descendant sur différents champs

## Conseils d'implémentation

1. **Validez les paramètres** avant de construire les requêtes
2. **Utilisez des objets JavaScript** pour construire les filtres dynamiquement
3. **Testez avec différentes combinaisons** de paramètres
4. **Gérez les cas d'erreur** (paramètres invalides, etc.)

## Tests recommandés

1. **Filtres simples** : Un seul paramètre à la fois
2. **Filtres de plage** : Combinaisons de min/max. Les attributs `imdbRating`, `runtime` et `budget` sont les seuls qui supportent les plages.
3. **Filtres multiples** : Plusieurs critères simultanés
4. **Tri et projection** : Différentes combinaisons d'affichage
5. **Cas limites** : Requêtes sans résultats, paramètres invalides

# Solution

Une solution possible est disponible dans le fichier [movieManager.solution.js](./server/src/movieManager.solution.js). Vous pouvez tester cette solution en modifiant l'import dans [movieRouter.js](./server/src/movieRouter.js).

La solution proposée utilise la syntaxe `async`/`await`. Vous pouvez vous en inspirer pour votre solution.
