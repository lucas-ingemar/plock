package server

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/gofrs/uuid/v5"
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

func (s *Server) getHaul() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		haulID := chi.URLParam(r, "haulID")
		fmt.Println(haulID)

		haulUID, err := uuid.FromString(haulID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		haul, err := s.k.GetHaul(ctx, haulUID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		s.returnJSON(ctx, w, r, http.StatusOK, haul)
	}
}

func (s *Server) generateHaulPrompt() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		haulID := chi.URLParam(r, "haulID")
		fmt.Println(haulID)

		haulUID, err := uuid.FromString(haulID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		haulPrompt, err := s.k.GenerateHaulPrompt(ctx, haulUID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		s.returnJSON(ctx, w, r, http.StatusOK, haulPrompt)
	}
}

func (s *Server) listHauls() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		hauls, err := s.k.ListHauls(ctx)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		s.returnJSON(ctx, w, r, http.StatusOK, hauls)
	}
}
