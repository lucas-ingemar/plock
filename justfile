generate-types:
    quicktype -s schema -l go --package types schemas/haul_request.schema > pkg/types/haulrequest.go
    quicktype -s schema -l ts schemas/haul_request.schema > frontend/types/haulrequest.ts

migrate:
    dbmate -d ./db/migrations up
