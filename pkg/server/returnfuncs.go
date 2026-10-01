package server

import (
	"context"
	"encoding/json"
	"net/http"
)

func (s *Server) returnRedirect(ctx context.Context, w http.ResponseWriter, r *http.Request, u string) {
	s.log.DebugContext(ctx, "redirecting user", "url", u)
	http.Redirect(w, r, u, http.StatusSeeOther)
}

func (s *Server) returnJSON(ctx context.Context, w http.ResponseWriter, r *http.Request, status int, payload any) {
	pb, err := json.Marshal(payload)
	if err != nil {
		s.handleError(ctx, err, w, r)
		return
	}

	w.WriteHeader(status)

	if _, err := w.Write(pb); err != nil {
		s.handleError(ctx, err, w, r)
		return
	}
	s.log.DebugContext(ctx, "returned json payload")
}
