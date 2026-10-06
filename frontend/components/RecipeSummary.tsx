import { useTranslation } from "react-i18next";
import { PlockButton } from "../primitives/PlockButton"
import { PlockCheckCircle } from "../primitives/PlockCheckCircle"
import { PlockChip } from "../primitives/PlockChip"
import type { Recipe } from "../types/types";
import { useNavigate } from "react-router-dom";

interface RecipeSummaryProps {
    recipe: Recipe;
}

export const RecipeSummary: React.FC<RecipeSummaryProps> = ({
    recipe,
}) => {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const recipeIngredients = recipe.ingredients.filter((i)=>(i.from_receipt))
    const pantryIngredients = recipe.ingredients.filter((i)=>(!i.from_receipt))

    const onClick = () => {
        navigate("/recipes/"+recipe.id)
    }

    return (
        <div className="flex gap-4 justify-between p-8 font-sans rounded-xl bg-accent text-accent-foreground">
            <div className="flex flex-col">
                <div className="flex gap-3 items-center">
                    <PlockCheckCircle checked/>
                    <p className="text-accent-foreground/70">{t("recipeSummary.next_dish")}</p>
                </div>
                <h2 className="mt-4 text-4xl font-black">{recipe.title}</h2>
                <div className="flex flex-wrap gap-4 mt-6">
                    <PlockChip variant="recipeTag">{t("recipeSummary.cooking_time", {time: recipe.total_time_minutes})}</PlockChip>
                    <PlockChip variant="recipeTag" className="hidden sm:flex">{t("cuisines.options." + recipe.cuisine)}</PlockChip>
                    <PlockChip variant="recipeTag">{t("protein.options." + recipe.protein)}</PlockChip>
                    <PlockChip variant="recipeTag" className="hidden sm:flex">{t("difficulty." + recipe.difficulty)}</PlockChip>
                </div>
                <div className="flex-grow"/>
                <div className="flex gap-3 items-center">
                <PlockButton className="mt-8 w-full sm:w-auto" variant="citrus" size="xl" onClick={onClick}>{t("recipeSummary.start_cooking")}</PlockButton>
                </div>
            </div>
            <div className="hidden flex-col p-6 w-2/5 rounded-xl sm:flex bg-accent-foreground/10">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">{t("recipeSummary.from_bag")}</p>
                    <p>{t("recipeSummary.from_bag_ing", {bagcount: recipeIngredients.length, total: recipe.ingredients.length})}</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 max-w-full">
                    {recipeIngredients.map((i) => (
                            <PlockChip variant="haulIngredient">{i.name}</PlockChip>
                    ))}
                </div>
                <p className="mt-6">{t("recipeSummary.pantry")}</p>
                <div className="flex flex-wrap gap-3 mt-4 max-w-full">
                    {pantryIngredients.map((i) => (
                            <PlockChip variant="haulPantry">{i.name}</PlockChip>
                    ))}
                </div>
            </div>
        </div>
    )
}
