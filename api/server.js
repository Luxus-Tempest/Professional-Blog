import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routers/user.route.js";
import authRoutes from "./routers/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(console.log("Connected to mongoDB"))
  .catch((err) => {
    console.log(err);
  });

const app = express();

//Permettre l'envoie des données json au backend
//Exemple pour le Auth
app.use(express.json());

app.listen(3000, () => {
  console.log("server is running on port 3000!!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
