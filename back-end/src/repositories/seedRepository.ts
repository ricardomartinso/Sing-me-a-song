import { createManyRecommendations } from "../../types/recommendationTypes";
import { prisma } from "../database.js";

export async function createMany(data: createManyRecommendations) {
  await prisma.recommendation.createMany({
    data,
  });
}
