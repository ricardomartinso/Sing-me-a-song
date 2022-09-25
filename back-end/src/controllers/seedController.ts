import { Request, Response } from "express";
import * as seedService from "../services/seedService.js";

export async function populateDatabase(req: Request, res: Response) {
  await seedService.populateDatabase();
  res.sendStatus(200);
}
