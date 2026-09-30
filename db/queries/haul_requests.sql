-- name: CreateHaulRequest :one
INSERT INTO haul_requests (
    id,
    adults,
    children,
    servings_per_meal,
    meal_count,
    max_cooking_minutes
) VALUES (
    ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: AddHaulRequestProtein :exec
INSERT INTO haul_request_proteins (haul_request_id, protein)
VALUES (?, ?)
ON CONFLICT DO NOTHING;

-- name: AddHaulRequestCuisine :exec
INSERT INTO haul_request_cuisines (haul_request_id, cuisine)
VALUES (?, ?)
ON CONFLICT DO NOTHING;
