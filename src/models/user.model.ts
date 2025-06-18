import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String, },
  email: { type: String, },
  secret_key: { type: String, },
  activationCode: { type: String, },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "user",],
    default: "admin"
  },
  activated: { type: Boolean, default: true },
  password: { type: String, required: true,select: false  },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(this.password, salt);
  console.log("Hashing password:", this.password, "→", hashed); // ✅ confirm
  this.password = hashed;
  next();
});
export const User = mongoose.model("user_tb", UserSchema);
