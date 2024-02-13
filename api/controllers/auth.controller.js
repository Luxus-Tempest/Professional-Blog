import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/Error.js";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    //return res.status(400).json({ message: "All fields are required " });
    next(errorHandler(400, "All fields are required "));
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      //return res.status(400).json({ message: "This user does not exist" });
      return next(errorHandler(400, "User not found !"));
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      //return res.status(400).json({ message: "Invalid password" });
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password: extraire_password, ...le_reste } = user._doc;
    res
      .status(200)
      .cookie("access_token_to_proBlog", token, {
        httpOnly: true,
      })
      .json(le_reste);

    //res.status(200).json({ token });
  } catch (error) {
    //res.status(500).json({ message: "Internal Server Error" });
    next(error);
    //next(errorHandler(500, "Internal Server Error"));
  }
};
