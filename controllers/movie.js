const fs = require('fs');
const path = require('path');
const io = require('../socket');
const Movie = require('../model/movie');
const Comment = require('../model/comment');

exports.getAllMovies = async (req, res, next) => {
  try {
    const ITEMS_PER_PAGE = req.query.length;
    const page = +req.query.page || 1;
    const dir = req.query.dir;
    const search = req.query.sea;
    const totalItems = await Movie.find().countDocuments()

    if (search) {
      const moviess = await Movie.find({ 'title': search })
        .skip(parseInt((page - 1) * ITEMS_PER_PAGE))
        .limit(parseInt(ITEMS_PER_PAGE))
        .sort({ year: dir })
        .lean()

      res.status(200).json({
        message: 'Fetched movies successfully.',
        movies: moviess,
        total: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        next_page_url: "?page=2",
        prev_page_url: "?page=",
      });
    } else {
      const movies = await Movie.find()
        .skip(parseInt((page - 1) * ITEMS_PER_PAGE))
        .limit(parseInt(ITEMS_PER_PAGE))
        .sort({ year: dir })
        .lean()

      res.status(200).json({
        message: 'Fetched movies successfully.',
        movies: movies,
        total: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        next_page_url: "?page=2",
        prev_page_url: "?page=",
      });
    }


  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.getMovie = (req, res, next) => {
  const movieId = req.params.movieId;
  Movie.findById(movieId)
    .then(movie => {
      console.log(movie);
      if (!movie) {
        const error = new Error('Could not find movie.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Movie fetched.', movie: movie });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.createComment = (req, res, next) => {

  const movieId = req.body.movieId;
  const content = req.body.content;
  let creator;
  const comment = new Comment({
    content: content,
    creator: movieId
  });
  comment
    .save()
    .then(result => {
      return Movie.findById(movieId);
    })
    .then(movie => {
      creator = movie;
      movie.comments.push(comment);
      return movie.save();
    })

    .then(result => {

      console.log(result);
      res.status(201).json({
        message: 'Comment created successfully!',
        content: content,
        creator: { _id: creator._id, name: creator.title }
      });
      // io.getIO().emit('comments', {
      //   content: content
      // });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.getComments = (req, res, next) => {
  const movieId = req.params.movieId;
  console.log(movieId);
  Comment.find({ 'creator': movieId })
    .sort({ createdAt: -1 })

    .then(comments => {
      res.status(200).json({
        message: 'Fetched comments successfully.',
        comments: comments,

      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};




exports.getMoviesByPagination = async (req, res, next) => {

  try {
    const totalItems = await Movie.find().countDocuments();
    const movies = await Movie.find()

      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit));


    res.status(200).json({
      message: 'Fetched movies successfully.',
      movies: movies,
      totalItems: totalItems,
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getMoviesByYearInOrder = async (req, res, next) => {
  const sort = {}

  if (req.query.sortBy && req.query.OrderBy) {
    sort[req.query.sortBy] = req.query.OrderBy === 'desc' ? -1 : 1
  }
  try {
    const movies = await Movie.find({})
      .sort({ 'year': req.query.orderBy })

    res.status(200).json({
      message: 'Fetched movies successfully.',
      movies: movies,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMoviesByYear = async (req, res, next) => {
  try {
    const movies = await Movie.find({ 'year': req.query.year })
    res.status(200).json({
      message: 'Fetched movies successfully.',
      movies: movies,
    });

  }

  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};




exports.getMoviesByGenre = async (req, res, next) => {
  try {
    const movies = await Movie.find({ 'genres': req.query.genres })
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Fetched movies successfully.',
      movies: movies,

    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getMoviesByCast = async (req, res, next) => {
  try {

    const movies = await Movie.find({ 'cast': req.query.cast })

    res.status(200).json({
      message: 'Fetched movies successfully.',
      movies: movies,


    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


