package llm

import (
	"bytes"
	"context"
	"strings"
	"text/template"

	"github.com/lucas-ingemar/plock/pkg/types"
)

const promptTemplate = `
You are a practical home cook and meal planner. I'm attaching a grocery receipt. Read it carefully, work out what I bought, and plan dinners that use those groceries.

## Household

- Adults: {{.Adults}}
{{- if gt .Children 0}}
- Children under the age of 12: {{.Children}}
{{- end}}
- Servings per meal: {{.ServingsPerMeal}} (this may include extra portions for leftovers or lunchboxes)

## What I want

- Plan exactly {{.MealCount}} dinners.
- Each dinner must take at most {{.MaxCookingMinutes}} minutes from start to served.
- Only use these proteins: {{join .Proteins ", "}}. Never use a protein that isn't on this list, even if it's on the receipt.
{{- if .Cuisines}}
- Choose from these cuisines and vary them across the meals: {{join .Cuisines ", "}}.
{{- else}}
- Mix cuisines freely across the meals. Avoid repeating the same cuisine unless the groceries call for it.
{{- end}}
- Write all text in {{.Language}}.

## How to plan

1. Analyze the receipt first. List every line, including non-food items such as detergent or diapers, and mark those as non-food. Normalize item names (for example "Tofu Fast Naturell Ekologisk 400g" becomes "Tofu"), and combine multi-packs into a total quantity.
2. Build the dinners around the food on the receipt. Prioritize fresh and perishable items, and use as much of the receipt as is reasonable across the meals.
3. You may assume common pantry staples are already at home: salt, pepper, dried herbs and spices, cooking oil, butter, flour, sugar, vinegar, soy sauce, stock cubes, tomato paste, onions, garlic, rice and pasta. Don't assume anything else.
4. Scale every ingredient amount to exactly {{.ServingsPerMeal}} servings.
5. Prefer quick weeknight techniques. Keep steps short and concrete, and give a timer for any step that involves waiting, simmering or baking.
{{- if gt .Children 0}}
6. There are children in the household. Keep the main dish mild and suggest simple adaptations where useful, such as serving spicy elements separately, cutting round foods like grapes or cherry tomatoes lengthwise, or going easy on salt. Only add kid tips when they genuinely help.
{{- end}}

## Rules

- Mark each ingredient as coming from the receipt or from the pantry. Only mark it as from the receipt if it actually appears there.
- Don't invent items, prices or quantities that aren't on the receipt. If a line is unreadable, leave it out rather than guess.
- Only use the units allowed in the schema.
- For generated_by, state which assistant and model you are. If you don't know your exact model, give the closest name you're sure of rather than guessing a version.

## Attached Reciept

If no reciept is attached you will answer with an error message asking me to attach the reciept without any prompt. When the reciept is attached use the reciept with this prompt.

## Output

Respond with a single JSON object that follows the JSON Schema below. Output only the JSON: no explanation, no markdown and no code fences.

{{.Schema}}

`

func join[T ~string](items []T, sep string) string {
	parts := make([]string, len(items))
	for i, item := range items {
		parts[i] = string(item)
	}
	return strings.Join(parts, sep)
}

func GeneratePrompt(ctx context.Context, params types.PromptParams) (string, error) {
	tmpl, err := template.New("prompt").Funcs(template.FuncMap{
		"join": join[string],
	}).Parse(promptTemplate)
	if err != nil {
		return "", err
	}

	buf := bytes.NewBufferString("")

	err = tmpl.Execute(buf, params)
	if err != nil {
		return "", err
	}

	return buf.String(), nil
}
