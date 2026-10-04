package types

type PromptParams struct {
	Adults            int
	Children          int
	ServingsPerMeal   int
	MealCount         int
	MaxCookingMinutes int
	Proteins          []string
	Cuisines          []string
	Language          string
	Schema            string
}
