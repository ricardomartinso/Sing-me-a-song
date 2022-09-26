import { createMany } from "../repositories/seedRepository.js";
import * as recommendationFactory from "../../tests/factories/recommendationFactory.js";

export async function populateDatabase(n: number) {
  const randomRecommendations =
    recommendationFactory.default.getXRecommendationsWithoutId(n);

  await createMany(randomRecommendations);

  return randomRecommendations;
}
