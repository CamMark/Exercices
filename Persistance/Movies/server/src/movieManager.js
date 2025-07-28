const { MongoClient } = require('mongodb');
const { DB_CONNECTION_STRING, DB_NAME, DB_COLLECTION_MOVIES } = require('./env');

let db;
let moviesCollection;

async function connectToDatabase() {
    if (!db) {
        const client = new MongoClient(DB_CONNECTION_STRING);
        await client.connect();
        db = client.db(DB_NAME);
        moviesCollection = db.collection(DB_COLLECTION_MOVIES);
        console.log('Connexion à MongoDB établie');
    }
    return moviesCollection;
}

/**
 * Fonction principale à implémenter pour la recherche de films
 * @param {Object} queryParams - Paramètres de requête HTTP pour la recherche de films
 * @param {string} [queryParams.year] - Année exacte du film (ex: "1999")
 * @param {string} [queryParams.yearFrom] - Année de début pour une plage (ex: "1990")
 * @param {string} [queryParams.yearTo] - Année de fin pour une plage (ex: "2000")
 * @param {string} [queryParams.genre] - Genres séparés par virgules, logique OR (ex: "Action,Sci-Fi")
 * @param {string} [queryParams.director] - Nom du réalisateur (recherche partielle, insensible à la casse)
 * @param {string} [queryParams.country] - Pays de production exact
 * @param {string} [queryParams.language] - Langue exacte du film
 * @param {string} [queryParams.minRating] - Note IMDB minimum (ex: "8.0")
 * @param {string} [queryParams.maxRating] - Note IMDB maximum (ex: "9.5")
 * @param {string} [queryParams.minRuntime] - Durée minimum en minutes (ex: "120")
 * @param {string} [queryParams.maxRuntime] - Durée maximum en minutes (ex: "180")
 * @param {string} [queryParams.minBudget] - Budget minimum (ex: "50000000")
 * @param {string} [queryParams.maxBudget] - Budget maximum (ex: "200000000")
 * @param {string} [queryParams.sortBy] - Champ de tri ("year", "imdbRating", "runtime", "boxOffice", "title")
 * @param {string} [queryParams.sortOrder] - Ordre de tri ("asc" ou "desc")
 * @param {string} [queryParams.fields] - Champs à inclure/exclure (ex: "title,year,imdbRating" ou "-budget,-boxOffice")
 * @returns {Promise<Array>} - Liste des films correspondant aux critères
 */
async function searchMovies(queryParams) {
    const collection = await connectToDatabase();

    // TODO: Implémenter la logique de recherche
    // 
    // 1. Extraire et valider les paramètres de requête
    // 2. Construire l'objet filter MongoDB
    // 3. Construire l'objet projection
    // 4. Construire l'objet sort
    // 5. Exécuter la requête et retourner les résultats

    // Exemple de base (à remplacer par votre implémentation)
    const filter = {};
    const projection = {}; // Exclure _id par défaut
    const sort = {};

    const results = await collection
        .find(filter)
        .project(projection)
        .sort(sort)
        .toArray();

    return results;
}

module.exports = {
    searchMovies
};
