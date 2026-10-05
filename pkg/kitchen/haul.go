package kitchen

import (
	"context"
	"database/sql"

	"github.com/gofrs/uuid/v5"
	"github.com/lucas-ingemar/plock/assets"
	"github.com/lucas-ingemar/plock/pkg/database"
	"github.com/lucas-ingemar/plock/pkg/llm"
	"github.com/lucas-ingemar/plock/pkg/types"
	"github.com/samber/lo"
)

func (k *Kitchen) AddHaul(ctx context.Context, h types.HaulRequest) (types.Haul, error) {
	uid, err := uuid.NewV4()
	if err != nil {
		return types.Haul{}, err
	}

	haulParams := database.CreateHaulParams{
		ID:                uid,
		Adults:            int64(h.Adults),
		Children:          int64(h.Children),
		ServingsPerMeal:   int64(h.ServingsPerMeal),
		MealCount:         int64(h.MealCount),
		MaxCookingMinutes: h.MaxCookingMinutes,
	}

	tx, err := k.db.Begin(ctx)
	if err != nil {
		return types.Haul{}, err
	}
	defer tx.Rollback()

	dbHaul, err := tx.CreateHaul(ctx, haulParams)
	if err != nil {
		return types.Haul{}, err
	}

	for _, protein := range h.ProteinPreferences {
		dbP := database.AddHaulProteinParams{
			HaulID:  dbHaul.ID,
			Protein: protein,
		}

		if err = tx.AddHaulProtein(ctx, dbP); err != nil {
			return types.Haul{}, err
		}
	}

	for _, cuisine := range h.CuisinePreferences {
		dbC := database.AddHaulCuisineParams{
			HaulID:  dbHaul.ID,
			Cuisine: cuisine,
		}

		if err = tx.AddHaulCuisine(ctx, dbC); err != nil {
			return types.Haul{}, err
		}
	}

	if err = tx.Commit(); err != nil {
		return types.Haul{}, err
	}

	haul := types.Haul{
		Adults:             int(dbHaul.Adults),
		Children:           int(dbHaul.Children),
		CreatedAt:          dbHaul.CreatedAt,
		CuisinePreferences: h.CuisinePreferences,
		ID:                 dbHaul.ID,
		MaxCookingMinutes:  dbHaul.MaxCookingMinutes,
		MealCount:          int(dbHaul.MealCount),
		ProteinPreferences: h.ProteinPreferences,
		ServingsPerMeal:    int(dbHaul.ServingsPerMeal),
		Status:             dbHaul.Status,
		UpdatedAt:          dbHaul.UpdatedAt,
	}

	k.log.InfoContext(ctx, "created new haul", "id", dbHaul.ID.String(), "status", haul.Status)

	return haul, nil
}

func (k *Kitchen) GetHaul(ctx context.Context, id uuid.UUID) (haul types.Haul, err error) {
	h, err := k.db.GetHaul(ctx, id)
	if err != nil {
		return types.Haul{}, err
	}

	var generatedBy *types.GeneratedBy

	if h.Assistant.Valid {
		generatedBy = &types.GeneratedBy{
			Assistant: h.Assistant.String,
			Model:     h.AssistantModel.String,
		}
	}

	// FIXME: Add more data
	haul = types.Haul{
		Title:             database.NilStr(h.Title),
		Language:          database.NilStr(h.Language),
		GeneratedBy:       generatedBy,
		Adults:            int(h.Adults),
		Children:          int(h.Children),
		CreatedAt:         h.CreatedAt,
		ID:                h.ID,
		MaxCookingMinutes: h.MaxCookingMinutes,
		MealCount:         int(h.MealCount),
		ServingsPerMeal:   int(h.ServingsPerMeal),
		Status:            h.Status,
		UpdatedAt:         h.UpdatedAt,
	}

	hp, err := k.db.GetHaulProteins(ctx, id)
	if err != nil {
		return types.Haul{}, err
	}

	hc, err := k.db.GetHaulCuisines(ctx, id)
	if err != nil {
		return types.Haul{}, err
	}

	haul.ProteinPreferences = lo.Map(hp, func(item database.HaulProtein, _ int) types.Protein {
		return item.Protein
	})

	haul.CuisinePreferences = lo.Map(hc, func(item database.HaulCuisine, _ int) types.Cuisine {
		return item.Cuisine
	})

	return haul, nil
}

func (k *Kitchen) ListHauls(ctx context.Context) (hauls []types.HaulSummary, err error) {
	dbHauls, err := k.db.ListHauls(ctx)
	if err != nil {
		return nil, err
	}

	for _, h := range dbHauls {
		var generatedBy *types.GeneratedBy

		recipeSummaries, err := k.ListRecipeSummariesForHaul(ctx, h.ID)
		if err != nil {
			return nil, err
		}

		if h.Assistant.Valid {
			generatedBy = &types.GeneratedBy{
				Assistant: h.Assistant.String,
				Model:     h.AssistantModel.String,
			}
		}

		hauls = append(hauls, types.HaulSummary{
			Title:              database.NilStr(h.Title),
			Language:           database.NilStr(h.Language),
			GeneratedBy:        generatedBy,
			Adults:             int(h.Adults),
			Children:           int(h.Children),
			CreatedAt:          h.CreatedAt,
			CuisinePreferences: []types.Cuisine{},
			ID:                 h.ID,
			MaxCookingMinutes:  h.MaxCookingMinutes,
			MealCount:          int(h.MealCount),
			ProteinPreferences: []types.Protein{},
			ServingsPerMeal:    int(h.ServingsPerMeal),
			Status:             h.Status,
			UpdatedAt:          h.UpdatedAt,
			Recipes:            recipeSummaries,
		})
	}

	return hauls, nil
}

func (k *Kitchen) GenerateHaulPrompt(ctx context.Context, haulID uuid.UUID) (haulPrompt types.HaulPrompt, err error) {
	haul, err := k.GetHaul(ctx, haulID)
	if err != nil {
		return types.HaulPrompt{}, err
	}

	promptParams := types.PromptParams{
		Adults:            haul.Adults,
		Children:          haul.Children,
		ServingsPerMeal:   haul.ServingsPerMeal,
		MealCount:         haul.MealCount,
		MaxCookingMinutes: int(haul.MaxCookingMinutes),
		Proteins:          lo.Map(haul.ProteinPreferences, func(p types.Protein, _ int) string { return string(p) }),
		Cuisines:          lo.Map(haul.CuisinePreferences, func(p types.Cuisine, _ int) string { return string(p) }),
		Language:          "swedish",
		Schema:            assets.HaulPromptResponseSchema,
	}

	prompt, err := llm.GeneratePrompt(ctx, promptParams)
	if err != nil {
		return types.HaulPrompt{}, err
	}

	return types.HaulPrompt{Prompt: prompt}, nil
}

func (k *Kitchen) AddHaulPromptResponse(ctx context.Context, haulID uuid.UUID, h types.HaulResponse) (types.Haul, error) {
	tx, err := k.db.Begin(ctx)
	if err != nil {
		return types.Haul{}, err
	}
	defer tx.Rollback()

	err = tx.AddHaulPromptResponse(ctx, database.AddHaulPromptResponseParams{
		Title:          sql.NullString{Valid: true, String: h.Title},
		Language:       sql.NullString{Valid: true, String: h.Language},
		Assistant:      sql.NullString{Valid: true, String: h.GeneratedBy.Assistant},
		AssistantModel: sql.NullString{Valid: true, String: h.GeneratedBy.Model},
		ID:             haulID,
	})
	if err != nil {
		return types.Haul{}, err
	}

	receiptID, err := uuid.NewV4()
	if err != nil {
		return types.Haul{}, err
	}

	if err = tx.AddReceipt(ctx, database.AddReceiptParams{
		ID:           receiptID,
		HaulID:       haulID,
		Currency:     h.Receipt.Currency,
		Date:         h.Receipt.Date.Format("20060102"),
		ItemCount:    int64(h.Receipt.ItemCount),
		Store:        h.Receipt.Store,
		Summary:      h.Receipt.Summary,
		Total:        h.Receipt.Total,
		TotalSavings: database.SqlFloat64(h.Receipt.TotalSavings),
	}); err != nil {
		return types.Haul{}, err
	}

	for idx, ri := range h.Receipt.Items {
		receiptItemID, err := uuid.NewV4()
		if err != nil {
			return types.Haul{}, err
		}

		if err = tx.AddReceiptItem(ctx, database.AddReceiptItemParams{
			ID:        receiptItemID,
			ReceiptID: receiptID,
			Idx:       int64(idx),
			Brand:     database.SqlString(ri.Brand),
			Category:  database.SqlString((*string)(&ri.Category)),
			Discount:  database.SqlFloat64(ri.Discount),
			IsFood:    ri.IsFood,
			Name:      ri.Name,
			Price:     ri.Price,
			Quantity:  ri.Quantity,
			Unit:      string(ri.Unit),
		}); err != nil {
			return types.Haul{}, err
		}
	}

	for recipeIdx, recipe := range h.Recipes {
		recipeID, err := uuid.NewV4()
		if err != nil {
			return types.Haul{}, err
		}

		if err := tx.AddRecipe(ctx, database.AddRecipeParams{
			ID:               recipeID,
			HaulID:           haulID,
			HaulIdx:          int64(recipeIdx),
			Cuisine:          string(recipe.Cuisine),
			Description:      recipe.Description,
			Difficulty:       string(recipe.Difficulty),
			KidTips:          database.SqlString(recipe.KidTips),
			Protein:          string(recipe.Protein),
			Servings:         int64(recipe.Servings),
			Title:            recipe.Title,
			TotalTimeMinutes: int64(recipe.TotalTimeMinutes),
		}); err != nil {
			return types.Haul{}, err
		}

		for ingIdx, ing := range recipe.Ingredients {
			ingID, err := uuid.NewV4()
			if err != nil {
				return types.Haul{}, err
			}

			if err := tx.AddRecipeIngredient(ctx, database.AddRecipeIngredientParams{
				ID:          ingID,
				RecipeID:    recipeID,
				Idx:         int64(ingIdx),
				FromReceipt: ing.FromReceipt,
				Name:        ing.Name,
				Note:        database.SqlString(ing.Note),
				Quantity:    database.SqlFloat64(ing.Quantity),
				Unit:        database.SqlString((*string)(ing.Unit)),
			}); err != nil {
				return types.Haul{}, err
			}
		}

		for stepIdx, step := range recipe.Steps {
			stepID, err := uuid.NewV4()
			if err != nil {
				return types.Haul{}, err
			}

			if err := tx.AddRecipeStep(ctx, database.AddRecipeStepParams{
				ID:           stepID,
				RecipeID:     recipeID,
				Idx:          int64(stepIdx),
				Text:         step.Text,
				TimerMinutes: database.SqlInt64(step.TimerMinutes),
			}); err != nil {
				return types.Haul{}, err
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return types.Haul{}, err
	}

	return types.Haul{}, nil
}
