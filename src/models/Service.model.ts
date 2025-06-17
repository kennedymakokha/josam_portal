import mongoose, { Schema } from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, },
  apiEndpoint: { type: String, },
  image: { type: String, },
  inputs: { type: Array, },
  active: { type: Boolean, default: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user_tb'
  },
  ownedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user_tb'
  },

  deletedAt: { type: Date, default: null }
}, { timestamps: true });


export const Service = mongoose.model("tb_services", ServiceSchema);

