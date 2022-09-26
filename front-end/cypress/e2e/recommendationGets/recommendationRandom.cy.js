beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa o 'random' de recomendações", () => {
  it("Testa se está recebendo as recomendações corretas", async () => {
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.request("POST", "http://localhost:5000/seed/populate/5").then(
      (response) => {
        cy.get("#data-cy-random").click();
      }
    );

    cy.url().should("equal", "http://localhost:3000/random");
    cy.get("article").should("have.length", 1);
  });
});
