import type { Haul, HaulPrompt, HaulRequest, HaulResponse, HaulSummary, Recipe, RecipeReview } from "../types/types";

export interface Api {
    onUnauthorized(listener: () => void): () => void;

    addHaul(haul: HaulRequest): Promise<Haul>;
    addHaulPromptResponse(id: string, haul: HaulResponse): Promise<Haul>;
    getHaul(id: string): Promise<Haul>;
    getHaulPrompt(id: string): Promise<HaulPrompt>;
    listHauls(): Promise<HaulSummary[]>;

    getRecipe(id: string): Promise<Recipe>;
    addRecipeReview(recipeID: string, review: RecipeReview): Promise<void>;


    me(): Promise<null>
}
