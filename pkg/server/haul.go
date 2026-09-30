package server

import (
	"fmt"
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

		fmt.Println(haulReq)

		// article, ok := ctx.Value("article").(string)
		// if !ok {
		// 	http.Error(w, http.StatusText(422), 422)
		// 	return
		// }

		w.Write([]byte("alive and kickin"))
	}
}
