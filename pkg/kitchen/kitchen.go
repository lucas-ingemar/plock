package kitchen

import (
	"log/slog"

	"github.com/lucas-ingemar/plock/pkg/database"
)

type Kitchen struct {
	db database.DatabaseFace

	log *slog.Logger
}

func New(db database.DatabaseFace) Kitchen {
	return Kitchen{
		db:  db,
		log: slog.Default().With("module", "kitchen"),
	}
}
