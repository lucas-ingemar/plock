package kitchen

import (
	"context"

	"github.com/gofrs/uuid/v5"
	"github.com/lucas-ingemar/plock/pkg/database"
	"github.com/lucas-ingemar/plock/pkg/types"
	"github.com/samber/lo"
)

func (k *Kitchen) AddRecipeReview(ctx context.Context, recipeID, userID uuid.UUID, review types.RecipeReview) error {
	_, err := k.db.GetRecipe(ctx, recipeID)
	if err != nil {
		return err
	}

	if review.Notes != nil && *review.Notes == "" {
		review.Notes = nil
	}

	dbRecipeReview := database.AddRecipeReviewParams{
		UserID:         userID,
		RecipeID:       recipeID,
		Rating:         int64(review.Rating),
		ChildrenRating: database.SqlInt64(review.ChildrenRating),
		Notes:          database.SqlString(review.Notes),
	}

	if err = k.db.AddRecipeReview(ctx, dbRecipeReview); err != nil {
		return err
	}

	return nil
}

func (k *Kitchen) GetRecipe(ctx context.Context, recipeID uuid.UUID) (types.Recipe, error) {
	dbR, err := k.db.GetRecipe(ctx, recipeID)
	if err != nil {
		return types.Recipe{}, err
	}

	r := dbR.ToApiRecipe()

	r, err = k.FillRecipe(ctx, r)
	if err != nil {
		return types.Recipe{}, err
	}

	return r, nil
}

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
		r := dbr.ToApiRecipe()

		r, err = k.FillRecipe(ctx, r)
		if err != nil {
			return nil, err
		}

		recipes = append(recipes, r)
	}

	return recipes, nil
}

func (k *Kitchen) FillRecipe(ctx context.Context, r types.Recipe) (types.Recipe, error) {
	dbIng, err := k.db.ListRecipeIngredientsFromRecipeID(ctx, r.ID)
	if err != nil {
		return types.Recipe{}, err
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

	dbSteps, err := k.db.ListRecipeStepsFromRecipeID(ctx, r.ID)
	if err != nil {
		return types.Recipe{}, err
	}

	r.Steps = lo.Map(dbSteps, func(item database.RecipeStep, _ int) types.RecipeStep {
		return types.RecipeStep{
			Text:         item.Text,
			TimerMinutes: database.NilInt(item.TimerMinutes),
		}
	})

	// FIXME: Wrong user
	dbReviews, err := k.db.ListReviewsForRecipe(ctx, database.ListReviewsForRecipeParams{
		RecipeID: r.ID,
		UserID:   uuid.Nil,
	})

	r.Reviews = map[uuid.UUID]types.RecipeReview{}
	for _, review := range dbReviews {
		r.Reviews[review.UserID] = types.RecipeReview{
			ChildrenRating: database.NilInt(review.ChildrenRating),
			Notes:          database.NilStr(review.Notes),
			Rating:         int(review.Rating),
		}
	}

	return r, err
}
