import ky from "ky";
import type { Api } from "./Api";
import type { Haul, HaulRequest } from "../types/types";

const isoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

const reviveDates = (key: string, value: unknown) =>
    key.endsWith("_at") && typeof value === "string" && isoDate.test(value) ? new Date(value) : value


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
        // this.emitEvent(Event.EntitiesUpdated);
    }

    async listHauls(): Promise<Haul[]> {
        return await this.api.get(`/hauls`).json<Haul[]>();
        // this.emitEvent(Event.EntitiesUpdated);
    }
}
