-- name: AddRecipe :exec
INSERT INTO recipes (
    id,
    haul_id,
    haul_idx,
    cuisine,
    description,
    difficulty,
    kid_tips,
    protein,
    servings,
    title,
    total_time_minutes
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: AddRecipeIngredient :exec
INSERT INTO recipe_ingredients (
    id,
    recipe_id,
    idx,
    from_receipt,
    name,
    note,
    quantity,
    unit
) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- name: AddRecipeStep :exec
INSERT INTO recipe_steps (
    id,
    recipe_id,
    idx,
    text,
    timer_minutes
) VALUES (?, ?, ?, ?, ?);

-- name: GetRecipeSummaries :many
SELECT id, title from recipes WHERE haul_id = ? ORDER by haul_idx ASC;

-- name: ListRecipesFromHaulID :many
SELECT * FROM recipes WHERE haul_id = ? ORDER BY haul_idx ASC;

-- name: ListRecipeIngredientsFromRecipeID :many
SELECT * FROM recipe_ingredients WHERE recipe_id= ? ORDER BY idx ASC;

-- name: ListRecipeStepsFromRecipeID :many
SELECT * FROM recipe_steps WHERE recipe_id= ? ORDER BY idx ASC;
