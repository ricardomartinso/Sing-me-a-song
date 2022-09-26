import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se upvote está funcionando", () => {
  it("Testa upvote", async () => {
    const recommendation = {
      name: faker.name.jobTitle(),
      youtubeLink: "https://www.youtube.com/watch?v=213asd21s",
    };

    cy.request("POST", "http://localhost:5000/recommendations", {
      name: `${recommendation.name}`,
      youtubeLink: `${recommendation.youtubeLink}`,
    });

    cy.intercept("POST", "/recommendations/1/upvote").as("upvote");
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.get("#data-cy-upvote").click();
    cy.wait("@upvote");

    cy.contains("1").should("be.visible");
  });
});
