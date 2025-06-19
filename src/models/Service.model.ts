// models/Service.ts
import mongoose, { Schema } from 'mongoose';
import { Counter } from './counter';


const ServiceSchema = new mongoose.Schema({
  name: { type: String },
  apiEndpoint: { type: String },
  image: { type: String },
  inputs: { type: Array },
  formId: { type: Number, unique: true }, // Important: must be unique
  active: { type: Boolean, default: true },
  category: {
    type: String,
    enum: ["service", "loan"],
    default: "service"
  },
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

// Auto-increment formId before saving
ServiceSchema.pre('save', async function (next) {
  const doc = this as any;

  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'service_formId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.formId = counter.seq;
  }

  next();
});

export const Service = mongoose.model('tb_services', ServiceSchema);
