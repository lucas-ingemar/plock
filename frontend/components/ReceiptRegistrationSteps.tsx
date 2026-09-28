import { Description, Label, NumberField } from "@heroui/react"
import householdImage from "@/assets/receipt-registration/step-household.svg"
import childrenImage from "@/assets/receipt-registration/step-children.svg"
import servingsImage from "@/assets/receipt-registration/step-servings.svg"
import mealsImage from "@/assets/receipt-registration/step-meals.svg"
import timeImage from "@/assets/receipt-registration/step-time.svg"
import proteinImage from "@/assets/receipt-registration/step-protein.svg"
import cuisinesImage from "@/assets/receipt-registration/step-cuisines.svg"
import { ChoiceTiles } from "./ChoiceTiles"
import { type MultiChoiceOption, MultiChoiceTiles } from "./MultiChoiceTiles"
import {
    CuisinePreferenceElement as Cuisine,
    type HaulRequest,
    ProteinPreferenceElement as Protein,
} from "../types/haulrequest"

const DEFAULT_CHILD_AGE = 4

export interface StepContentProps {
    data: HaulRequest
    update: (patch: Partial<HaulRequest>) => void
}

export interface RegistrationStep {
    id: string
    title: string
    subtitle: string
    image: string
    Content: React.FC<StepContentProps>
    isVisible?: (data: HaulRequest) => boolean
    isValid?: (data: HaulRequest) => boolean
}

interface CounterProps {
    label: string
    description?: string
    value: number
    minValue: number
    maxValue: number
    onChange: (value: number) => void
}

const Counter: React.FC<CounterProps> = ({ label, description, value, minValue, maxValue, onChange }) => (
    <NumberField
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        onChange={(next) => !Number.isNaN(next) && onChange(next)}
        variant="primary"
        className="w-40"
    >
        <Label>{label}</Label>
        <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
        </NumberField.Group>
        {description && <Description>{description}</Description>}
    </NumberField>
)

const HouseholdStep: React.FC<StepContentProps> = ({ data, update }) => {
    const { household } = data

    const setAdults = (adults: number) =>
        update({
            household: { ...household, adults },
            servings_per_meal: adults + household.children.length,
        })

    const setChildCount = (count: number) =>
        update({
            household: {
                ...household,
                children: Array.from(
                    { length: count },
                    (_, index) => household.children[index] ?? { age_years: DEFAULT_CHILD_AGE },
                ),
            },
            servings_per_meal: household.adults + count,
        })

    return (
        <>
            <Counter label="Antal vuxna" value={household.adults} minValue={1} maxValue={10} onChange={setAdults} />
            <Counter
                label="Antal barn"
                description="Under 18 år"
                value={household.children.length}
                minValue={0}
                maxValue={10}
                onChange={setChildCount}
            />
        </>
    )
}

const ChildrenStep: React.FC<StepContentProps> = ({ data, update }) => {
    const setAge = (childIndex: number, age_years: number) =>
        update({
            household: {
                ...data.household,
                children: data.household.children.map((child, index) =>
                    index === childIndex ? { ...child, age_years } : child,
                ),
            },
        })

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.household.children.map((child, index) => (
                <Counter
                    key={index}
                    label={`Barn ${index + 1}`}
                    description="Ålder i år"
                    value={child.age_years}
                    minValue={0}
                    maxValue={17}
                    onChange={(age) => setAge(index, age)}
                />
            ))}
        </div>
    )
}

const ServingsStep: React.FC<StepContentProps> = ({ data, update }) => {
    const recommended = data.household.adults + data.household.children.length

    return (
        <ChoiceTiles
            label="Portioner per middag"
            description={`Förslag för ert hushåll: ${recommended}. Välj fler om ni vill ha matlådor.`}
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((value) => ({
                value,
                label: String(value),
                caption: value === 1 ? "portion" : "portioner",
            }))}
            value={data.servings_per_meal}
            onChange={(servings_per_meal) => update({ servings_per_meal })}
        />
    )
}

const MealsStep: React.FC<StepContentProps> = ({ data, update }) => (
    <ChoiceTiles
        label="Antal middagar"
        options={[2, 3, 4, 5, 6, 7].map((value) => ({ value, label: String(value), caption: "middagar" }))}
        value={data.meal_count}
        onChange={(meal_count) => update({ meal_count })}
    />
)

const TimeStep: React.FC<StepContentProps> = ({ data, update }) => (
    <ChoiceTiles
        label="Max tid per middag"
        options={[20, 30, 45, 60].map((value) => ({ value, label: String(value), caption: "minuter" }))}
        value={data.max_cooking_minutes}
        onChange={(max_cooking_minutes) => update({ max_cooking_minutes })}
    />
)

const proteinOptions: MultiChoiceOption<Protein>[] = [
    { value: Protein.Chicken, label: "Kyckling" },
    { value: Protein.Beef, label: "Nötkött" },
    { value: Protein.Pork, label: "Fläsk" },
    { value: Protein.Lamb, label: "Lamm" },
    { value: Protein.Fish, label: "Fisk" },
    { value: Protein.Seafood, label: "Skaldjur" },
    { value: Protein.Vegetarian, label: "Vegetariskt", caption: "Ägg, ost, bönor" },
    { value: Protein.Vegan, label: "Veganskt", caption: "Tofu, linser, vego" },
]

const cuisineOptions: MultiChoiceOption<Cuisine>[] = [
    { value: Cuisine.Swedish, label: "Svenskt" },
    { value: Cuisine.Italian, label: "Italienskt" },
    { value: Cuisine.French, label: "Franskt" },
    { value: Cuisine.Spanish, label: "Spanskt" },
    { value: Cuisine.Greek, label: "Grekiskt" },
    { value: Cuisine.Turkish, label: "Turkiskt" },
    { value: Cuisine.Moroccan, label: "Marockanskt" },
    { value: Cuisine.Indian, label: "Indiskt" },
    { value: Cuisine.Chinese, label: "Kinesiskt" },
    { value: Cuisine.Thai, label: "Thailändskt" },
    { value: Cuisine.Japanese, label: "Japanskt" },
    { value: Cuisine.Korean, label: "Koreanskt" },
    { value: Cuisine.Vietnamese, label: "Vietnamesiskt" },
    { value: Cuisine.Mexican, label: "Mexikanskt" },
    { value: Cuisine.American, label: "Amerikanskt" },
    { value: Cuisine.LatinAmerican, label: "Latinamerikanskt" },
]

const ProteinStep: React.FC<StepContentProps> = ({ data, update }) => (
    <MultiChoiceTiles
        label="Protein"
        description="Välj allt ni äter. Det ni väljer bort använder vi inte i recepten."
        options={proteinOptions}
        value={data.protein_preferences}
        onChange={(protein_preferences) => update({ protein_preferences })}
    />
)

const CuisinesStep: React.FC<StepContentProps> = ({ data, update }) => (
    <MultiChoiceTiles
        label="Kök"
        description={
            data.cuisine_preferences.length === 0
                ? "Väljer ni inget blandar vi fritt mellan köken."
                : `${data.cuisine_preferences.length} valda`
        }
        options={cuisineOptions}
        value={data.cuisine_preferences}
        onChange={(cuisine_preferences) => update({ cuisine_preferences })}
        columns={3}
    />
)

export const registrationSteps: RegistrationStep[] = [
    {
        id: "household",
        title: "Hur många ska äta?",
        subtitle: "Berätta vilka som sitter vid bordet, så anpassar vi recepten.",
        image: householdImage,
        Content: HouseholdStep,
    },
    {
        id: "children",
        title: "Hur gamla är barnen?",
        subtitle: "Då kan vi ge tips på hur maten passar de minsta.",
        image: childrenImage,
        Content: ChildrenStep,
        isVisible: (data) => data.household.children.length > 0,
    },
    {
        id: "servings",
        title: "Hur många portioner per middag?",
        subtitle: "Räkna med extra portioner om ni vill ta med matlåda.",
        image: servingsImage,
        Content: ServingsStep,
    },
    {
        id: "meals",
        title: "Hur många middagar?",
        subtitle: "Vi planerar så många rätter av det ni har handlat.",
        image: mealsImage,
        Content: MealsStep,
    },
    {
        id: "time",
        title: "Hur mycket tid har ni?",
        subtitle: "Den längsta tid en middag får ta att laga en vanlig vardag.",
        image: timeImage,
        Content: TimeStep,
    },
    {
        id: "protein",
        title: "Vad äter ni för protein?",
        subtitle: "Vi bygger recepten kring det ni gillar och hoppar över resten.",
        image: proteinImage,
        Content: ProteinStep,
        isValid: (data) => data.protein_preferences.length > 0,
    },
    {
        id: "cuisines",
        title: "Vilka kök gillar ni?",
        subtitle: "Välj så många ni vill. Vi blandar mellan dem under veckan.",
        image: cuisinesImage,
        Content: CuisinesStep,
    },
]
