import express from "express";
import { getNews, predictCatIndex } from "../controllers/newsController.js";

const newsRouter = express.Router();

// Define your routes here
newsRouter.get("/", getNews);
newsRouter.get("/predict", predictCatIndex);

export default newsRouter;
