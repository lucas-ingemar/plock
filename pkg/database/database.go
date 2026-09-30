package database

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"

	"github.com/mattn/go-sqlite3"
)

// DatabaseFace is every generated query (db.Querier, from emit_interface)
// plus transaction control.
type DatabaseFace interface {
	Querier
	Begin(ctx context.Context) (DatabaseFace, error)
	Commit() error
	Rollback() error
}

// Database embeds the sqlc-generated Queries, so all query methods are
// available directly on it. ext is either a *sql.DB or a *sql.Tx.
type Database struct {
	*Queries
	ext       DBTX
	log       *slog.Logger
	committed bool
}

var _ DatabaseFace = (*Database)(nil)

func NewDatabase(dbSql *sql.DB) (*Database, error) {
	dbSql.SetMaxOpenConns(1)
	dbSql.SetMaxIdleConns(1)

	sqlite3conn, ok := dbSql.Driver().(*sqlite3.SQLiteDriver)
	if !ok {
		return nil, errors.New("database: expected mattn/go-sqlite3 driver")
	}
	sqlite3conn.ConnectHook = func(conn *sqlite3.SQLiteConn) error {
		// Enable foreign key enforcement on every connection
		if _, err := conn.Exec("PRAGMA foreign_keys = ON;", nil); err != nil {
			return err
		}

		// Enable multiple readers while writing
		if _, err := conn.Exec("PRAGMA journal_mode = WAL;", nil); err != nil {
			return err
		}

		// Faster writes, still safe with WAL
		if _, err := conn.Exec("PRAGMA synchronous = NORMAL;", nil); err != nil {
			return err
		}

		// Wait up to 5s for a lock instead of failing immediately
		if _, err := conn.Exec("PRAGMA busy_timeout = 5000;", nil); err != nil {
			return err
		}

		return nil
	}

	return &Database{
		Queries: New(dbSql),
		ext:     dbSql,
		log:     slog.Default().With("module", "database"),
	}, nil
}

func (d *Database) Begin(ctx context.Context) (DatabaseFace, error) {
	conn, ok := d.ext.(*sql.DB)
	if !ok {
		return nil, errors.New("cannot start transaction inside another transaction")
	}
	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	d.log.DebugContext(ctx, "starting transaction")
	return &Database{
		Queries: d.Queries.WithTx(tx),
		ext:     tx,
		log:     d.log,
	}, nil
}

func (d *Database) Commit() error {
	if tx, ok := d.ext.(*sql.Tx); ok {
		d.log.Debug("committing transaction")
		if err := tx.Commit(); err != nil {
			return err
		}
		d.committed = true
		return nil
	}
	d.log.Error("failed to commit transaction, not in transaction")
	return nil
}

func (d *Database) Rollback() error {
	if d.committed {
		return nil
	}

	if tx, ok := d.ext.(*sql.Tx); ok {
		d.log.Debug("rolling back transaction")
		return tx.Rollback()
	}
	d.log.Error("failed to rollback transaction, not in transaction")
	return nil
}
