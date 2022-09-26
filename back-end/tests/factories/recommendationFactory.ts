import { faker } from "@faker-js/faker";
import { createManyRecommendations } from "../../types/recommendationTypes";

function createRecommendation() {
  return {
    name: faker.lorem.words(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
  };
}

function getRecommendation() {
  return {
    id: 1,
    name: faker.lorem.words(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
    score: 0,
  };
}
function toDeleteRecommendation() {
  return {
    id: 1,
    name: faker.lorem.words(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
    score: -5,
  };
}

function getXRecommendations(
  x: number,
  scoreFilterMin?: number,
  scoreFilterMax?: number
) {
  const recommendationsNumber = x;
  const recommendationArray = [];

  for (let i = 0; i < recommendationsNumber; i++) {
    recommendationArray.push({
      id: faker.datatype.number({ min: 1, max: 1000 }),
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
      score:
        scoreFilterMin && scoreFilterMax
          ? faker.datatype.number({ min: scoreFilterMin, max: scoreFilterMax })
          : faker.datatype.number({ min: -4, max: 1000 }),
    });
  }

  return recommendationArray;
}

function getXRecommendationsWithoutId(x: number) {
  const recommendationsNumber = x;
  const recommendationArray = [];

  for (let i = 0; i < recommendationsNumber; i++) {
    recommendationArray.push({
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
      score: faker.datatype.number({ min: -4, max: 1000 }),
    });
  }

  return recommendationArray as createManyRecommendations;
}

function getGtRecommendations() {
  const recommendationArray = [];

  for (let i = 0; i < 10; i++) {
    recommendationArray.push({
      id: faker.datatype.number({ min: 1, max: 1000 }),
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(12)}`,
      score: faker.datatype.number({ min: 20, max: 500 }),
    });
  }

  return recommendationArray;
}

function getLteRecommendations() {
  const recommendationArray = [];

  for (let i = 0; i < 10; i++) {
    recommendationArray.push({
      id: faker.datatype.number({ min: 1, max: 1000 }),
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(12)}`,
      score: faker.datatype.number({ min: -5, max: 10 }),
    });
  }

  return recommendationArray;
}

export default {
  createRecommendation,
  getRecommendation,
  toDeleteRecommendation,
  getXRecommendations,
  getGtRecommendations,
  getXRecommendationsWithoutId,
};
