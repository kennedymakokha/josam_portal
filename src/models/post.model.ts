// models/Service.ts
import mongoose, { Schema } from 'mongoose';

const PostSchema = new mongoose.Schema({

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

  deletedAt: { type: Date, default: null }
}, { timestamps: true });

export const Post = mongoose.model('tb_posts', PostSchema);
