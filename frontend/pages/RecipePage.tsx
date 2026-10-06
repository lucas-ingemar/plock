import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Recipe } from "../types/types";
import { useApi } from "../api/ApiContext";
import { ErrorState } from "../components/ErrorState";

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
                    {recipe.title}
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
