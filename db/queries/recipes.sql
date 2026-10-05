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
