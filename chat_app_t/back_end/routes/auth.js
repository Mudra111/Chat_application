import express from "express";
import { body } from "express-validator";

const router = express.Router();

import { signup, login, logout } from "../Controllers/auth.js";

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isEmpty().withMessage("Password is required"),
  ],
  login
);

router.post(
  "/signup",
  [
    body("username")
      .isEmpty()
      .isLength({ min: "3" })
      .withMessage("username must be at least 3 character long"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isStrongPassword().withMessage("Password must be strong"),
    body("phone_number").isEmpty().withMessage("Phone Number is required"),
  ],
  signup
);

router.get("/logout", logout);

export default router;
