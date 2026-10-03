import type { Haul, HaulPrompt, HaulRequest } from "../types/types";

export interface Api {
    addHaul(haul: HaulRequest): Promise<Haul>;
    getHaul(id: string): Promise<Haul>;
    getHaulPrompt(id: string): Promise<HaulPrompt>;
    listHauls(): Promise<Haul[]>;
}
