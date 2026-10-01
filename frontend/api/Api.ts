import type { Haul, HaulRequest } from "../types/types";

export interface Api {
    addHaul(haul: HaulRequest): Promise<Haul>;
}
