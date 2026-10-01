package kitchen

import (
	"context"

	"github.com/gofrs/uuid/v5"
	"github.com/lucas-ingemar/plock/pkg/database"
	"github.com/lucas-ingemar/plock/pkg/types"
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
