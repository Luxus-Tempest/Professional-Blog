import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/Error.js";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !email ||
    !username ||
    !password ||
    email === "" ||
    password === "" ||
    username === ""
  ) {
    //return res.status(400).json({ message: "All fields are required " });
    next(errorHandler(400, "All fields are required "));
  }
  const hashpaswword = bcryptjs.hashSync(password, 10);
  const NewUser = User({
    username,
    email,
    password: hashpaswword,
  });

  try {
    await NewUser.save();
    res.json("Successfully signed up !");
  } catch (error) {
    //res.status(500).json({ message: "This user is already signed up" });
    next(error);
    //next(errorHandler(400, "This user is already signed up"));
  }
};
