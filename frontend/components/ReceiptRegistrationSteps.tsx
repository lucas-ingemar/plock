import { Description, Label, NumberField } from "@heroui/react"
import { useTranslation } from "react-i18next";
import householdImage from "@/assets/receipt-registration/step-household.svg"
import servingsImage from "@/assets/receipt-registration/step-servings.svg"
import mealsImage from "@/assets/receipt-registration/step-meals.svg"
import timeImage from "@/assets/receipt-registration/step-time.svg"
import proteinImage from "@/assets/receipt-registration/step-protein.svg"
import cuisinesImage from "@/assets/receipt-registration/step-cuisines.svg"
import { ChoiceTiles } from "./ChoiceTiles"
import { type MultiChoiceOption, MultiChoiceTiles } from "./MultiChoiceTiles"
import {
    Cuisine,
    type HaulRequest,
    Protein,
} from "../types/types"
import { useMemo } from "react"

// const DEFAULT_CHILD_AGE = 4

export interface StepContentProps {
    data: HaulRequest
    update: (patch: Partial<HaulRequest>) => void
}

export interface RegistrationStep {
    id: string
    title?: string
    subtitle?: string
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
    const { t } = useTranslation()

    return (
        <>
            <Counter
                label={t("registerReceipt.steps.household.adultsLabel")}
                value={data.adults}
                minValue={1}
                maxValue={10}
                onChange={(adults) => update({ adults, servings_per_meal: adults + data.children })}
            />
            <Counter
                label={t("registerReceipt.steps.household.childrenLabel")}
                description={t("registerReceipt.steps.household.childrenDescLabel")}
                value={data.children}
                minValue={0}
                maxValue={10}
                onChange={(children) => update({ children, servings_per_meal: data.adults + children })}
            />
        </>
    )
}

// const ChildrenStep: React.FC<StepContentProps> = ({ data, update }) => {
//     const setAge = (childIndex: number, age_years: number) =>
//         update({
//             household: {
//                 ...data.household,
//                 children: data.household.children.map((child, index) =>
//                     index === childIndex ? { ...child, age_years } : child,
//                 ),
//             },
//         })

//     return (
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//             {data.household.children.map((child, index) => (
//                 <Counter
//                     key={index}
//                     label={`Barn ${index + 1}`}
//                     description="Ålder i år"
//                     value={child.age_years}
//                     minValue={0}
//                     maxValue={17}
//                     onChange={(age) => setAge(index, age)}
//                 />
//             ))}
//         </div>
//     )
// }

const ServingsStep: React.FC<StepContentProps> = ({ data, update }) => {
    const recommended = data.adults + data.children

    const { t } = useTranslation();

    return (
        <ChoiceTiles
            label={t("registerReceipt.steps.servings.choiceLabel")}
            description={t("registerReceipt.steps.servings.choiceDesc", {recommended: recommended})}
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((value) => ({
                value,
                label: String(value),
                caption: value === 1 ? t("registerReceipt.steps.servings.portion") : t("registerReceipt.steps.servings.portions"),
            }))}
            value={data.servings_per_meal}
            onChange={(servings_per_meal) => update({ servings_per_meal })}
        />
    )
}

const MealsStep: React.FC<StepContentProps> = ({ data, update }) => {
    const { t } = useTranslation();
    return (
        <ChoiceTiles
            label={t("registerReceipt.steps.meals.choiceLabel")}
            options={[2, 3, 4, 5, 6, 7].map((value) => ({ value, label: String(value), caption: t("registerReceipt.steps.meals.dinners") }))}
            value={data.meal_count}
            onChange={(meal_count) => update({ meal_count })}
        />
    )
}

const TimeStep: React.FC<StepContentProps> = ({ data, update }) => {
    const { t } = useTranslation();
    return (
        <ChoiceTiles
            label={t("registerReceipt.steps.time.choiceLabel")}
            options={[20, 30, 45, 60].map((value) => ({ value, label: String(value), caption: t("registerReceipt.steps.time.minutes") }))}
            value={data.max_cooking_minutes}
            onChange={(max_cooking_minutes) => update({ max_cooking_minutes })}
        />
    )
}


const P = "registerReceipt.steps.protein"
const C = "registerReceipt.steps.cuisines"

const Pp = "protein"
const Cc = "cuisines"

const proteinOptions = [
    { value: Protein.Chicken, labelKey: `${Pp}.options.chicken` },
    { value: Protein.Beef, labelKey: `${Pp}.options.beef` },
    { value: Protein.Pork, labelKey: `${Pp}.options.pork` },
    { value: Protein.Lamb, labelKey: `${Pp}.options.lamb` },
    { value: Protein.Fish, labelKey: `${Pp}.options.fish` },
    { value: Protein.Seafood, labelKey: `${Pp}.options.seafood` },
    { value: Protein.Vegetarian, labelKey: `${Pp}.options.vegetarian`, captionKey: `${P}.options.vegetarianCaption` },
    { value: Protein.Vegan, labelKey: `${Pp}.options.vegan`, captionKey: `${P}.options.veganCaption` },
] as const

const cuisineOptions = [
    { value: Cuisine.Swedish, labelKey: `${Cc}.options.swedish` },
    { value: Cuisine.Italian, labelKey: `${Cc}.options.italian` },
    { value: Cuisine.French, labelKey: `${Cc}.options.french` },
    { value: Cuisine.Spanish, labelKey: `${Cc}.options.spanish` },
    { value: Cuisine.Greek, labelKey: `${Cc}.options.greek` },
    { value: Cuisine.Turkish, labelKey: `${Cc}.options.turkish` },
    { value: Cuisine.Moroccan, labelKey: `${Cc}.options.moroccan` },
    { value: Cuisine.Indian, labelKey: `${Cc}.options.indian` },
    { value: Cuisine.Chinese, labelKey: `${Cc}.options.chinese` },
    { value: Cuisine.Thai, labelKey: `${Cc}.options.thai` },
    { value: Cuisine.Japanese, labelKey: `${Cc}.options.japanese` },
    { value: Cuisine.Korean, labelKey: `${Cc}.options.korean` },
    { value: Cuisine.Vietnamese, labelKey: `${Cc}.options.vietnamese` },
    { value: Cuisine.Mexican, labelKey: `${Cc}.options.mexican` },
    { value: Cuisine.American, labelKey: `${Cc}.options.american` },
    { value: Cuisine.LatinAmerican, labelKey: `${Cc}.options.latinAmerican` },
] as const

const ProteinStep: React.FC<StepContentProps> = ({ data, update }) => {
    const { t } = useTranslation()

    const options: MultiChoiceOption<Protein>[] = useMemo(
        () =>
            proteinOptions.map((o) => ({
                value: o.value,
                label: t(o.labelKey),
                caption: "captionKey" in o ? t(o.captionKey) : undefined,
            })),
        [t]
    )

    return (
        <MultiChoiceTiles
            label={t(`${P}.choiceLabel`)}
            description={t(`${P}.choiceDesc`)}
            options={options}
            value={data.protein_preferences}
            onChange={(protein_preferences) => update({ protein_preferences })}
        />
    )
}

const CuisinesStep: React.FC<StepContentProps> = ({ data, update }) => {
    const { t } = useTranslation()

    const options: MultiChoiceOption<Cuisine>[] = useMemo(
        () =>
            cuisineOptions.map((o) => ({
                value: o.value,
                label: t(o.labelKey),
            })),
        [t]
    )

    const count = data.cuisine_preferences.length

    return (
        <MultiChoiceTiles
            label={t(`${C}.choiceLabel`)}
            description={
                count === 0
                    ? t(`${C}.choiceDescNone`)
                    : t(`${C}.selected`, { count })
            }
            options={options}
            value={data.cuisine_preferences}
            onChange={(cuisine_preferences) => update({ cuisine_preferences })}
            columns={3}
        />
    )
}

export const registrationSteps: RegistrationStep[] = [
    {
        id: "household",
        image: householdImage,
        Content: HouseholdStep,
    },
    // {
    //     id: "children",
    //     image: childrenImage,
    //     Content: ChildrenStep,
    //     isVisible: (data) => data.household.children.length > 0,
    // },
    {
        id: "servings",
        image: servingsImage,
        Content: ServingsStep,
    },
    {
        id: "meals",
        image: mealsImage,
        Content: MealsStep,
    },
    {
        id: "time",
        image: timeImage,
        Content: TimeStep,
    },
    {
        id: "protein",
        image: proteinImage,
        Content: ProteinStep,
        isValid: (data) => data.protein_preferences.length > 0,
    },
    {
        id: "cuisines",
        image: cuisinesImage,
        Content: CuisinesStep,
    },
]
