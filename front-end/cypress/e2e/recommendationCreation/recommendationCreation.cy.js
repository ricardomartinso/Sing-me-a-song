import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.resetDatabase();
});

describe("Recommendation creation", () => {
  it("Testa criação de uma recomendação", () => {
    const recommendation = {
      name: faker.name.jobTitle(),
      youtubeLink: "https://www.youtube.com/watch?v=213asd21s",
    };

    cy.visit("http://localhost:3000");

    cy.get('input[placeholder="Name"]').type(`${recommendation.name}`);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      `${recommendation.youtubeLink}`
    );

    cy.intercept("POST", "/recommendations").as("recommendation");
    cy.intercept("GET", "/recommendations").as("getRecommendation");

    cy.get("#data-cy-create").click();

    cy.wait("@recommendation");
    cy.wait("@getRecommendation");

    cy.contains(recommendation.name).should("be.visible");
  });
});
