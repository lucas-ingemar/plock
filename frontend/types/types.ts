// To parse this data:
//
//   import { Convert, Cuisine, HaulPrompt, HaulRequest, Haul, Protein } from "./file";
//
//   const cookingMinutes = Convert.toCookingMinutes(json);
//   const cuisine = Convert.toCuisine(json);
//   const haulPrompt = Convert.toHaulPrompt(json);
//   const haulRequest = Convert.toHaulRequest(json);
//   const haul = Convert.toHaul(json);
//   const protein = Convert.toProtein(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * A generated prompt the user can copy into their own AI assistant.
 */
export interface HaulPrompt {
    /**
     * The full prompt text.
     */
    prompt: string;
}

/**
 * Household and meal preferences used to generate recipes.
 */
export interface HaulRequest {
    /**
     * Number of adults in the household.
     */
    adults: number;
    /**
     * Number of children in the household.
     */
    children: number;
    /**
     * Preferred cuisines. An empty list means any cuisine.
     */
    cuisine_preferences: Cuisine[];
    max_cooking_minutes: number;
    /**
     * Number of meals to plan.
     */
    meal_count: number;
    /**
     * Proteins the household eats. Proteins not listed are excluded from recipes.
     */
    protein_preferences: Protein[];
    /**
     * Servings per meal, including any extra portions for leftovers.
     */
    servings_per_meal: number;
}

export enum Cuisine {
    American = "american",
    Chinese = "chinese",
    French = "french",
    Greek = "greek",
    Indian = "indian",
    Italian = "italian",
    Japanese = "japanese",
    Korean = "korean",
    LatinAmerican = "latin_american",
    Mexican = "mexican",
    Moroccan = "moroccan",
    Spanish = "spanish",
    Swedish = "swedish",
    Thai = "thai",
    Turkish = "turkish",
    Vietnamese = "vietnamese",
}

export enum Protein {
    Beef = "beef",
    Chicken = "chicken",
    Fish = "fish",
    Lamb = "lamb",
    Pork = "pork",
    Seafood = "seafood",
    Vegan = "vegan",
    Vegetarian = "vegetarian",
}

/**
 * A grocery haul with the household and meal preferences used to plan it.
 */
export interface Haul {
    /**
     * Number of adults in the household.
     */
    adults: number;
    /**
     * Number of children in the household.
     */
    children:   number;
    created_at: Date;
    /**
     * Preferred cuisines. An empty list means any cuisine.
     */
    cuisine_preferences: Cuisine[];
    /**
     * UUID v4.
     */
    id:                  string;
    max_cooking_minutes: number;
    /**
     * Number of meals to plan.
     */
    meal_count: number;
    /**
     * Proteins the household eats. Proteins not listed are excluded from recipes.
     */
    protein_preferences: Protein[];
    /**
     * Servings per meal, including any extra portions for leftovers.
     */
    servings_per_meal: number;
    status:            Status;
    updated_at:        Date;
}

/**
 * draft: preferences saved, no receipt yet. processing: receipt received, recipes being
 * generated. ready: recipes available. failed: processing failed. archived: no longer
 * active.
 */
export enum Status {
    Archived = "archived",
    Draft = "draft",
    Failed = "failed",
    Processing = "processing",
    Ready = "ready",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCookingMinutes(json: string): number {
        return cast(JSON.parse(json), 0);
    }

    public static cookingMinutesToJson(value: number): string {
        return JSON.stringify(uncast(value, 0), null, 2);
    }

    public static toCuisine(json: string): Cuisine {
        return cast(JSON.parse(json), r("Cuisine"));
    }

    public static cuisineToJson(value: Cuisine): string {
        return JSON.stringify(uncast(value, r("Cuisine")), null, 2);
    }

    public static toHaulPrompt(json: string): HaulPrompt {
        return cast(JSON.parse(json), r("HaulPrompt"));
    }

    public static haulPromptToJson(value: HaulPrompt): string {
        return JSON.stringify(uncast(value, r("HaulPrompt")), null, 2);
    }

    public static toHaulRequest(json: string): HaulRequest {
        return cast(JSON.parse(json), r("HaulRequest"));
    }

    public static haulRequestToJson(value: HaulRequest): string {
        return JSON.stringify(uncast(value, r("HaulRequest")), null, 2);
    }

    public static toHaul(json: string): Haul {
        return cast(JSON.parse(json), r("Haul"));
    }

    public static haulToJson(value: Haul): string {
        return JSON.stringify(uncast(value, r("Haul")), null, 2);
    }

    public static toProtein(json: string): Protein {
        return cast(JSON.parse(json), r("Protein"));
    }

    public static proteinToJson(value: Protein): string {
        return JSON.stringify(uncast(value, r("Protein")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "HaulPrompt": o([
        { json: "prompt", js: "prompt", typ: "" },
    ], false),
    "HaulRequest": o([
        { json: "adults", js: "adults", typ: 0 },
        { json: "children", js: "children", typ: 0 },
        { json: "cuisine_preferences", js: "cuisine_preferences", typ: a(r("Cuisine")) },
        { json: "max_cooking_minutes", js: "max_cooking_minutes", typ: 0 },
        { json: "meal_count", js: "meal_count", typ: 0 },
        { json: "protein_preferences", js: "protein_preferences", typ: a(r("Protein")) },
        { json: "servings_per_meal", js: "servings_per_meal", typ: 0 },
    ], false),
    "Haul": o([
        { json: "adults", js: "adults", typ: 0 },
        { json: "children", js: "children", typ: 0 },
        { json: "created_at", js: "created_at", typ: Date },
        { json: "cuisine_preferences", js: "cuisine_preferences", typ: a(r("Cuisine")) },
        { json: "id", js: "id", typ: "" },
        { json: "max_cooking_minutes", js: "max_cooking_minutes", typ: 0 },
        { json: "meal_count", js: "meal_count", typ: 0 },
        { json: "protein_preferences", js: "protein_preferences", typ: a(r("Protein")) },
        { json: "servings_per_meal", js: "servings_per_meal", typ: 0 },
        { json: "status", js: "status", typ: r("Status") },
        { json: "updated_at", js: "updated_at", typ: Date },
    ], false),
    "Cuisine": [
        "american",
        "chinese",
        "french",
        "greek",
        "indian",
        "italian",
        "japanese",
        "korean",
        "latin_american",
        "mexican",
        "moroccan",
        "spanish",
        "swedish",
        "thai",
        "turkish",
        "vietnamese",
    ],
    "Protein": [
        "beef",
        "chicken",
        "fish",
        "lamb",
        "pork",
        "seafood",
        "vegan",
        "vegetarian",
    ],
    "Status": [
        "archived",
        "draft",
        "failed",
        "processing",
        "ready",
    ],
};
