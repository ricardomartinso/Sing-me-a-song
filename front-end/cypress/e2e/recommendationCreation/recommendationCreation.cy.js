beforeEach(() => {
  cy.resetDatabase();
});

describe("Recommendation creation", () => {
  it("Testa criação de uma recomendação", () => {
    cy.visit("http://localhost:3000");

    cy.get('input[placeholder="Name"]').type(`MARY ON A CROSS 455`);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      "https://www.youtube.com/watch?v=213asd21s"
    );

    cy.intercept("POST", "/recommendations").as("recommendation");
    cy.intercept("GET", "/recommendations").as("getRecommendation");

    cy.get("#data-cy-create").click();

    cy.wait("@recommendation");
    cy.wait("@getRecommendation");

    cy.contains("MARY ON A CROSS 455");
  });
});
