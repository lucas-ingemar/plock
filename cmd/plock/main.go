package main

import (
	"database/sql"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	"github.com/lmittmann/tint"
	"github.com/lucas-ingemar/plock/pkg/database"
)

func main() {
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
}
