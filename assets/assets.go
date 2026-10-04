package assets

import (
	_ "embed"
)

//go:embed schemas/haul_prompt_response.schema.json
var HaulPromptResponseSchema string
