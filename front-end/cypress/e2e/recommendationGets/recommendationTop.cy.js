beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa o 'top' de recomendações", () => {
  it("Testa se está recebendo as recomendações corretas", async () => {
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.request("POST", "http://localhost:5000/seed/populate/20").then(
      (response) => {
        cy.get("#data-cy-top").click();
      }
    );

    cy.url().should("equal", "http://localhost:3000/top");
    cy.get("article").should("have.length.lessThan", 11);
  });
});
