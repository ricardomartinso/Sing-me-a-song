import { faker } from "@faker-js/faker";

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

function getXRecommendations(x: number) {
  const recommendationsNumber = x;
  const recommendationArray = [];

  for (let i = 0; i < recommendationsNumber; i++) {
    recommendationArray.push({
      id: faker.datatype.number({ min: 1, max: 1000 }),
      name: faker.lorem.words(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
      score: faker.datatype.number({ min: -4, max: 1000 }),
    });
  }

  return recommendationArray;
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
};
