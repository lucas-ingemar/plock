import { useTranslation } from "react-i18next";
import type { Recipe } from "../types/types";
import { RecipeSummaryCard } from "./RecipeSummaryCard";

interface RemainingRecipesProps {
    recipes: Recipe[];
}

export const RemainingRecipes: React.FC<RemainingRecipesProps> = ({
    recipes,
}) => {

    const { t, i18n } = useTranslation()

    return (
        <div className="">
            <h2 className="text-2xl font-bold">Resten av veckan</h2>
            <div className="mt-6 divide-y-2 divide-border border-y-2 border-border">
            {recipes.map((r) => (
                <RecipeSummaryCard key={r.id} recipe={r}/>
            ))}
            </div>
        </div>
    )
}
