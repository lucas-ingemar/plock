package kitchen

import (
	"context"

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

	// FIXME: Add more data
	haul = types.Haul{
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

func (k *Kitchen) ListHauls(ctx context.Context) (hauls []types.Haul, err error) {
	dbHauls, err := k.db.ListHauls(ctx)
	if err != nil {
		return nil, err
	}

	for _, h := range dbHauls {
		hauls = append(hauls, types.Haul{
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
