beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se está recebendo as recomendações", () => {
  it("Testa se a volta para a home", async () => {
    cy.request("POST", "http://localhost:5000/seed/populate");
    cy.intercept("POST", "http://localhost:5000/seed/populate/5").as(
      "populate"
    );
    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.visit("http://localhost:3000/");

    cy.wait("@getRecommendations");

    cy.url().should("equal", `http://localhost:5000/`);
  });
});
