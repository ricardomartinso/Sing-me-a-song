import { Router } from "express";
import { populateDatabase } from "../controllers/seedController.js";

const seedRouter = Router();

seedRouter.post("/seed/populate", populateDatabase);

export default seedRouter;
