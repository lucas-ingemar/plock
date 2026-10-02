-- name: CreateHaul :one
INSERT INTO hauls (
    id,
    status,
    adults,
    children,
    servings_per_meal,
    meal_count,
    max_cooking_minutes
) VALUES (
    ?, "draft", ?, ?, ?, ?, ?
)
RETURNING *;

-- name: AddHaulProtein :exec
INSERT INTO haul_proteins (haul_id, protein)
VALUES (?, ?)
ON CONFLICT DO NOTHING;

-- name: AddHaulCuisine :exec
INSERT INTO haul_cuisines (haul_id, cuisine)
VALUES (?, ?)
ON CONFLICT DO NOTHING;

-- name: ListHauls :many
SELECT * from hauls ORDER by created_at DESC;
