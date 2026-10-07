import { useTranslation } from "react-i18next";
import type { Recipe, RecipeReview as RecipeReviewType } from "../types/types";
import { RatingButtonGroup } from "./RatingButtonGroup";
import { Button, cn, Description, Input, TextField } from "@heroui/react";
import { Camera, Check } from "lucide-react";
import { PlockButton } from "../primitives/PlockButton";
import { useApi } from "../api/ApiContext";
import { useState } from "react";

interface RecipeReviewProps {
    recipe: Recipe;
    className?: string;
}

export const RecipeReview: React.FC<RecipeReviewProps> = ({
    recipe,
    className="",
}) => {
    const [review, setReview] = useState<RecipeReviewType>({ rating: 2 });

    const { t } = useTranslation()
    const api = useApi()

    const updateField = <K extends keyof RecipeReviewType>(
        field: K,
        value: RecipeReviewType[K]
    ) => {
        setReview((prev) => ({ ...prev, [field]: value }));
    };

    const onSubmit = () => {
        if (!recipe.id) {
            return
        }
        api.addRecipeReview(recipe.id, review)
    }

    return (
        <div className={cn("p-8 rounded-xl bg-surface", className)}>
            <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                    <p className="font-medium uppercase text-muted">{t("recipe_review.title")}</p>
                    <p className="text-3xl font-black">{t("recipe_review.subtitle")}</p>
                </div>
            </div>
            <RatingButtonGroup onChange={(r) => {updateField("rating", r)}} className="mt-6"/>
            {recipe.kid_tips &&
                <>
                    <p className="mt-10 text-lg font-bold">{t("recipe_review.children_rating")}</p>
                    <RatingButtonGroup variant="children" onChange={(r) => {updateField("children_rating", r)}} className="mt-4"/>
                </>
            }
            <div className="flex flex-col gap-6 mt-10 sm:flex-row">
                <div className="w-full sm:w-2/3">
                    <p className="mb-2 h-6 text-lg font-bold">{t("recipe_review.notes")}</p>
                    <TextField className={"h-13"} onChange={(s) => {updateField("notes", s)}}>
                        <Input placeholder={t("recipe_review.notes_placeholder")} variant="secondary" className={"rounded-lg border-1 border-border bg-background/70 p-3 text-base"}/>
                        <Description />
                    </TextField>
                </div>
                <div className="w-full sm:w-1/3">
                    <p className="mb-2 h-6 text-lg"><b>{t("recipe_review.image")}</b> ({t("recipe_review.optional")})</p>
                    <Button className="w-full text-lg rounded-lg border-dashed h-13 bg-background/70 border-1 border-border text-foreground/80">
                        <Camera/>
                        {t("recipe_review.add_image")}
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-4 items-center mt-10 sm:flex-row">
                <PlockButton onClick={onSubmit} size="xl" className="gap-4 w-full sm:w-auto sm:text-lg text-md">
                    <Check className="!size-6 text-citrus"/>
                    {t("recipe_review.save")}
                </PlockButton>
                <p className="text-sm text-muted">{t("recipe_review.save_info")}</p>
            </div>
        </div>
    )
}
