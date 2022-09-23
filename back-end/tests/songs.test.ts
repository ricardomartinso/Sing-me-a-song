import supertest from "supertest";
import { prisma } from "../src/database";
import app from "../src/app";
import createRecommendation from "./factories/recommendationFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE "recommendations" RESTART IDENTITY CASCADE`;
});
afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST na rota /recommendations", () => {
  it("Cria uma nova recomendação e retorna 201", async () => {
    const result = await supertest(app)
      .post("/recommendations")
      .send(createRecommendation());

    expect(result.status).toEqual(201);
  });

  it("Cria uma recomendação com nome repetido e retorna erro 409", async () => {
    const recommendation = createRecommendation();

    await supertest(app).post("/recommendations").send(recommendation);
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendation);

    expect(result.status).toEqual(409);
  });

  it("Adiciona um upvote à uma recomendação e retorna 200", async () => {
    const recommendation = await supertest(app)
      .post("/recommendations")
      .send(createRecommendation());

    const result = await supertest(app).post("/recommendations/1/upvote");

    expect(result.status).toEqual(200);
  });

  it("Adiciona um upvote à uma recomendação inexistente e retorna 404", async () => {
    const result = await supertest(app).post("/recommendations/999/upvote");

    expect(result.status).toEqual(404);
  });

  it("Adiciona um downvote à uma recomendação e retorna 200", async () => {
    await supertest(app).post("/recommendations").send(createRecommendation());

    const result = await supertest(app).post("/recommendations/1/downvote");

    expect(result.status).toEqual(200);
  });

  it("Adiciona um upvote à uma recomendação inexistente e retorna 404", async () => {
    const result = await supertest(app).post("/recommendations/99/downvote");

    expect(result.status).toEqual(404);
  });

  it("Adiciona um downvote em uma recomendação com 5 downvotes e exclui", async () => {
    await supertest(app).post("/recommendations").send(createRecommendation());

    await downvote(1);
    await downvote(1);
    await downvote(1);
    await downvote(1);
    await downvote(1);
    await downvote(1);

    const result = await supertest(app).post("/recommendations/1/downvote");

    expect(result.status).toEqual(404);
  });
});

describe("GET na rota /recommendations", () => {
  it("Retorna as 10 últimas recomendações", async () => {
    await supertest(app).post("/recommendations").send(createRecommendation());
    await supertest(app).post("/recommendations").send(createRecommendation());

    const result = await supertest(app).get("/recommendations");

    expect(result.body).toBeInstanceOf(Array);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
    expect(result.body.length).toBeLessThanOrEqual(10);
  });

  it("Retorna uma recomendação por ID", async () => {
    await supertest(app).post("/recommendations").send(createRecommendation());

    const result = await supertest(app).get("/recommendations/1");

    expect(result.body).toBeInstanceOf(Object);
  });

  it("Retorna uma recomendação aleatoriamente", async () => {
    await supertest(app).post("/recommendations").send(createRecommendation());

    const result = await supertest(app).get("/recommendations/random");

    expect(result.body).toBeInstanceOf(Object);
    expect(result.status).toEqual(200);
  });

  it("Retorna um erro 404 ao buscar recomendações aleatórias", async () => {
    const result = await supertest(app).get("/recommendations/random");

    expect(result.status).toEqual(404);
  });

  it("Retorna as recomendações com maior pontuação", async () => {
    await supertest(app).post("/recommendations").send(createRecommendation());
    await supertest(app).post("/recommendations").send(createRecommendation());
    await supertest(app).post("/recommendations").send(createRecommendation());
    await supertest(app).post("/recommendations").send(createRecommendation());
    await supertest(app).post("/recommendations").send(createRecommendation());

    await supertest(app).post("/recommendations/1/upvote");
    await supertest(app).post("/recommendations/1/upvote");
    await supertest(app).post("/recommendations/1/upvote");

    await supertest(app).post("/recommendations/2/upvote");
    await supertest(app).post("/recommendations/2/upvote");

    await supertest(app).post("/recommendations/3/upvote");

    const result = await supertest(app).get(`/recommendations/top/${10}`);

    expect(result.body).toBeInstanceOf(Array);
    expect(result.body[0].score).toBeGreaterThanOrEqual(result.body[1].score);
  });
});

async function downvote(id: number) {
  await supertest(app).post(`/recommendations/${id}/downvote`);
}
