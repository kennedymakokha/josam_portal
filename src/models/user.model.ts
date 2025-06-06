import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String, },
  venderName: { type: String, },
  activationCode: { type: String, },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "sales",],
    default: "sales"
  },
  activated: { type: Boolean, default: true },
  password: { type: String, required: true },
}, { timestamps: true });
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model("user_tb", UserSchema);
