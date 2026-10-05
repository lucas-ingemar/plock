import ky from "ky";
import type { Api } from "./Api";
import type { Haul, HaulPrompt, HaulRequest, HaulResponse, HaulSummary } from "../types/types";

const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

const DATE_ONLY_KEYS = new Set(["date"])

const reviveDates = (key: string, value: unknown) =>
    key.endsWith("_at") && typeof value === "string" && isoDate.test(value) ? new Date(value) : value

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

}
