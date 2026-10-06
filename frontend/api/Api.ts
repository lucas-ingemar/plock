import type { Haul, HaulPrompt, HaulRequest, HaulResponse, HaulSummary, Recipe } from "../types/types";

export interface Api {
    addHaul(haul: HaulRequest): Promise<Haul>;
    addHaulPromptResponse(id: string, haul: HaulResponse): Promise<Haul>;
    getHaul(id: string): Promise<Haul>;
    getHaulPrompt(id: string): Promise<HaulPrompt>;
    listHauls(): Promise<HaulSummary[]>;

    getRecipe(id: string): Promise<Recipe>;
}
