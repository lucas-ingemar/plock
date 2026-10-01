import ky from "ky";
import type { Api } from "./Api";
import type { Haul, HaulRequest } from "../types/types";

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

    private api = this.base.extend({
        prefix: "/api",
    });


    async addHaul(haul: HaulRequest): Promise<Haul> {
        return await this.api.post(`/hauls`, { json: haul}).json<Haul>();
        // this.emitEvent(Event.EntitiesUpdated);
    }
}
