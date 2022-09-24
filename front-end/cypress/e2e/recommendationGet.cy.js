describe("Testa se está recebendo as recomendações", () => {
  it("Testa se está recebendo as recomendações corretas", async () => {
    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");
  });
});
