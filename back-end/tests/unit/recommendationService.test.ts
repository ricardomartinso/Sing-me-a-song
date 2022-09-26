import * as recommendationServices from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import recommendationFactory from "../factories/recommendationFactory";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";
import { prisma } from "../../src/database";
import { Recommendation } from "@prisma/client";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE "recommendations" RESTART IDENTITY CASCADE`;
});
afterAll(async () => {
  await prisma.$disconnect();
});

describe("Recommendations services creation", () => {
  it("Testa criação de recomendação no service com sucesso", async () => {
    const recommendation = recommendationFactory.createRecommendation();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(undefined);

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    await recommendationServices.recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Testa a criação de recomendação com nome repetido", async () => {
    const recommendation = recommendationFactory.createRecommendation();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return {
          name: recommendation.name,
          youtubeLink: recommendation.youtubeLink,
        };
      });

    try {
      const promise = await recommendationServices.recommendationService.insert(
        recommendation
      );
    } catch (error) {
      expect(error).toEqual(
        conflictError("Recommendations names must be unique")
      );
    }
  });
});

describe("Recommendations services votes", () => {
  it("Testa o upvote em uma recomendação", async () => {
    const recommendation = recommendationFactory.getRecommendation();

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);

    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: recommendation.score + 1,
    });

    const result = await recommendationServices.recommendationService.upvote(1);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Testa a falha do upvote em recomendação inexistente", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    try {
      const promise = await recommendationServices.recommendationService.upvote(
        99
      );
    } catch (error) {
      expect(error).toEqual(notFoundError(""));
    }
  });

  it("Testa o downvote em uma recomendação", async () => {
    const recommendation = recommendationFactory.getRecommendation();

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);

    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: recommendation.score - 1,
    });

    const result = await recommendationServices.recommendationService.downvote(
      1
    );

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Testa a falha do downvote em recomendação inexistente", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    try {
      const promise =
        await recommendationServices.recommendationService.downvote(99);
    } catch (error) {
      expect(error).toEqual(notFoundError(""));
    }
  });

  it("Testa a remoção de uma recomendação", async () => {
    const recommendation = recommendationFactory.toDeleteRecommendation();

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);

    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      ...recommendation,
      score: recommendation.score - 1,
    });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {
        return;
      });

    await recommendationServices.recommendationService.downvote(1);

    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("Recommendations services get", () => {
  it("Testa o GET para receber recomendações", async () => {
    const recommendations = recommendationFactory.getXRecommendations(10);

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendations);

    await recommendationServices.recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Testa o GET para receber recomendaçoes do TOP X", async () => {
    const recommendationsNumber = 5;
    const recommendations = recommendationFactory
      .getXRecommendations(recommendationsNumber)
      .sort((a, b) => {
        return b.score - a.score;
      });

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce(recommendations);

    const result = await recommendationServices.recommendationService.getTop(
      recommendationsNumber
    );

    expect(recommendationRepository.getAmountByScore).toBeCalled();
    expect(recommendations[0].score).toBeGreaterThanOrEqual(
      recommendations[1].score
    );
    expect(result.length).toEqual(recommendationsNumber);
  });

  it("Testa o GET para receber recomendações aleatórias com Math random menor que 0.7", async () => {
    const recommendations = [
      {
        id: 3,
        name: "teste recomendacao aleatoria 1",
        youtubeLink: `https://www.youtube.com/watch?v=2asijrfi325`,
        score: 340,
      },
      {
        id: 4,
        name: "teste recomendacao aleatoria 2",
        youtubeLink: `https://www.youtube.com/watch?v=124fat6wte`,
        score: 230,
      },
      {
        id: 5,
        name: "teste recomendacao aleatoria 3",
        youtubeLink: `https://www.youtube.com/watch?v=xvcfqwca`,
        score: 120,
      },
      {
        id: 6,
        name: "teste recomendacao aleatoria 4",
        youtubeLink: `https://www.youtube.com/watch?v=gerwyw3341`,
        score: 30,
      },
      {
        id: 6,
        name: "teste recomendacao aleatoria 5",
        youtubeLink: `https://www.youtube.com/watch?v=as24dst436`,
        score: 15,
      },
      {
        id: 6,
        name: "teste recomendacao aleatoria 6",
        youtubeLink: `https://www.youtube.com/watch?v=axcqrt31`,
        score: 25,
      },
    ];

    jest.spyOn(Math, "random").mockReturnValueOnce(0.5); // "gt"

    jest
      .spyOn(Math, "floor")
      .mockReturnValueOnce(Math.floor(0.5 * recommendations.length));

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendations);

    const result =
      await recommendationServices.recommendationService.getRandom();

    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result).toBeInstanceOf(Object);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Testa o GET para receber recomendações aleatórias com Math random maior que 0.7", async () => {
    const recommendations = recommendationFactory.getXRecommendations(
      10,
      -5,
      10
    );

    jest.spyOn(Math, "random").mockReturnValueOnce(0.8); // "lte"

    jest
      .spyOn(Math, "floor")
      .mockReturnValueOnce(Math.floor(0.4 * recommendations.length));

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(recommendations);

    const result =
      await recommendationServices.recommendationService.getRandom();

    expect(result).toBeInstanceOf(Object);
    expect(recommendationRepository.findAll).toBeCalled();
    expect(result.score).toBeGreaterThanOrEqual(-5);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it("Testa o caso em que os scores de recommendation estão todos maior que 10", async () => {
    const randomRecommendations = recommendationFactory.getXRecommendations(
      10,
      10,
      100
    );

    jest.spyOn(Math, "random").mockReturnValueOnce(Math.random());

    jest
      .spyOn(Math, "floor")
      .mockReturnValueOnce(Math.floor(0.4 * randomRecommendations.length));

    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(randomRecommendations);

    const result: Recommendation =
      await recommendationServices.recommendationService.getRandom();

    expect(randomRecommendations).toContainEqual(result);
    expect(result[1]).toBeUndefined();
  });

  it("Testa o caso em que os scores de recommendation estão todos menor que ou igual a 10", async () => {
    const randomRecommendations = recommendationFactory.getXRecommendations(
      10,
      -5,
      10
    );

    jest.spyOn(Math, "random").mockReturnValueOnce(Math.random());

    jest
      .spyOn(Math, "floor")
      .mockReturnValueOnce(Math.floor(0.4 * randomRecommendations.length));

    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(randomRecommendations);

    const result: Recommendation =
      await recommendationServices.recommendationService.getRandom();

    expect(randomRecommendations).toContainEqual(result);
    expect(result[1]).toBeUndefined();
  });

  it("Testa o GET nos random para retornar not found", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    try {
      await recommendationServices.recommendationService.getRandom();
    } catch (error) {
      expect(recommendationRepository.findAll).toBeCalled();

      expect(error).toEqual(notFoundError(""));
    }
  });
});
