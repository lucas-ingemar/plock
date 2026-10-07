schema_base := "https://plock.dev/schemas"

generate-types: generate-types-ts generate-types-go bundle-prompt-schemas

generate-types-ts:
    #!/usr/bin/env bash
    set -euo pipefail
    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT
    for file in schemas/*.schema.json; do
        jq 'del(."$id")' "$file" > "$tmp/$(basename "$file")"
    done
    quicktype -s schema -l ts -o frontend/types/types.ts "$tmp"/*.schema.json

generate-types-go:
    mkdir -p pkg/types
    go-jsonschema -p types \
        --extra-imports \
        --tags json \
        --capitalization ID \
        --schema-root-type={{schema_base}}/protein.schema.json=Protein \
        --schema-root-type={{schema_base}}/cuisine.schema.json=Cuisine \
        --schema-root-type={{schema_base}}/cooking_minutes.schema.json=CookingMinutes \
        --schema-root-type={{schema_base}}/unit.schema.json=Unit \
        --schema-root-type={{schema_base}}/item_category.schema.json=ItemCategory \
        --schema-root-type={{schema_base}}/difficulty.schema.json=Difficulty \
        --schema-root-type={{schema_base}}/generated_by.schema.json=GeneratedBy \
        --schema-root-type={{schema_base}}/receipt_item.schema.json=ReceiptItem \
        --schema-root-type={{schema_base}}/receipt.schema.json=Receipt \
        --schema-root-type={{schema_base}}/ingredient.schema.json=Ingredient \
        --schema-root-type={{schema_base}}/recipe_step.schema.json=RecipeStep \
        --schema-root-type={{schema_base}}/recipe.schema.json=Recipe \
        --schema-root-type={{schema_base}}/haul_request.schema.json=HaulRequest \
        --schema-root-type={{schema_base}}/haul.schema.json=Haul \
        --schema-root-type={{schema_base}}/haul_base.schema.json=HaulBase \
        --schema-root-type={{schema_base}}/status.schema.json=Status \
        --schema-root-type={{schema_base}}/haul_summary.schema.json=HaulSummary \
        --schema-root-type={{schema_base}}/recipe_summary.schema.json=RecipeSummary \
        --schema-root-type={{schema_base}}/haul_prompt.schema.json=HaulPrompt \
        --schema-root-type={{schema_base}}/haul_response.schema.json=HaulResponse \
        --schema-root-type={{schema_base}}/recipe_review.schema.json=RecipeReview \
        --schema-output={{schema_base}}/protein.schema.json=pkg/types/protein.go \
        --schema-output={{schema_base}}/cuisine.schema.json=pkg/types/cuisine.go \
        --schema-output={{schema_base}}/cooking_minutes.schema.json=pkg/types/cooking_minutes.go \
        --schema-output={{schema_base}}/unit.schema.json=pkg/types/unit.go \
        --schema-output={{schema_base}}/item_category.schema.json=pkg/types/item_category.go \
        --schema-output={{schema_base}}/difficulty.schema.json=pkg/types/difficulty.go \
        --schema-output={{schema_base}}/generated_by.schema.json=pkg/types/generated_by.go \
        --schema-output={{schema_base}}/receipt_item.schema.json=pkg/types/receipt_item.go \
        --schema-output={{schema_base}}/receipt.schema.json=pkg/types/receipt.go \
        --schema-output={{schema_base}}/ingredient.schema.json=pkg/types/ingredient.go \
        --schema-output={{schema_base}}/recipe_step.schema.json=pkg/types/recipe_step.go \
        --schema-output={{schema_base}}/recipe.schema.json=pkg/types/recipe.go \
        --schema-output={{schema_base}}/haul_request.schema.json=pkg/types/haul_request.go \
        --schema-output={{schema_base}}/haul.schema.json=pkg/types/haul.go \
        --schema-output={{schema_base}}/haul_base.schema.json=pkg/types/haul_base.go \
        --schema-output={{schema_base}}/status.schema.json=pkg/types/status.go \
        --schema-output={{schema_base}}/haul_summary.schema.json=pkg/types/haul_summary.go \
        --schema-output={{schema_base}}/recipe_summary.schema.json=pkg/types/recipe_summary.go \
        --schema-output={{schema_base}}/haul_prompt.schema.json=pkg/types/haul_prompt.go \
        --schema-output={{schema_base}}/haul_response.schema.json=pkg/types/haul_response.go \
        --schema-output={{schema_base}}/recipe_review.schema.json=pkg/types/recipe_review.go \
        schemas/haul.schema.json \
        schemas/haul_request.schema.json \
        schemas/haul_prompt.schema.json \
        schemas/haul_response.schema.json \
        schemas/haul_summary.schema.json \
        schemas/recipe_review.schema.json

bundle-prompt-schemas:
    mkdir -p assets/schemas
    python bin/bundle_schema_prompt.py schemas/haul_response.schema.json > assets/schemas/haul_prompt_response.schema.json

migrate: migrate-db generate-sqlc

generate-sqlc:
    sqlc generate

migrate-db:
    dbmate -d ./db/migrations up

serve:
    go run cmd/plock/main.go
