beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se está recebendo as recomendações", () => {
  it("Testa se está recebendo as recomendações corretas", async () => {
    cy.request("POST", "http://localhost:5000/seed/populate");
    cy.intercept("POST", "http://localhost:5000/seed/populate").as("populate");
    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");
  });
});
