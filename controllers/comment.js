const Comment = require('../model/comment');
const Movie = require('../model/movie');

exports.getComments = (req, res, next) => {
    const movieId = req.params.movieId;

    Comment.find({ 'creator': movieId }).sort({ createdAt: -1 })
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




// exports.createComment = (req, res, next) => {
//     const movieId = req.body.movieId;
//     const content = req.body.content;
//     let creator;
//     const comment = new Comment({
//         content: content,
//         creator: movieId
//     });
//     comment
//         .save()
//         .then(result => {
//             return Movie.findById(movieId);
//         })
//         .then(movie => {
//             creator = movie;
//             movie.comments.push(comment);
//             return movie.save();
//         })
//         .then(result => {
//             console.log(result);
//             res.status(201).json({
//                 message: 'Comment created successfully!',
//                 content: content,
//                 creator: { _id: creator._id, name: creator.title }
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };
