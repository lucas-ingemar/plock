import ky from "ky";
import type { Api } from "./Api";
import type { Haul, HaulPrompt, HaulRequest, HaulResponse, HaulSummary, Recipe, RecipeReview } from "../types/types";


const DATE_ONLY_KEYS = new Set(["date"])

const isoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/
const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/

const reviveDates = (key: string, value: unknown) => {
    if (typeof value !== "string") return value

    if (key.endsWith("_at") && isoDateTime.test(value)) {
        return new Date(value)
    }

    const date = key === "date" ? isoDate.exec(value) : null
    if (date) {
        const [, year, month, day] = date
        return new Date(Number(year), Number(month) - 1, Number(day))
    }

    return value
}
const toJsonWithDates = (value: unknown) =>
    JSON.stringify(value, function (key, serialized) {
        const original = this[key]
        return original instanceof Date && DATE_ONLY_KEYS.has(key)
            ? original.toISOString().slice(0, 10)
            : serialized
    })

export class ServerApi implements Api {

    private base = ky.extend({
        retry: 0,
        hooks: {
            afterResponse: [
                async ({ response }) => {
                    if (response.status >= 400) {
                        // let title = "Error";
                        // let msg = "";
                        // let code = "";

                        // try {
                        //     const clone = response.clone();
                        //     const text = await clone.text();

                        //     msg = text;

                        //     try {
                        //         const json = JSON.parse(text);
                        //         if (isBragErr(json.error)) {
                        //             title = json.error.title;
                        //             msg = json.error.message;
                        //             code = json.error.code;
                        //         }
                        //     } catch {}

                        // } catch (e) {
                        //     msg = "could not parse response";
                        // }

                        // this.emitEvent(Event.MsgErr, {title: title, message: msg})

                        // if (response.status == 401 && code != "INVALIDUSERCREDS") {
                        //     this.emitEvent(Event.UserUpdated, null);
                        // }

                    }

                    return response;
                },
            ],
        },
    });

    // private auth = this.base.extend({
    //     prefix: "/auth",
    // });

    private api = ky.create({
        prefix: "/api",
        parseJson: (text) => JSON.parse(text, reviveDates),
    })

    async addHaul(haul: HaulRequest): Promise<Haul> {
        return await this.api.post(`/hauls`, { json: haul}).json<Haul>();
    }

    async addHaulPromptResponse(id: string, haul: HaulResponse): Promise<Haul> {
        return await this.api
            .post(`hauls/${id}/prompt`, {
                body: toJsonWithDates(haul),
                headers: { "Content-Type": "application/json" },
            })
            .json<Haul>()
    }

    async getHaul(id: string): Promise<Haul> {
        return await this.api.get(`/hauls/${id}`).json<Haul>();
    }

    async getHaulPrompt(id: string): Promise<HaulPrompt> {
        return await this.api.get(`/hauls/${id}/prompt`).json<HaulPrompt>();
    }

    async listHauls(): Promise<HaulSummary[]> {
        return await this.api.get(`/hauls`).json<HaulSummary[]>();
    }


    async getRecipe(id: string): Promise<Recipe> {
        return await this.api.get(`/recipes/${id}`).json<Recipe>();
    }

    async addRecipeReview(recipeID: string, review: RecipeReview): Promise<void> {
        await this.api.post(`/recipes/${recipeID}/review`, { json: review});
    }

}
