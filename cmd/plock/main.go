package main

import (
	"context"
	"database/sql"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	"github.com/lmittmann/tint"
	"github.com/lucas-ingemar/plock/pkg/database"
	"github.com/lucas-ingemar/plock/pkg/kitchen"
	"github.com/lucas-ingemar/plock/pkg/server"
)

func main() {
	ctx := context.Background()

	slogHandler := tint.NewTextHandler(os.Stderr, &tint.Options{
		Level:      slog.LevelDebug,
		TimeFormat: time.TimeOnly,
	})

	slog.SetDefault(slog.New(slogHandler))

	// dbPath := filepath.Join(scfg.Paths.ConfigDir, "data.db")
	dbPath := filepath.Join("devdb.db")
	dbSqlite, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		slog.Error(err.Error())
		return
	}

	db, err := database.NewDatabase(dbSqlite)
	if err != nil {
		slog.Error(err.Error())
		return
	}

	k := kitchen.New(db)

	s := server.New(&k)

	if err = s.Start(ctx); err != nil {
		slog.Error(err.Error())
		return
	}
}
