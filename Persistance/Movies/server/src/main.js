const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { DB_CONNECTION_STRING, DB_NAME, DB_COLLECTION_MOVIES } = require('./env');
const movieRouter = require('./movieRouter');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

async function importMovieData() {
    try {
        const client = new MongoClient(DB_CONNECTION_STRING);
        await client.connect();

        const db = client.db(DB_NAME);
        const collection = db.collection(DB_COLLECTION_MOVIES);

        const moviesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/movies.json'), 'utf8'));
        await collection.deleteMany({});

        const result = await collection.insertMany(moviesData);
        console.log(`${result.insertedCount} films importés avec succès`);

        await client.close();
        console.log('Import terminé avec succès');

    } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        process.exit(1);
    }
}

async function run() {
    await importMovieData();

    app.use(cors());
    app.use(express.json());
    app.use((req, res, next) => {
        console.log(`Requête reçue: ${req.method} ${req.url}`);
        console.log('Paramètres de requête:', req.query);
        next();
    });
    app.use('/movies', movieRouter);

    app.listen(PORT, () => {
        console.log(`Route disponible: GET http://localhost:${PORT}/movies/search`);
    });
}

run();
