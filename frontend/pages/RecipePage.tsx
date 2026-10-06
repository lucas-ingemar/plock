import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Recipe } from "../types/types";
import { useApi } from "../api/ApiContext";

export const RecipePage: React.FC = () => {
    const [recipe, setRecipe] = useState<Recipe|undefined>()
    const api = useApi();
    const params = useParams();

    useEffect(() => {
        api.getRecipe(params.recipeID as string).then(setRecipe)
    }, [api])


    return (
        <DefaultPageLayout className="self-center max-w-screen-2xl">
            {recipe?.title}
        </DefaultPageLayout>
    )
}
