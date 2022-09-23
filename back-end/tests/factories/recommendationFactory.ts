import { faker } from "@faker-js/faker";
export default function createRecommendation() {
  return {
    name: faker.lorem.words(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
  };
}
