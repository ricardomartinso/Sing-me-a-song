import { Request, Response } from "express";
import * as seedService from "../services/seedService.js";

export async function populateDatabase(req: Request, res: Response) {
  const { recommendationsNumber } = req.params;

  if (typeof Number(recommendationsNumber) !== "number") {
    res.sendStatus(422);
  }

  const randomRecommendations = await seedService.populateDatabase(
    Number(recommendationsNumber)
  );

  res.status(200).send(randomRecommendations);
}
