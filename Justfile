schema_base := "https://plock.dev/schemas"

generate-types: generate-types-ts generate-types-go

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
        --schema-root-type={{schema_base}}/haul_request.schema.json=HaulRequest \
        --schema-root-type={{schema_base}}/haul.schema.json=Haul \
        --schema-output={{schema_base}}/protein.schema.json=pkg/types/protein.go \
        --schema-output={{schema_base}}/cuisine.schema.json=pkg/types/cuisine.go \
        --schema-output={{schema_base}}/cooking_minutes.schema.json=pkg/types/cooking_minutes.go \
        --schema-output={{schema_base}}/haul_request.schema.json=pkg/types/haul_request.go \
        --schema-output={{schema_base}}/haul.schema.json=pkg/types/haul.go \
        schemas/haul.schema.json \
        schemas/haul_request.schema.json

migrate: migrate-db generate-sqlc

generate-sqlc:
    sqlc generate

migrate-db:
    dbmate -d ./db/migrations up

serve:
    go run cmd/plock/main.go
