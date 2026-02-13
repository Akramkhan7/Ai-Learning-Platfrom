import mongoose, { Schema } from "mongoose";
import bcrypt, { getSalt } from "bcryptjs";

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
    },

    email: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a Password"],
      unique: true,
      trim: true,
      minLength: [6, "Username must be at least 6 characters long"],
    },

    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

//Hash Pass before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.getSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Compare password Method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", UserSchema);
export default User;
