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
 * Solution complète pour la recherche de films
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

    // 1. Construction du filtre
    const filter = {};

    // Filtres d'année
    if (queryParams.year) {
        filter.year = parseInt(queryParams.year);
    } else if (queryParams.yearFrom || queryParams.yearTo) {
        filter.year = {};
        if (queryParams.yearFrom) filter.year.$gte = parseInt(queryParams.yearFrom);
        if (queryParams.yearTo) filter.year.$lte = parseInt(queryParams.yearTo);
    }

    // Filtre de genre (logique OR)
    if (queryParams.genre) {
        const genres = queryParams.genre.split(',').map(g => g.trim());
        filter.genre = { $in: genres };
    }

    // Recherche textuelle pour le réalisateur
    if (queryParams.director) {
        filter.director = { $regex: queryParams.director, $options: 'i' };
    }

    // Filtres exacts
    if (queryParams.country) {
        filter.country = queryParams.country;
    }

    if (queryParams.language) {
        filter.language = queryParams.language;
    }

    // Filtres de plage pour les notes
    if (queryParams.minRating || queryParams.maxRating) {
        filter.imdbRating = {};
        if (queryParams.minRating) filter.imdbRating.$gte = parseFloat(queryParams.minRating);
        if (queryParams.maxRating) filter.imdbRating.$lte = parseFloat(queryParams.maxRating);
    }

    // Filtres de plage pour la durée
    if (queryParams.minRuntime || queryParams.maxRuntime) {
        filter.runtime = {};
        if (queryParams.minRuntime) filter.runtime.$gte = parseInt(queryParams.minRuntime);
        if (queryParams.maxRuntime) filter.runtime.$lte = parseInt(queryParams.maxRuntime);
    }

    // Filtres de plage pour le budget
    if (queryParams.minBudget || queryParams.maxBudget) {
        filter.budget = {};
        if (queryParams.minBudget) filter.budget.$gte = parseInt(queryParams.minBudget);
        if (queryParams.maxBudget) filter.budget.$lte = parseInt(queryParams.maxBudget);
    }

    // 2. Construction de la projection
    const projection = { _id: 0 }; // Exclure _id par défaut

    if (queryParams.fields) {
        const fieldList = queryParams.fields.split(',').map(f => f.trim());
        fieldList.forEach(field => {
            if (field.startsWith('-')) {
                projection[field.substring(1)] = 0;
            } else {
                projection[field] = 1;
            }
        });
    }

    // 3. Construction du tri
    const sort = {};
    if (queryParams.sortBy) {
        sort[queryParams.sortBy] = queryParams.sortOrder === 'desc' ? -1 : 1;
    }

    // 4. Exécution de la requête
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
