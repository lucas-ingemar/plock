package server

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/lucas-ingemar/plock/pkg/plockerr"
)

func (s *Server) handleError(ctx context.Context, err error, w http.ResponseWriter, r *http.Request) {
	if err == nil {
		return
	}

	perr, ok := err.(*plockerr.PlockErr)
	if !ok {
		perr = &plockerr.PlockErr{
			Code:    "UNKNOWN",
			Title:   "Internal Server Error",
			Message: "An unknown error occured",
			Status:  http.StatusInternalServerError,
		}
		s.log.ErrorContext(ctx, "unknown sever error", "error", err)
	} else {
		attrs := []slog.Attr{
			slog.Any("code", perr.Code),
			slog.Any("service", perr.Module),
		}
		if perr.Err != nil {
			attrs = append(attrs, slog.Any("error", perr.Err.Error()))
		}
		attrs = append(attrs, perr.LogAttrs...)
		slog.LogAttrs(ctx, slog.LevelError, perr.Message, attrs...)
	}

	w.WriteHeader(perr.Status)
	w.Header().Add("Content-Type", "application/json")

	if ierr := json.NewEncoder(w).Encode(map[string]any{"error": perr}); ierr != nil {
		s.log.ErrorContext(ctx, "error when encoding error", "error", ierr)
	}
}
