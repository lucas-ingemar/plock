package kitchen

import (
	"context"

	"github.com/gofrs/uuid"
	"github.com/lucas-ingemar/plock/pkg/types"
)

func (k *Kitchen) AddHaul(ctx context.Context, h types.HaulRequest) (uuid.UUID, error) {
	k.log.InfoContext(ctx, "kakakaka")
	return uuid.Nil, nil
}
