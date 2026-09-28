export interface Child {
    ageYears: number
}

export type Protein = "chicken" | "beef" | "pork" | "lamb" | "fish" | "seafood" | "vegetarian" | "vegan"

export type Cuisine =
    | "swedish"
    | "italian"
    | "french"
    | "spanish"
    | "greek"
    | "turkish"
    | "moroccan"
    | "indian"
    | "chinese"
    | "thai"
    | "japanese"
    | "korean"
    | "vietnamese"
    | "mexican"
    | "american"
    | "latin_american"

export interface RegistrationData {
    adults: number
    children: Child[]
    servingsPerMeal: number | null
    mealCount: number
    maxCookingMinutes: number
    proteins: Protein[]
    cuisines: Cuisine[]
    receiptFile: File | null
    receiptText: string
}

export const DEFAULT_CHILD_AGE = 4

export const initialRegistrationData: RegistrationData = {
    adults: 2,
    children: [],
    servingsPerMeal: null,
    mealCount: 5,
    maxCookingMinutes: 30,
    proteins: ["chicken", "beef", "pork", "fish", "vegetarian"],
    cuisines: [],
    receiptFile: null,
    receiptText: "",
}

export const recommendedServings = (data: RegistrationData) =>
    data.adults + data.children.length

export interface HaulRequest {
    household: {
        adults: number
        children: { age_years: number }[]
    }
    servings_per_meal: number
    meal_count: number
    max_cooking_minutes: number
    protein_preferences: Protein[]
    cuisine_preferences: Cuisine[]
    receipt_text: string | null
}

export const toHaulRequest = (data: RegistrationData): HaulRequest => ({
    household: {
        adults: data.adults,
        children: data.children.map((child) => ({ age_years: child.ageYears })),
    },
    servings_per_meal: data.servingsPerMeal ?? recommendedServings(data),
    meal_count: data.mealCount,
    max_cooking_minutes: data.maxCookingMinutes,
    protein_preferences: data.proteins,
    cuisine_preferences: data.cuisines,
    receipt_text: data.receiptText.trim() || null,
})
