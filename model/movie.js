const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      default: "ghfghvkvbhjm"
    },
    year: {
      type: Number,
      default: 1910
    },
    cast: {
      type: Array,
      default: false
    },
    genres: {
      type: Array,
      default: false
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
