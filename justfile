generate-types:
    quicktype -s schema -l go --package types schemas/haul_request.schema > pkg/types/haulrequest.go
