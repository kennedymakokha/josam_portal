// models/Service.ts
import mongoose, { Schema } from 'mongoose';

const APPSchema = new mongoose.Schema({

  primaryColor: { type: String },
  app_name: { type: String },
  tagline: { type: String },
  logo: { type: String },
  code: { type: String, },
  scratch_no: { type: String, },
  forms: [{
    type: Schema.Types.ObjectId,
    ref: 'tb_services'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'user_tb'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user_tb'
  },

  deletedAt: { type: Date, default: null }
}, { timestamps: true });

export const App = mongoose.model('tb_apps', APPSchema);
