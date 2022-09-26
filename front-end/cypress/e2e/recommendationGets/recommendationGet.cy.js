beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se está recebendo as recomendações", () => {
  it("Testa se está recebendo as recomendações corretas", async () => {
    cy.intercept("POST", "http://localhost:5000/seed/populate").as("populate");

    cy.request("POST", "http://localhost:5000/seed/populate/11");

    cy.wait(1000);

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.visit("http://localhost:3000");
    cy.wait("@getRecommendations");

    cy.wait(1000);

    cy.get("#data-cy-recommendation-name").should("be.visible");
    cy.get("article").should("have.length.lessThan", 11);
  });
});
