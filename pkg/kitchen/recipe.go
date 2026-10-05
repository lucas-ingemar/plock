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
