const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
