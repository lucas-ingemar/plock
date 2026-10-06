import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Recipe } from "../types/types";
import { useApi } from "../api/ApiContext";
import { ErrorState } from "../components/ErrorState";
import { RecipeHeader } from "../components/RecipeHeader";
import { RecipeIngredients } from "../components/RecipeIngredients";

export const RecipePage: React.FC = () => {
    const [recipe, setRecipe] = useState<Recipe|undefined>()
    const [error, setError] = useState(false)
    const api = useApi();
    const params = useParams();

    useEffect(() => {
        api.getRecipe(params.recipeID as string).then(setRecipe).catch((_) => {
            setError(true)
        })
    }, [api])

    const content = () => {
        if (error) {
            return <ErrorState/>
        }

        if (recipe) {
            return (
                <>
                   <RecipeHeader recipe={recipe}/>
                    <div className="flex flex-col gap-8 mt-6 lg:flex-row">
                        <RecipeIngredients className="w-full lg:w-1/3" recipe={recipe}/>
                    </div>
                </>
            )
        }

        return <></>
    }

    return (
        <DefaultPageLayout className="self-center max-w-screen-2xl">
            {content()}
        </DefaultPageLayout>
    )
}
