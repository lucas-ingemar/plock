import { useTranslation } from "react-i18next";
import { PlockChip } from "../primitives/PlockChip"
import type { Recipe } from "../types/types";
import defaultImage from "@/assets/recipes/default-recipe.svg"
import { useState } from "react";
import Rating from "./Rating";

interface RecipeHeaderProps {
    recipe: Recipe;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
    recipe,
}) => {
    const [imgFailed, setImgFailed] = useState(false)

    const { t } = useTranslation()

    const imgUrl = () => {
        return `/img/recipes/${recipe.id}.jpg`
        return "https://assets.icanet.se/t_ICAseAbsoluteUrl/wwv2yb6wu8ckdewmzltt.jpg"
    }


    return (
        <div className="flex gap-8 justify-between items-center p-12 py-14 font-sans rounded-xl bg-accent text-accent-foreground">
            <div className="flex flex-col">
                <h1 className="text-3xl font-black md:text-6xl">{recipe.title}</h1>
                <p className="mt-6 text-lg text-accent-foreground/70">{recipe.description}</p>
                <div className="flex flex-wrap gap-4 mt-6">
                    <PlockChip variant="recipeTag">{t("recipeSummary.cooking_time", {time: recipe.total_time_minutes})}</PlockChip>
                    <PlockChip variant="recipeTag" className="hidden sm:flex">{t("cuisines.options." + recipe.cuisine)}</PlockChip>
                    <PlockChip variant="recipeTag">{t("protein.options." + recipe.protein)}</PlockChip>
                    <PlockChip variant="recipeTag" className="hidden sm:flex">{t("difficulty." + recipe.difficulty)}</PlockChip>
                </div>
                <Rating className="mt-6" size={30} allowHalf value={3.7} readOnly/>
            </div>

            <div className="hidden flex-col w-2/5 rounded-xl lg:flex">
                <img
                    src={imgFailed || !imgUrl() ? defaultImage : imgUrl()}
                    onError={() => setImgFailed(true)}
                    className="max-w-full min-h-0 max-h-full rounded-2xl"
                    alt=""
                />
            </div>
        </div>
    )
}
