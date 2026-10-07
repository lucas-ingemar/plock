package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/gofrs/uuid/v5"
	"github.com/lucas-ingemar/plock/pkg/types"
)

func (s *Server) getRecipe() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		recipeID := chi.URLParam(r, "recipeID")

		recipeUID, err := uuid.FromString(recipeID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		haul, err := s.k.GetRecipe(ctx, recipeUID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		s.returnJSON(ctx, w, r, http.StatusOK, haul)
	}
}

func (s *Server) addRecipeReview() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		recipeID := chi.URLParam(r, "recipeID")

		recipeUID, err := uuid.FromString(recipeID)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		recipeReview := types.RecipeReview{}

		if err := s.decodeJSON(w, r, &recipeReview); err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		err = s.k.AddRecipeReview(ctx, recipeUID, recipeReview)
		if err != nil {
			s.handleError(ctx, err, w, r)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
