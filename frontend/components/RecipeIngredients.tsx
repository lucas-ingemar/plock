import { Button, cn } from "@heroui/react";
import type { Recipe } from "../types/types";
import { useTranslation } from "react-i18next";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PlockCheckCircle } from "../primitives/PlockCheckCircle";
import { useFormatAmount } from "../hooks/useFormatAmount";

interface RecipeIngredientsProps {
    recipe: Recipe;
    className?: string;
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
    recipe,
    className="",
}) => {
    const [servings, setServings] = useState(recipe.servings)
    const [servingScale, setServingScale] = useState(1)

    const { t } = useTranslation()
    const formatAmount = useFormatAmount()

    const adjustServings = (m: number) => {
        let n = servings + m
        if (n <= 1) {
            n = 1
        }
        setServings(n)
    }

    useEffect(() => {
        setServingScale(servings/recipe.servings)
    }, [servings])

    return (
        <div className={cn("bg-surface p-8 rounded-xl", className)}>
            <div className="flex justify-between">
                <div className="flex flex-col justify-between">
                    <p className="text-xl font-semibold">{t("recipe.ingredients")}</p>
                    <div className="flex flex-col sm:flex-row sm:gap-8 sm:justify-between">
                        <div className="flex gap-1 items-center">
                            <PlockCheckCircle checked/>
                            <p className="text-sm text-muted">{t("recipe.from_receipt")}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                            <PlockCheckCircle />
                            <p className="text-sm text-muted">{t("recipe.staple_product")}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <div className="flex gap-4 items-center">
                    <Button variant="outline" onClick={()=>{adjustServings(-1)}}><Minus/></Button>
                        <p className="text-xl font-medium">{servings}</p>
                        <Button variant="outline" onClick={()=>{adjustServings(1)}}><Plus/></Button>
                    </div>
                    <p className="text-muted">{t("recipe.servings")}</p>
                </div>
            </div>
            <div className="mt-6 divide-border divide-y-1">
            {recipe.ingredients.map((i) => (
                <div className="flex gap-4 items-center py-3">
                    <PlockCheckCircle checked={i.from_receipt}/>
                    <div className="flex flex-col flex-grow">
                        <p className="capitalize">{i.name}</p>
                        {i.note &&
                            <p className="text-sm text-muted">{i.note}</p>
                        }
                    </div>
                    <p className="font-semibold">{i.quantity == undefined ? "-" : formatAmount(servingScale * i.quantity, i.unit)}</p>
                </div>
            ))}
            </div>
        </div>
    )
}
