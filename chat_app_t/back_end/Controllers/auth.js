import { User } from "../models/User.js";
import validator from "validator";
import { validationResult } from "express-validator";
import { blacklistTokenModel } from "../models/blacklistToken.model.js";
import { jwtDecode } from "jwt-decode";

//user login
export const login = async (req, res) => {
  try {
    const error = validationResult(req);

    // //check for any error in request
    if (!error.isEmpty) {
      return res.status(400).json({ error: error.array(), success: false });
    }

    //get data
    const { email, password } = req.body;

    console.log(email, password);

    //check database for email existance
    const user = await User.findOne({ email }).select("+password");

    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password..",
      });
    }

    //compare password
    const isMatch = await user.comparePassword(password);

    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password..",
      });
    }

    //if find match - create token and send
    const token = user.generateToken();

    console.log(token);

    //if user has token then blacklist it
    if (user.token) {
      await blacklistTokenModel.create({ token: user.token });
    }

    //store new token in database
    user.set("token", token);
    await user.save();
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;

    // Exclude the password field from returned user data
    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      _id: user._id,
      data: userData,
      success: true,
      message: "user logged in successfully..",
      token: token,
      expiryTime: expiryTime,
    });
  } catch (err) {
    console.log("Error in user login.." + err);
    return res.status(500).json({
      success: false,
      message: "Error in user login..",
    });
  }
};

//user register
export const signup = async (req, res) => {
  try {
    const error = validationResult(req);

    // //check for any error in request
    if (!error.isEmpty) {
      return res.status(400).json({ error: error.array(), success: false });
    }

    //get data
    const { name, email, password, phone_number } = req.body;

    //check existance
    const existance = await User.findOne({ email });
    if (existance) {
      return res.status(400).json({
        success: false,
        message: "User already exist...",
      });
    }

    //check for empty field
    if (!name || !email || !password || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "All fields are required..",
      });
    }

    //validation of email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email should be valid..",
      });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be a strong..",
      });
    }

    //encrypt password
    let hashPass;
    try {
      hashPass = await User.hashPassword(password);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error in hashing password...",
      });
    }

    //create user
    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashPass,
        phone_number,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Error in creating user..",
      });
    }

    // const userData = user.toObject();
    // delete userData.password;

    // const token = createToken(user._id);
    // console.log(token);

    return res.status(200).json({
      // _id: user._id,
      // user: userData,
      success: true,
      message: "user created successfully..",
      // token: token,
    });
  } catch (err) {
    console.log("Error in user signin");
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};

export const logout = async (req, res, next) => {
  let token;
  if (req.cookies) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);

  try {
    const user = await User.findOne({ token });

    console.log(user);

    user.token = "";
    await user.save();

    const bToken = await blacklistTokenModel.create({ token });
    console.log(bToken);

    console.log("logged out");

    return res
      .status(200)
      .json({ message: "logout successfully", success: true });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "failed to logged out..", success: false });
  }
};
