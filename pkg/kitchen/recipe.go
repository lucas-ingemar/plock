package kitchen

import (
	"context"

	"github.com/gofrs/uuid/v5"
	"github.com/lucas-ingemar/plock/pkg/database"
	"github.com/lucas-ingemar/plock/pkg/types"
	"github.com/samber/lo"
)

func (k *Kitchen) ListRecipeSummariesForHaul(ctx context.Context, haulID uuid.UUID) ([]types.RecipeSummary, error) {
	titles, err := k.db.GetRecipeSummaries(ctx, haulID)
	if err != nil {
		return nil, err
	}

	summaries := lo.Map(titles, func(item database.GetRecipeSummariesRow, _ int) types.RecipeSummary {
		return types.RecipeSummary{
			ID:    item.ID,
			Title: item.Title,
		}
	})

	return summaries, nil
}

func (k *Kitchen) ListRecipesForHaul(ctx context.Context, haulID uuid.UUID) (recipes []types.Recipe, err error) {
	dbReceipes, err := k.db.ListRecipesFromHaulID(ctx, haulID)
	if err != nil {
		return nil, err
	}

	for _, dbr := range dbReceipes {
		r := types.Recipe{
			ID:               &dbr.ID,
			Cuisine:          types.Cuisine(dbr.Cuisine),
			Description:      dbr.Description,
			Difficulty:       types.Difficulty(dbr.Difficulty),
			KidTips:          database.NilStr(dbr.KidTips),
			Protein:          types.Protein(dbr.Protein),
			Servings:         int(dbr.Servings),
			Title:            dbr.Title,
			TotalTimeMinutes: int(dbr.TotalTimeMinutes),
		}

		dbIng, err := k.db.ListRecipeIngredientsFromRecipeID(ctx, *r.ID)
		if err != nil {
			return nil, err
		}

		r.Ingredients = lo.Map(dbIng, func(item database.RecipeIngredient, _ int) types.Ingredient {
			return types.Ingredient{
				FromReceipt: item.FromReceipt,
				Name:        item.Name,
				Note:        database.NilStr(item.Note),
				Quantity:    database.NilFloat64(item.Quantity),
				Unit:        (*types.Unit)(database.NilStr(item.Unit)),
			}
		})

		dbSteps, err := k.db.ListRecipeStepsFromRecipeID(ctx, *r.ID)
		if err != nil {
			return nil, err
		}

		r.Steps = lo.Map(dbSteps, func(item database.RecipeStep, _ int) types.RecipeStep {
			return types.RecipeStep{
				Text:         item.Text,
				TimerMinutes: database.NilInt(item.TimerMinutes),
			}
		})

		recipes = append(recipes, r)
	}

	return recipes, nil
}
