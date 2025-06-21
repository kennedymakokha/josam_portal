// models/Service.ts
import mongoose, { Schema } from 'mongoose';

const CommentSchema = new mongoose.Schema({

  text: { type: String },
  comments: { type: Array },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user_tb'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user_tb'
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'tb_posts'
  },

  deletedAt: { type: Date, default: null }
}, { timestamps: true });

export const Comments = mongoose.model('tb_comments', CommentSchema);
