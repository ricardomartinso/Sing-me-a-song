beforeEach(() => {
  cy.resetDatabase();
});

describe("Testa se upvote e downvote estÃO funcionando", () => {
  it("Testa upvote", async () => {
    cy.request("POST", "http://localhost:5000/recommendations", {
      name: `MARY ON A CROSS ${Math.random() * 1000}`,
      youtubeLink: "https://www.youtube.com/watch?v=k5mX3NkA7jM",
    }).then((response) => {});

    cy.intercept("POST", "/recommendations/1/upvote").as("upvote");
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.get("#data-cy-upvote").click();
    cy.wait("@upvote");
  });

  it("Testa downvote", async () => {
    cy.request("POST", "http://localhost:5000/recommendations", {
      name: `MARY ON A CROSS ${Math.random() * 1000}`,
      youtubeLink: "https://www.youtube.com/watch?v=k5mX3NkA7jM",
    }).then((response) => {});

    cy.intercept("POST", "/recommendations/1/downvote").as("downvote");
    cy.intercept("GET", "/recommendations").as("getRecommendations");

    cy.visit("http://localhost:3000");

    cy.wait("@getRecommendations");

    cy.get("#data-cy-downvote").click();
    cy.wait("@downvote");
  });
});
