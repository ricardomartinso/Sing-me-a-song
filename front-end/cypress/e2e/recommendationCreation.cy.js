beforeEach(() => {
  cy.resetDatabase();
});

describe("Recommendation creation", () => {
  it("Testa criação de uma recomendação", () => {
    cy.visit("http://localhost:3000");

    cy.get('input[placeholder="Name"]').type(
      `MARY ON A CROSS ${Math.random() * 1000}`
    );
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      "https://www.youtube.com/watch?v=213asd21s"
    );

    cy.get("#data-cy-create").click();

    cy.request("POST", "http://localhost:5000/recommendations", {
      name: `MARY ON A CROSS ${Math.random() * 1000}`,
      youtubeLink: "https://www.youtube.com/watch?v=k5mX3NkA7jM",
    }).then((response) => {
      console.log(JSON.parse(response.requestBody));
    });

    cy.request("GET", "http://localhost:5000/recommendations").then(
      (response) => {
        console.log(response.body[0]);
      }
    );
  });
});
