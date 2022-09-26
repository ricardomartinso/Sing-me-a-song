import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se downvote está funcionando", () => {
  it("Testa downvote", async () => {
    const recommendation = {
      name: faker.name.jobTitle(),
      youtubeLink: "https://www.youtube.com/watch?v=213asd21s",
    };

    cy.request("POST", "http://localhost:5000/recommendations", {
      name: `${recommendation.name}`,
      youtubeLink: `${recommendation.youtubeLink}`,
    });

    cy.intercept("POST", "/recommendations/1/downvote").as("downvote");
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.get("#data-cy-downvote").click();

    cy.wait("@downvote");

    cy.contains("-1").should("be.visible");
  });
});
