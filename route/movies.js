const express = require('express');

const movieController = require('../controllers/movie');

const router = express.Router();

router.get(
  '/allData', movieController.getAllMovies
);

router.get('/fetch/:movieId',  movieController.getMovie);

router.get('/comment/:movieId',  movieController.getComments);

router.get(
  '/paginate', movieController.getMoviesByPagination
);

router.get(
  '/release', movieController.getMoviesByYear
);
router.get(
  '/order', movieController.getMoviesByYearInOrder
);

router.get(
  '/cast', movieController.getMoviesByCast
);
router.get(
  '/genre', movieController.getMoviesByGenre
);
router.post(
  '/create', movieController.createComment
);

module.exports = router;
