import { Description, Label, NumberField, TextArea, TextField } from "@heroui/react"
import { DropZone, FileTrigger } from "react-aria-components"
import { PlockButton } from "../primitives/PlockButton"
import householdImage from "@/assets/receipt-registration/step-household.svg"
import childrenImage from "@/assets/receipt-registration/step-children.svg"
import servingsImage from "@/assets/receipt-registration/step-servings.svg"
import mealsImage from "@/assets/receipt-registration/step-meals.svg"
import timeImage from "@/assets/receipt-registration/step-time.svg"
import proteinImage from "@/assets/receipt-registration/step-protein.svg"
import cuisinesImage from "@/assets/receipt-registration/step-cuisines.svg"
import receiptImage from "@/assets/receipt-registration/step-receipt.svg"
import { ChoiceTiles } from "./ChoiceTiles"
import { type MultiChoiceOption, MultiChoiceTiles } from "./MultiChoiceTiles"
import { type Cuisine, DEFAULT_CHILD_AGE, type Protein, type RegistrationData, recommendedServings } from "../types"

export interface StepContentProps {
    data: RegistrationData
    update: (patch: Partial<RegistrationData>) => void
}

export interface RegistrationStep {
    id: string
    title: string
    subtitle: string
    image: string
    Content: React.FC<StepContentProps>
    isVisible?: (data: RegistrationData) => boolean
    isValid?: (data: RegistrationData) => boolean
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
    const setChildCount = (count: number) =>
        update({
            children: Array.from(
                { length: count },
                (_, index) => data.children[index] ?? { ageYears: DEFAULT_CHILD_AGE },
            ),
        })

    return (
        <>
            <Counter
                label="Antal vuxna"
                value={data.adults}
                minValue={1}
                maxValue={10}
                onChange={(adults) => update({ adults })}
            />
            <Counter
                label="Antal barn"
                description="Under 18 år"
                value={data.children.length}
                minValue={0}
                maxValue={10}
                onChange={setChildCount}
            />
        </>
    )
}

const ChildrenStep: React.FC<StepContentProps> = ({ data, update }) => {
    const setAge = (childIndex: number, ageYears: number) =>
        update({
            children: data.children.map((child, index) =>
                index === childIndex ? { ...child, ageYears } : child,
            ),
        })

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.children.map((child, index) => (
                <Counter
                    key={index}
                    label={`Barn ${index + 1}`}
                    description="Ålder i år"
                    value={child.ageYears}
                    minValue={0}
                    maxValue={17}
                    onChange={(age) => setAge(index, age)}
                />
            ))}
        </div>
    )
}

const ServingsStep: React.FC<StepContentProps> = ({ data, update }) => {
    const recommended = recommendedServings(data)

    return (
        <ChoiceTiles
            label="Portioner per middag"
            description={`Förslag för ert hushåll: ${recommended}. Välj fler om ni vill ha matlådor.`}
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((value) => ({
                value,
                label: String(value),
                caption: value === 1 ? "portion" : "portioner",
            }))}
            value={data.servingsPerMeal ?? recommended}
            onChange={(servingsPerMeal) => update({ servingsPerMeal })}
        />
    )
}

const MealsStep: React.FC<StepContentProps> = ({ data, update }) => (
    <ChoiceTiles
        label="Antal middagar"
        options={[2, 3, 4, 5, 6, 7].map((value) => ({ value, label: String(value), caption: "middagar" }))}
        value={data.mealCount}
        onChange={(mealCount) => update({ mealCount })}
    />
)

const TimeStep: React.FC<StepContentProps> = ({ data, update }) => (
    <ChoiceTiles
        label="Max tid per middag"
        options={[20, 30, 45, 60].map((value) => ({ value, label: String(value), caption: "minuter" }))}
        value={data.maxCookingMinutes}
        onChange={(maxCookingMinutes) => update({ maxCookingMinutes })}
    />
)

const proteinOptions: MultiChoiceOption<Protein>[] = [
    { value: "chicken", label: "Kyckling" },
    { value: "beef", label: "Nötkött" },
    { value: "pork", label: "Fläsk" },
    { value: "lamb", label: "Lamm" },
    { value: "fish", label: "Fisk" },
    { value: "seafood", label: "Skaldjur" },
    { value: "vegetarian", label: "Vegetariskt", caption: "Ägg, ost, bönor" },
    { value: "vegan", label: "Veganskt", caption: "Tofu, linser, vego" },
]

const cuisineOptions: MultiChoiceOption<Cuisine>[] = [
    { value: "swedish", label: "Svenskt" },
    { value: "italian", label: "Italienskt" },
    { value: "french", label: "Franskt" },
    { value: "spanish", label: "Spanskt" },
    { value: "greek", label: "Grekiskt" },
    { value: "turkish", label: "Turkiskt" },
    { value: "moroccan", label: "Marockanskt" },
    { value: "indian", label: "Indiskt" },
    { value: "chinese", label: "Kinesiskt" },
    { value: "thai", label: "Thailändskt" },
    { value: "japanese", label: "Japanskt" },
    { value: "korean", label: "Koreanskt" },
    { value: "vietnamese", label: "Vietnamesiskt" },
    { value: "mexican", label: "Mexikanskt" },
    { value: "american", label: "Amerikanskt" },
    { value: "latin_american", label: "Latinamerikanskt" },
]

const ProteinStep: React.FC<StepContentProps> = ({ data, update }) => (
    <MultiChoiceTiles
        label="Protein"
        description="Välj allt ni äter. Det ni väljer bort använder vi inte, även om det finns på kvittot."
        options={proteinOptions}
        value={data.proteins}
        onChange={(proteins) => update({ proteins })}
    />
)

const CuisinesStep: React.FC<StepContentProps> = ({ data, update }) => (
    <MultiChoiceTiles
        label="Kök"
        description={
            data.cuisines.length === 0
                ? "Väljer ni inget blandar vi fritt mellan köken."
                : `${data.cuisines.length} valda`
        }
        options={cuisineOptions}
        value={data.cuisines}
        onChange={(cuisines) => update({ cuisines })}
        columns={3}
    />
)

const ReceiptStep: React.FC<StepContentProps> = ({ data, update }) => (
    <div className="flex flex-col gap-6 w-full max-w-md">
        <DropZone
            onDrop={async (event) => {
                const item = event.items.find((dropItem) => dropItem.kind === "file")
                if (item?.kind === "file") {
                    update({ receiptFile: await item.getFile() })
                }
            }}
            className="flex flex-col gap-4 items-center p-8 text-center rounded-2xl border-2 border-dashed transition-colors border-border bg-surface data-drop-target:border-accent data-drop-target:bg-surface-secondary"
        >
            {data.receiptFile ? (
                <>
                    <p className="font-semibold break-all">{data.receiptFile.name}</p>
                    <PlockButton variant="ghost" size="sm" onPress={() => update({ receiptFile: null })}>
                        Ta bort
                    </PlockButton>
                </>
            ) : (
                <>
                    <p className="text-muted">Dra in en bild eller PDF av kvittot hit</p>
                    <FileTrigger
                        acceptedFileTypes={["image/*", "application/pdf"]}
                        onSelect={(files) => {
                            const file = files?.[0]
                            if (file) {
                                update({ receiptFile: file })
                            }
                        }}
                    >
                        <PlockButton variant="primary">Välj fil</PlockButton>
                    </FileTrigger>
                </>
            )}
        </DropZone>
        <TextField value={data.receiptText} onChange={(receiptText) => update({ receiptText })}>
            <Label>Eller klistra in kvittot som text</Label>
            <TextArea rows={5} placeholder="Från orderbekräftelsen eller appen" />
        </TextField>
    </div>
)

export const registrationSteps: RegistrationStep[] = [
    {
        id: "household",
        title: "Hur många ska äta?",
        subtitle: "Berätta vilka som sitter vid bordet, så anpassar vi recepten.",
        image: householdImage,
        Content: HouseholdStep,
    },
    // {
    //     id: "children",
    //     title: "Hur gamla är barnen?",
    //     subtitle: "Då kan vi ge tips på hur maten passar de minsta.",
    //     image: childrenImage,
    //     Content: ChildrenStep,
    //     isVisible: (data) => data.children.length > 0,
    // },
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
        isValid: (data) => data.proteins.length > 0,
    },
    {
        id: "cuisines",
        title: "Vilka kök gillar ni?",
        subtitle: "Välj så många ni vill. Vi blandar mellan dem under veckan.",
        image: cuisinesImage,
        Content: CuisinesStep,
    },
    // {
    //     id: "receipt",
    //     title: "Lägg till kvittot",
    //     subtitle: "Ladda upp en bild eller PDF, eller klistra in texten från en näthandel.",
    //     image: receiptImage,
    //     Content: ReceiptStep,
    //     isValid: (data) => data.receiptFile !== null || data.receiptText.trim().length > 20,
    // },
]
