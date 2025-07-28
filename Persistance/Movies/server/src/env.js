// Configuration de l'environnement MongoDB
// Complétez ces informations selon votre instance MongoDB

const DB_CONNECTION_STRING = 'mongodb://localhost:27017'; // ou votre string de connection MongoDB Atlas
const DB_NAME = 'movies_db';
const DB_COLLECTION_MOVIES = 'movies';

module.exports = {
  DB_CONNECTION_STRING,
  DB_NAME,
  DB_COLLECTION_MOVIES
};
