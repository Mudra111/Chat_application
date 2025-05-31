import mongoos from "mongoose";

import dotenv from "dotenv";
dotenv.config();
const DB_URL = process.env.DB_URL;

export const connect = () => {
  mongoos
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected Successfully...");
    })
    .catch((err) => {
      console.log("Error in database connection..");
      console.log(err);
      process.exit(1);
    });
};
