import { createMany } from "../repositories/seedRepository.js";
import * as recommendationFactory from "../../tests/factories/recommendationFactory.js";

export async function populateDatabase() {
  await createMany(
    recommendationFactory.default.getXRecommendationsWithoutId(5)
  );
}
