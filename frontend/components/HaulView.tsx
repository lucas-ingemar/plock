import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import type { Haul, Recipe } from "../types/types"
import { PlockChip } from "../primitives/PlockChip"
import { RecipeSummary } from "./RecipeSummary"
import { Receipt } from "./Receipt"
import { useTranslation } from "react-i18next"
import { RemainingRecipes } from "./RemainingRecipes"
import { useEffect, useState } from "react"

interface HaulViewProps {
    haul: Haul,
}

export const HaulView: React.FC<HaulViewProps> = ({
    haul,
}) => {
    const [otherRecipes, setOtherRecipes] = useState<Recipe[]>([])
    const [nextRecipe, setNextRecipe] = useState<Recipe | undefined>()

    const { t, i18n } = useTranslation()

    useEffect(() => {
        const recipesDone = haul.recipes?.filter((r) => (Object.keys(r.reviews).length !== 0))
        const recipesLeft = haul.recipes?.filter((r) => (Object.keys(r.reviews).length === 0))

        var r: Recipe[] = []

        if (recipesLeft && recipesLeft.length > 0) {
            setNextRecipe(recipesLeft[0])
            if (recipesLeft.length > 1) {
                r.push(...recipesLeft.slice(1))
            }
        }

        if (recipesDone) {
            r.push(...recipesDone)
        }

        setOtherRecipes(r)
    }, [haul.recipes])


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
                {(nextRecipe || otherRecipes.length > 0)  ?
                    <div className="flex flex-col gap-8">
                        {nextRecipe ?
                            <RecipeSummary recipe={nextRecipe}/>
                            :
                            <p>fixa sen</p>
                        }
                        {otherRecipes.length > 0 &&
                            <RemainingRecipes recipes={otherRecipes}/>
                        }
                    </div>
                 :
                    <p className="mt-24 w-full text-2xl text-center">{t("haulView.no_registered_recipes")}</p>
                }
            </div>
        </DefaultPageLayout>
    )}
