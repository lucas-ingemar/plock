import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import type { Haul } from "../types/types"
import { PlockChip } from "../primitives/PlockChip"
import { RecipeSummary } from "./RecipeSummary"
import { Receipt } from "./Receipt"
import { useTranslation } from "react-i18next"
import { RemainingRecipes } from "./RemainingRecipes"

interface HaulViewProps {
    haul: Haul,
}

export const HaulView: React.FC<HaulViewProps> = ({
    haul,
}) => {

    const { t, i18n } = useTranslation()

    const numberOfPeople = (adults: number, children: number):string => {
        if (adults > 0 && children > 0) {
            return t("haulView.guests.adults_and_children", {adults:adults, children: children})
        } else if (adults > 0) {
            return t("haulView.guests.only_adults", {adults:adults})
        } else {
            return t("haulView.guests.only_children", {children: children})
        }
    }

    return (
        <DefaultPageLayout className="flex gap-12">
            <div className="hidden flex-col h-full lg:flex">
                {haul.receipt &&
                    <Receipt receipt={haul.receipt}/>
                }
            </div>
            <div className="flex flex-col w-full">
                <p className="pb-1 text-muted">{`${haul.created_at.getDate().toString()} ${haul.created_at.toLocaleDateString(i18n.language, { month: "long" })}, ${haul.created_at.getFullYear()}`} </p>
                <div className="flex gap-4 justify-between items-center mb-8">
                    <h1 className="flex-grow font-sans text-5xl font-black text-foreground">{haul.title}</h1>
                    <PlockChip className="hidden xl:flex">{numberOfPeople(haul.adults, haul.children)}</PlockChip>
                    <PlockChip className="hidden xl:flex">{t("haulView.portions", {portions: haul.servings_per_meal})}</PlockChip>
                    <PlockChip className="hidden xl:flex">{t("haulView.max_cooking_minutes", {max_cooking_minutes: haul.max_cooking_minutes})}</PlockChip>
                </div>
                {haul.recipes && haul.recipes?.length > 0 ?
                    <div className="flex flex-col gap-8">
                        <RecipeSummary recipe={haul.recipes[0]}/>
                        <RemainingRecipes recipes={haul.recipes.slice(1)}/>
                    </div>
                 :
                    <p className="mt-24 w-full text-2xl text-center">{t("haulView.no_registered_recipes")}</p>
                }
            </div>
        </DefaultPageLayout>
    )}
