package server

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"log/slog"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/lucas-ingemar/plock/pkg/kitchen"
	"github.com/lucas-ingemar/plock/pkg/plockerr"
)

type Server struct {
	k *kitchen.Kitchen

	log     *slog.Logger
	perr    plockerr.PlockErrFactory
	distFs  fs.FS
	httpSrv *http.Server
}

func (s *Server) Handler() http.Handler {
	r := chi.NewRouter()
	r.Use(LoggerMiddleware(*s.log, []string{"/healthz"}))

	// r.Get("/*", s.frontend(s.distFs))

	r.Get("/healthz", s.healthz())
	// r.Get("/readyz", s.readyz())
	// r.Get("/info", s.info())

	r.Mount("/api", s.api())
	// r.Mount("/auth", s.auth())

	return r
}

func (s *Server) Start(ctx context.Context) error {
	s.httpSrv = &http.Server{
		Addr:    fmt.Sprintf(":%d", 3000),
		Handler: s.Handler(),
	}
	s.log.InfoContext(ctx, "HTTP server starting", "port", 3000)

	if err := s.httpSrv.ListenAndServe(); err != nil &&
		!errors.Is(err, http.ErrServerClosed) {
		return err
	}

	return nil
}

func (s *Server) frontend(distFs fs.FS) http.HandlerFunc {
	fsys := http.FS(distFs)
	fileServer := http.FileServer(fsys)

	return func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/")

		// Let assets pass through directly
		if strings.HasPrefix(path, "assets/") {
			fileServer.ServeHTTP(w, r)
			return
		}

		// Check if file exists
		f, err := fsys.Open(path)
		if err == nil {
			f.Close()
			fileServer.ServeHTTP(w, r)
			return
		}

		// Fallback to SPA
		r.URL.Path = "/"
		fileServer.ServeHTTP(w, r)
	}
}

func (s *Server) healthz() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("alive and kickin"))
	}
}

func New(k *kitchen.Kitchen) Server {
	return Server{
		k:      k,
		log:    slog.Default().With("module", "server"),
		perr:   plockerr.NewFactory("server"),
		distFs: nil,
	}
}
