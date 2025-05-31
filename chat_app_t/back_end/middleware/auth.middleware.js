import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { blacklistTokenModel } from "../models/blacklistToken.model.js";

export const authUser = async (req, res, next) => {
  let token;

  if (req.cookies) {
    token = req.cookies.token;
  }

  if (req.headers) {
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
  }

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

  console.log(isBlacklisted);

  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode._id);

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};
