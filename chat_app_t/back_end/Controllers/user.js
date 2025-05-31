import mongoose from "mongoose";
import { User } from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    //fetch data
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users: users,
      message: "users data fetched successfully..",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in fetching users..",
    });
  }
};

export const findUser = async (req, res) => {
  try {
    //get user id
    const userId = req.params.userId;

    //fetch data
    const user = await User.findById(userId);
    return res.status(200).json({
      user: user,
      message: "user data fetched successfully..",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in finding user..",
    });
  }
};
