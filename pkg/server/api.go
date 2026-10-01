package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (s *Server) api() http.Handler {
	r := chi.NewRouter()

	// r.Use(s.authPkg.Middleware)
	//
	r.Get("/hauls", s.listHauls())
	r.Post("/hauls", s.addHaul())

	// r.Get("/info", s.apiInfo())
	// r.Get("/user", s.user())

	// r.Get("/img/*", s.getImage())
	// r.Post("/img/artists/{artistID}", s.addImage(ArtistImage))
	// r.Post("/img/albums/{albumID}", s.addImage(AlbumImage))
	// r.Post("/img/playlists/{playlistID}", s.addImage(PlaylistImage))

	// r.Mount("/admin", s.buildMount(s.adminRoutes()))
	// r.Mount("/albums", s.buildMount(s.albumRoutes()))
	// r.Mount("/album-artists", s.buildMount(s.albumArtistRoutes()))
	// r.Mount("/album-tracks", s.buildMount(s.albumTrackRoutes()))
	// r.Mount("/artists", s.buildMount(s.artistRoutes()))
	// r.Mount("/import", s.buildMount(s.importRoutes()))
	// r.Mount("/likes", s.buildMount(s.likeRoutes()))
	// r.Mount("/mediafiles", s.buildMount(s.mediafileRoutes()))
	// r.Mount("/playlists", s.buildMount(s.playlistRoutes()))
	// r.Mount("/playlist-tracks", s.buildMount(s.playlistTrackRoutes()))
	// r.Mount("/ratings", s.buildMount(s.ratingRoutes()))
	// r.Mount("/sync", s.buildMount(s.syncRoutes()))
	// r.Mount("/search", s.buildMount(s.searchRoutes()))
	// r.Mount("/smart-playlists", s.buildMount(s.smartPlaylistRoutes()))
	// r.Mount("/tracks", s.buildMount(s.trackRoutes()))
	// r.Mount("/track-analysis", s.buildMount(s.trackAnalysisRoutes()))
	// r.Mount("/track-artists", s.buildMount(s.trackArtistRoutes()))

	// r.Mount("/devices", s.buildMount(s.deviceRoutes()))
	// r.Mount("/users", s.buildMount(s.userRoutes()))

	return r
}
