import mongoos from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoos.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone_number: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Invalid phone number formate"],
    },
    token: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  console.log("generate token called");

  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  console.log(token);

  return token;
};

userSchema.methods.comparePassword = async function (password) {
  console.log("compare password called");

  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const User = mongoos.model("users", userSchema);
