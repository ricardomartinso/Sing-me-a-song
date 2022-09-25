import { Recommendation } from "@prisma/client";

export type createManyRecommendations = [Omit<Recommendation, "id">];
