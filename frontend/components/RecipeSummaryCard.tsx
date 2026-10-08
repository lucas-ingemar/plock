import { useTranslation } from "react-i18next";
import type { Recipe } from "../types/types";
import { ChevronRight, Circle, CircleCheck } from "lucide-react";
import { PlockChip } from "../primitives/PlockChip";
import { useNavigate } from "react-router-dom";

interface RecipeSummaryCardProps {
    recipe: Recipe;
}

export const RecipeSummaryCard: React.FC<RecipeSummaryCardProps> = ({
    recipe,
}) => {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const recipeIngredients = recipe.ingredients.filter((i)=>(i.from_receipt))

    const onClick = () => {
        navigate("/recipes/"+recipe.id)
    }

    return (
        <div className="flex items-center py-4 px-2 cursor-pointer select-none hover:bg-border" onClick={onClick}>
            {Object.keys(recipe.reviews).length !== 0 ?
                <CircleCheck className="text-citrus" size={24}/>
                :
                <Circle className="text-muted" size={24}/>
            }
            <div className="flex-grow mr-2 ml-8">
                <p className="text-lg font-bold">{recipe.title}</p>
                <p className="text-muted">{t("cuisines.options." + recipe.cuisine)}, {t("recipeSummary.cooking_time", {time: recipe.total_time_minutes})}, {t("difficulty." + recipe.difficulty)}</p>
            </div>
            <PlockChip variant="recipeSummary">{t("recipeSummary.from_receipt", {count: recipeIngredients.length})}</PlockChip>
            <ChevronRight className="ml-4 text-muted"/>
        </div>
    )
}
