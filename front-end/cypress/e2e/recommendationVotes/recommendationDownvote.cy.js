beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se downvote está funcionando", () => {
  it("Testa downvote", async () => {
    cy.request("POST", "http://localhost:5000/recommendations", {
      name: `MARY ON A CROSS ${Math.floor(Math.random() * 100)}`,
      youtubeLink: "https://www.youtube.com/watch?v=k5mX3NkA7jM",
    });

    cy.intercept("POST", "/recommendations/1/downvote").as("downvote");
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.get("#data-cy-downvote").click();

    cy.wait("@downvote");
  });
});
