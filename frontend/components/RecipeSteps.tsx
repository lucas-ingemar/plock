import { useTranslation } from "react-i18next";
import type { Recipe } from "../types/types";
import { cn } from "@heroui/react";
import { Baby } from "lucide-react";

interface RecipeStepsProps {
    recipe: Recipe;
    className?: string;
}

export const RecipeSteps: React.FC<RecipeStepsProps> = ({
    recipe,
    className="",
}) => {
    const { t } = useTranslation()

    return (
        <div className={cn("flex flex-col", className)}>
            <p className="text-3xl font-bold">{t("recipe.instructions")}</p>
            {recipe.kid_tips &&
                <div className="flex gap-4 items-center p-4 mt-6 rounded-lg bg-citrus/20">
                    <Baby size={40} className="h-full min-w-8 text-citrus"/>
                    <p>
                        <b>För barnen: </b>
                        {recipe.kid_tips}
                    </p>
                </div>
            }
            <div className="mt-12 divide-y-2 divide-border">
            {recipe.steps.map((s, idx) => (
                <div className="flex gap-10 items-start py-6 px-2">
                    <p className="text-4xl font-bold text-citrus min-w-10">{idx+1}</p>
                    <p className="text-lg">{s.text}</p>
                </div>
            ))}
            </div>
        </div>
    )
}
