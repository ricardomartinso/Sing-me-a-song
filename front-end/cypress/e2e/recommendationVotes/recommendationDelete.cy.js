import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se downvote está funcionando com deleção", () => {
  it("Testa downvote", async () => {
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

    for (let i = 0; i < 6; i++) {
      cy.get("#data-cy-downvote").click();
    }

    cy.wait(2000);

    cy.contains("No recommendations yet! Create your own :)").should(
      "be.visible"
    );
  });
});
