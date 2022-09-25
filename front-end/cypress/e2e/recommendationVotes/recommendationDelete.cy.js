beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se downvote está funcionando com deleção", () => {
  it("Testa downvote", async () => {
    cy.visit("http://localhost:3000");

    cy.get('input[placeholder="Name"]').type(`MARY ON A CROSS 455`);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      "https://www.youtube.com/watch?v=213asd21s"
    );

    cy.intercept("POST", "/recommendations").as("recommendation");
    cy.intercept("GET", "/recommendations").as("getRecommendation");

    cy.get("#data-cy-create").click();

    cy.wait("@recommendation");

    cy.get("#data-cy-downvote").click();
    cy.get("#data-cy-downvote").click();
    cy.get("#data-cy-downvote").click();
    cy.get("#data-cy-downvote").click();
    cy.get("#data-cy-downvote").click();
    cy.get("#data-cy-downvote").click();

    cy.contains("No recommendations yet! Create your own :)");
  });
});
