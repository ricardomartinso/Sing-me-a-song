import supertest from "supertest";
import { prisma } from "../src/database";
import app from "../src/app";
import { faker } from "@faker-js/faker";

const recommendation = {
  name: faker.lorem.words(),
  youtubeLink: `https://www.youtube.com/watch?v=${faker.lorem.word(11)}`,
};

describe("POST na rota /recommendations", () => {
  it("Cria uma nova recomendação e retorna 201", async () => {
    const result = supertest(app).post("/recommendations");
  });

  it("Adiciona um upvote à uma recomendação e retorna 200", async () => {});

  it("Adiciona um downvote à uma recomendação e retorna 200", async () => {});
});

describe("GET na rota /recommendations", () => {
  it("Retorna as 10 últimas recomendações", async () => {});

  it("Retorna uma recomendação por ID", async () => {});

  it("Retorna uma recomendação aleatoriamente", async () => {});

  it("Retorna as recomendações com maior pontuação", async () => {});
});
