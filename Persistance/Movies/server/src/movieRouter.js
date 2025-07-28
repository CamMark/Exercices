const express = require('express');
const { searchMovies } = require('./movieManager');
// const { searchMovies } = require('./movieManager.solution');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const results = await searchMovies(req.query);
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(400).json({ 
      error: 'Erreur lors de la recherche',
      message: error.message 
    });
  }
});

module.exports = router;
