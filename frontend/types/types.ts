// To parse this data:
//
//   import { Convert, Cuisine, Difficulty, GeneratedBy, HaulBase, HaulPrompt, HaulRequest, HaulResponse, Haul, HaulSummary, Ingredient, ItemCategory, Protein, ReceiptItem, Receipt, Recipe, RecipeStep, RecipeSummary, Status, Unit } from "./file";
//
//   const cookingMinutes = Convert.toCookingMinutes(json);
//   const cuisine = Convert.toCuisine(json);
//   const difficulty = Convert.toDifficulty(json);
//   const generatedBy = Convert.toGeneratedBy(json);
//   const haulBase = Convert.toHaulBase(json);
//   const haulPrompt = Convert.toHaulPrompt(json);
//   const haulRequest = Convert.toHaulRequest(json);
//   const haulResponse = Convert.toHaulResponse(json);
//   const haul = Convert.toHaul(json);
//   const haulSummary = Convert.toHaulSummary(json);
//   const ingredient = Convert.toIngredient(json);
//   const itemCategory = Convert.toItemCategory(json);
//   const protein = Convert.toProtein(json);
//   const receiptItem = Convert.toReceiptItem(json);
//   const receipt = Convert.toReceipt(json);
//   const recipe = Convert.toRecipe(json);
//   const recipeStep = Convert.toRecipeStep(json);
//   const recipeSummary = Convert.toRecipeSummary(json);
//   const status = Convert.toStatus(json);
//   const unit = Convert.toUnit(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * Fields shared by Haul and HaulSummary.
 */
export interface HaulBase {
    /**
     * Number of adults in the household.
     */
    adults: number;
    /**
     * Number of children in the household.
     */
    children: number;
    /**
     * When the haul was created.
     */
    created_at: Date;
    /**
     * Preferred cuisines. An empty list means any cuisine.
     */
    cuisine_preferences: Cuisine[];
    /**
     * The assistant that generated the recipes. Set once the AI response has been added.
     */
    generated_by?: GeneratedBy;
    /**
     * UUID v4.
     */
    id: string;
    /**
     * BCP 47 tag for all free text in the recipes, e.g. sv-SE. Set once the AI response has
     * been added.
     */
    language?: string;
    /**
     * Maximum cooking time per meal.
     */
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
    /**
     * Processing status of the haul.
     */
    status: Status;
    /**
     * Short title for the whole set of recipes. Set once the AI response has been added.
     */
    title?: string;
    /**
     * When the haul was last updated.
     */
    updated_at: Date;
    [property: string]: any;
}

/**
 * Cuisine a recipe belongs to or a household prefers.
 *
 * Cuisine the recipe belongs to.
 */
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

/**
 * The AI assistant that generated the response, as reported by the assistant itself.
 *
 * The assistant that generated the recipes. Set once the AI response has been added.
 *
 * The assistant that generated the response.
 */
export interface GeneratedBy {
    /**
     * Assistant name, e.g. Claude or ChatGPT.
     */
    assistant: string;
    /**
     * Model identifier as reported by the assistant.
     */
    model: string;
}

/**
 * Main protein source in a recipe or a household preference.
 *
 * Main protein in the recipe.
 */
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
 * Processing status of the haul.
 *
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
    /**
     * Maximum cooking time per meal.
     */
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

/**
 * Receipt analysis and recipes returned by the AI assistant.
 */
export interface HaulResponse {
    /**
     * The assistant that generated the response.
     */
    generated_by: GeneratedBy;
    /**
     * BCP 47 tag for all free text, e.g. sv-SE.
     */
    language: string;
    /**
     * Analysis of the receipt.
     */
    receipt: Receipt;
    /**
     * Generated recipes, one per planned meal.
     */
    recipes: Recipe[];
    /**
     * Short title for the whole set of recipes.
     */
    title: string;
}

/**
 * Analysis of the receipt.
 *
 * Analysis of the grocery receipt.
 *
 * Analysis of the receipt. Set once the AI response has been added.
 */
export interface Receipt {
    /**
     * ISO 4217 code, e.g. SEK.
     */
    currency: string;
    /**
     * Purchase date.
     */
    date: Date;
    /**
     * Number of items according to the receipt.
     */
    item_count: number;
    /**
     * Every line on the receipt, including non-food items.
     */
    items: ReceiptItem[];
    /**
     * Store or chain name, e.g. Willys.
     */
    store: string;
    /**
     * One or two sentences describing the purchase.
     */
    summary: string;
    /**
     * Total amount paid, including fees.
     */
    total: number;
    /**
     * Total discounts on the receipt, when printed.
     */
    total_savings?: number;
}

/**
 * One line on the receipt.
 */
export interface ReceiptItem {
    /**
     * Brand name, when printed on the receipt.
     */
    brand?: string;
    /**
     * Item category.
     */
    category: ItemCategory;
    /**
     * Discount as a positive number.
     */
    discount?: number;
    /**
     * False for non-food items like detergent or diapers.
     */
    is_food: boolean;
    /**
     * Normalized item name.
     */
    name: string;
    /**
     * Line total before discount.
     */
    price: number;
    /**
     * Total amount, e.g. 800 for two packs of 400 g.
     */
    quantity: number;
    /**
     * Unit for quantity.
     */
    unit: Unit;
}

/**
 * Item category.
 *
 * Category of a receipt item.
 */
export enum ItemCategory {
    Baby = "baby",
    Beverages = "beverages",
    Bread = "bread",
    Dairy = "dairy",
    Frozen = "frozen",
    Fruit = "fruit",
    Household = "household",
    Hygiene = "hygiene",
    Other = "other",
    Pantry = "pantry",
    Protein = "protein",
    ReadyMeals = "ready_meals",
    Snacks = "snacks",
    Vegetables = "vegetables",
}

/**
 * Unit for quantity.
 *
 * Unit of measurement. Displayed in the user's language by the app.
 *
 * Unit for quantity. Omitted for countless amounts like 'to taste'.
 */
export enum Unit {
    Can = "can",
    Clove = "clove",
    DL = "dl",
    G = "g",
    Kg = "kg",
    L = "l",
    Ml = "ml",
    Package = "package",
    Piece = "piece",
    Pinch = "pinch",
    TSP = "tsp",
    Tbsp = "tbsp",
}

/**
 * A recipe generated from the receipt and household preferences.
 */
export interface Recipe {
    /**
     * Cuisine the recipe belongs to.
     */
    cuisine: Cuisine;
    /**
     * One or two sentences describing the dish.
     */
    description: string;
    /**
     * How demanding the recipe is to cook.
     */
    difficulty: Difficulty;
    /**
     * Recipe ID, UUID v4. Set by the server when the recipe is saved. Leave out when generating
     * recipes.
     */
    id?: string;
    /**
     * Ingredients with amounts for the given servings.
     */
    ingredients: Ingredient[];
    /**
     * Adaptations for children in the household. Omitted when not relevant.
     */
    kid_tips?: string;
    /**
     * Main protein in the recipe.
     */
    protein: Protein;
    /**
     * Number of servings the ingredient amounts are for.
     */
    servings: number;
    /**
     * Cooking steps in order.
     */
    steps: RecipeStep[];
    /**
     * Recipe name.
     */
    title: string;
    /**
     * Total time from start to served, in minutes.
     */
    total_time_minutes: number;
}

/**
 * How demanding a recipe is to cook.
 *
 * How demanding the recipe is to cook.
 */
export enum Difficulty {
    Easy = "easy",
    Hard = "hard",
    Medium = "medium",
}

/**
 * An ingredient in a recipe.
 */
export interface Ingredient {
    /**
     * True if the ingredient comes from the receipt, false if it is a pantry staple.
     */
    from_receipt: boolean;
    /**
     * Ingredient name in the response language.
     */
    name: string;
    /**
     * Preparation or usage note, e.g. 'drained'.
     */
    note?: string;
    /**
     * Omitted for amounts like 'to taste'.
     */
    quantity?: number;
    /**
     * Unit for quantity. Omitted for countless amounts like 'to taste'.
     */
    unit?: Unit;
}

/**
 * One step in a recipe.
 */
export interface RecipeStep {
    /**
     * Instruction for the step.
     */
    text: string;
    /**
     * Set when the step involves waiting or cooking for a fixed time.
     */
    timer_minutes?: number;
}

/**
 * A grocery haul with the household and meal preferences used to plan it, the receipt
 * analysis and the recipes.
 *
 * Fields shared by Haul and HaulSummary.
 */
export interface Haul {
    /**
     * Analysis of the receipt. Set once the AI response has been added.
     */
    receipt?: Receipt;
    /**
     * Generated recipes, one per planned meal. Set once the AI response has been added.
     */
    recipes?: Recipe[];
    /**
     * Number of adults in the household.
     */
    adults: number;
    /**
     * Number of children in the household.
     */
    children: number;
    /**
     * When the haul was created.
     */
    created_at: Date;
    /**
     * Preferred cuisines. An empty list means any cuisine.
     */
    cuisine_preferences: Cuisine[];
    /**
     * The assistant that generated the recipes. Set once the AI response has been added.
     */
    generated_by?: GeneratedBy;
    /**
     * UUID v4.
     */
    id: string;
    /**
     * BCP 47 tag for all free text in the recipes, e.g. sv-SE. Set once the AI response has
     * been added.
     */
    language?: string;
    /**
     * Maximum cooking time per meal.
     */
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
    /**
     * Processing status of the haul.
     */
    status: Status;
    /**
     * Short title for the whole set of recipes. Set once the AI response has been added.
     */
    title?: string;
    /**
     * When the haul was last updated.
     */
    updated_at: Date;
    [property: string]: any;
}

/**
 * A haul without the receipt and full recipes, used when listing hauls.
 *
 * Fields shared by Haul and HaulSummary.
 */
export interface HaulSummary {
    /**
     * Short versions of the generated recipes. Empty until the AI response has been added.
     */
    recipes?: RecipeSummary[];
    /**
     * Number of adults in the household.
     */
    adults: number;
    /**
     * Number of children in the household.
     */
    children: number;
    /**
     * When the haul was created.
     */
    created_at: Date;
    /**
     * Preferred cuisines. An empty list means any cuisine.
     */
    cuisine_preferences: Cuisine[];
    /**
     * The assistant that generated the recipes. Set once the AI response has been added.
     */
    generated_by?: GeneratedBy;
    /**
     * UUID v4.
     */
    id: string;
    /**
     * BCP 47 tag for all free text in the recipes, e.g. sv-SE. Set once the AI response has
     * been added.
     */
    language?: string;
    /**
     * Maximum cooking time per meal.
     */
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
    /**
     * Processing status of the haul.
     */
    status: Status;
    /**
     * Short title for the whole set of recipes. Set once the AI response has been added.
     */
    title?: string;
    /**
     * When the haul was last updated.
     */
    updated_at: Date;
    [property: string]: any;
}

/**
 * Short version of a recipe, used in lists.
 */
export interface RecipeSummary {
    /**
     * Recipe ID. UUID v4.
     */
    id: string;
    /**
     * Recipe name.
     */
    title: string;
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

    public static toDifficulty(json: string): Difficulty {
        return cast(JSON.parse(json), r("Difficulty"));
    }

    public static difficultyToJson(value: Difficulty): string {
        return JSON.stringify(uncast(value, r("Difficulty")), null, 2);
    }

    public static toGeneratedBy(json: string): GeneratedBy {
        return cast(JSON.parse(json), r("GeneratedBy"));
    }

    public static generatedByToJson(value: GeneratedBy): string {
        return JSON.stringify(uncast(value, r("GeneratedBy")), null, 2);
    }

    public static toHaulBase(json: string): HaulBase {
        return cast(JSON.parse(json), r("HaulBase"));
    }

    public static haulBaseToJson(value: HaulBase): string {
        return JSON.stringify(uncast(value, r("HaulBase")), null, 2);
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

    public static toHaulResponse(json: string): HaulResponse {
        return cast(JSON.parse(json), r("HaulResponse"));
    }

    public static haulResponseToJson(value: HaulResponse): string {
        return JSON.stringify(uncast(value, r("HaulResponse")), null, 2);
    }

    public static toHaul(json: string): Haul {
        return cast(JSON.parse(json), r("Haul"));
    }

    public static haulToJson(value: Haul): string {
        return JSON.stringify(uncast(value, r("Haul")), null, 2);
    }

    public static toHaulSummary(json: string): HaulSummary {
        return cast(JSON.parse(json), r("HaulSummary"));
    }

    public static haulSummaryToJson(value: HaulSummary): string {
        return JSON.stringify(uncast(value, r("HaulSummary")), null, 2);
    }

    public static toIngredient(json: string): Ingredient {
        return cast(JSON.parse(json), r("Ingredient"));
    }

    public static ingredientToJson(value: Ingredient): string {
        return JSON.stringify(uncast(value, r("Ingredient")), null, 2);
    }

    public static toItemCategory(json: string): ItemCategory {
        return cast(JSON.parse(json), r("ItemCategory"));
    }

    public static itemCategoryToJson(value: ItemCategory): string {
        return JSON.stringify(uncast(value, r("ItemCategory")), null, 2);
    }

    public static toProtein(json: string): Protein {
        return cast(JSON.parse(json), r("Protein"));
    }

    public static proteinToJson(value: Protein): string {
        return JSON.stringify(uncast(value, r("Protein")), null, 2);
    }

    public static toReceiptItem(json: string): ReceiptItem {
        return cast(JSON.parse(json), r("ReceiptItem"));
    }

    public static receiptItemToJson(value: ReceiptItem): string {
        return JSON.stringify(uncast(value, r("ReceiptItem")), null, 2);
    }

    public static toReceipt(json: string): Receipt {
        return cast(JSON.parse(json), r("Receipt"));
    }

    public static receiptToJson(value: Receipt): string {
        return JSON.stringify(uncast(value, r("Receipt")), null, 2);
    }

    public static toRecipe(json: string): Recipe {
        return cast(JSON.parse(json), r("Recipe"));
    }

    public static recipeToJson(value: Recipe): string {
        return JSON.stringify(uncast(value, r("Recipe")), null, 2);
    }

    public static toRecipeStep(json: string): RecipeStep {
        return cast(JSON.parse(json), r("RecipeStep"));
    }

    public static recipeStepToJson(value: RecipeStep): string {
        return JSON.stringify(uncast(value, r("RecipeStep")), null, 2);
    }

    public static toRecipeSummary(json: string): RecipeSummary {
        return cast(JSON.parse(json), r("RecipeSummary"));
    }

    public static recipeSummaryToJson(value: RecipeSummary): string {
        return JSON.stringify(uncast(value, r("RecipeSummary")), null, 2);
    }

    public static toStatus(json: string): Status {
        return cast(JSON.parse(json), r("Status"));
    }

    public static statusToJson(value: Status): string {
        return JSON.stringify(uncast(value, r("Status")), null, 2);
    }

    public static toUnit(json: string): Unit {
        return cast(JSON.parse(json), r("Unit"));
    }

    public static unitToJson(value: Unit): string {
        return JSON.stringify(uncast(value, r("Unit")), null, 2);
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
    "HaulBase": o([
        { json: "adults", js: "adults", typ: 0 },
        { json: "children", js: "children", typ: 0 },
        { json: "created_at", js: "created_at", typ: Date },
        { json: "cuisine_preferences", js: "cuisine_preferences", typ: a(r("Cuisine")) },
        { json: "generated_by", js: "generated_by", typ: u(undefined, r("GeneratedBy")) },
        { json: "id", js: "id", typ: "" },
        { json: "language", js: "language", typ: u(undefined, "") },
        { json: "max_cooking_minutes", js: "max_cooking_minutes", typ: 0 },
        { json: "meal_count", js: "meal_count", typ: 0 },
        { json: "protein_preferences", js: "protein_preferences", typ: a(r("Protein")) },
        { json: "servings_per_meal", js: "servings_per_meal", typ: 0 },
        { json: "status", js: "status", typ: r("Status") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "updated_at", js: "updated_at", typ: Date },
    ], "any"),
    "GeneratedBy": o([
        { json: "assistant", js: "assistant", typ: "" },
        { json: "model", js: "model", typ: "" },
    ], false),
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
    "HaulResponse": o([
        { json: "generated_by", js: "generated_by", typ: r("GeneratedBy") },
        { json: "language", js: "language", typ: "" },
        { json: "receipt", js: "receipt", typ: r("Receipt") },
        { json: "recipes", js: "recipes", typ: a(r("Recipe")) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Receipt": o([
        { json: "currency", js: "currency", typ: "" },
        { json: "date", js: "date", typ: Date },
        { json: "item_count", js: "item_count", typ: 0 },
        { json: "items", js: "items", typ: a(r("ReceiptItem")) },
        { json: "store", js: "store", typ: "" },
        { json: "summary", js: "summary", typ: "" },
        { json: "total", js: "total", typ: 3.14 },
        { json: "total_savings", js: "total_savings", typ: u(undefined, 3.14) },
    ], false),
    "ReceiptItem": o([
        { json: "brand", js: "brand", typ: u(undefined, "") },
        { json: "category", js: "category", typ: r("ItemCategory") },
        { json: "discount", js: "discount", typ: u(undefined, 3.14) },
        { json: "is_food", js: "is_food", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "price", js: "price", typ: 3.14 },
        { json: "quantity", js: "quantity", typ: 3.14 },
        { json: "unit", js: "unit", typ: r("Unit") },
    ], false),
    "Recipe": o([
        { json: "cuisine", js: "cuisine", typ: r("Cuisine") },
        { json: "description", js: "description", typ: "" },
        { json: "difficulty", js: "difficulty", typ: r("Difficulty") },
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "ingredients", js: "ingredients", typ: a(r("Ingredient")) },
        { json: "kid_tips", js: "kid_tips", typ: u(undefined, "") },
        { json: "protein", js: "protein", typ: r("Protein") },
        { json: "servings", js: "servings", typ: 0 },
        { json: "steps", js: "steps", typ: a(r("RecipeStep")) },
        { json: "title", js: "title", typ: "" },
        { json: "total_time_minutes", js: "total_time_minutes", typ: 0 },
    ], false),
    "Ingredient": o([
        { json: "from_receipt", js: "from_receipt", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "note", js: "note", typ: u(undefined, "") },
        { json: "quantity", js: "quantity", typ: u(undefined, 3.14) },
        { json: "unit", js: "unit", typ: u(undefined, r("Unit")) },
    ], false),
    "RecipeStep": o([
        { json: "text", js: "text", typ: "" },
        { json: "timer_minutes", js: "timer_minutes", typ: u(undefined, 0) },
    ], false),
    "Haul": o([
        { json: "receipt", js: "receipt", typ: u(undefined, r("Receipt")) },
        { json: "recipes", js: "recipes", typ: u(undefined, a(r("Recipe"))) },
        { json: "adults", js: "adults", typ: 0 },
        { json: "children", js: "children", typ: 0 },
        { json: "created_at", js: "created_at", typ: Date },
        { json: "cuisine_preferences", js: "cuisine_preferences", typ: a(r("Cuisine")) },
        { json: "generated_by", js: "generated_by", typ: u(undefined, r("GeneratedBy")) },
        { json: "id", js: "id", typ: "" },
        { json: "language", js: "language", typ: u(undefined, "") },
        { json: "max_cooking_minutes", js: "max_cooking_minutes", typ: 0 },
        { json: "meal_count", js: "meal_count", typ: 0 },
        { json: "protein_preferences", js: "protein_preferences", typ: a(r("Protein")) },
        { json: "servings_per_meal", js: "servings_per_meal", typ: 0 },
        { json: "status", js: "status", typ: r("Status") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "updated_at", js: "updated_at", typ: Date },
    ], "any"),
    "HaulSummary": o([
        { json: "recipes", js: "recipes", typ: u(undefined, a(r("RecipeSummary"))) },
        { json: "adults", js: "adults", typ: 0 },
        { json: "children", js: "children", typ: 0 },
        { json: "created_at", js: "created_at", typ: Date },
        { json: "cuisine_preferences", js: "cuisine_preferences", typ: a(r("Cuisine")) },
        { json: "generated_by", js: "generated_by", typ: u(undefined, r("GeneratedBy")) },
        { json: "id", js: "id", typ: "" },
        { json: "language", js: "language", typ: u(undefined, "") },
        { json: "max_cooking_minutes", js: "max_cooking_minutes", typ: 0 },
        { json: "meal_count", js: "meal_count", typ: 0 },
        { json: "protein_preferences", js: "protein_preferences", typ: a(r("Protein")) },
        { json: "servings_per_meal", js: "servings_per_meal", typ: 0 },
        { json: "status", js: "status", typ: r("Status") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "updated_at", js: "updated_at", typ: Date },
    ], "any"),
    "RecipeSummary": o([
        { json: "id", js: "id", typ: "" },
        { json: "title", js: "title", typ: "" },
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
    "ItemCategory": [
        "baby",
        "beverages",
        "bread",
        "dairy",
        "frozen",
        "fruit",
        "household",
        "hygiene",
        "other",
        "pantry",
        "protein",
        "ready_meals",
        "snacks",
        "vegetables",
    ],
    "Unit": [
        "can",
        "clove",
        "dl",
        "g",
        "kg",
        "l",
        "ml",
        "package",
        "piece",
        "pinch",
        "tsp",
        "tbsp",
    ],
    "Difficulty": [
        "easy",
        "hard",
        "medium",
    ],
};
