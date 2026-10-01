package server

import (
	"net/http"

	"github.com/lucas-ingemar/plock/pkg/types"
)

func (s *Server) addHaul() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		haulReq := types.HaulRequest{}

		if err := s.decodeJSON(w, r, &haulReq); err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		haul, err := s.k.AddHaul(ctx, haulReq)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		s.returnJSON(ctx, w, r, http.StatusCreated, haul)
	}
}
