package database

import (
	"database/sql"

	"github.com/samber/lo"
)

func NilStr(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

func NilFloat64(ns sql.NullFloat64) *float64 {
	if ns.Valid {
		return &ns.Float64
	}
	return nil
}

func NilInt(ns sql.NullInt64) *int {
	if ns.Valid {
		return lo.ToPtr(int(ns.Int64))
	}
	return nil
}

func SqlFloat64(f *float64) sql.NullFloat64 {
	if f == nil {
		return sql.NullFloat64{
			Float64: 0,
			Valid:   false,
		}
	}

	return sql.NullFloat64{
		Float64: *f,
		Valid:   true,
	}
}

func SqlString(s *string) sql.NullString {
	if s == nil {
		return sql.NullString{
			String: "",
			Valid:  false,
		}
	}

	return sql.NullString{
		String: *s,
		Valid:  true,
	}
}

func SqlInt64(f *int) sql.NullInt64 {
	if f == nil {
		return sql.NullInt64{
			Int64: 0,
			Valid: false,
		}
	}

	return sql.NullInt64{
		Int64: int64(*f),
		Valid: true,
	}
}
