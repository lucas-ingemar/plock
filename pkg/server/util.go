package server

import (
	"encoding/json"
	"errors"
	"io"
	"mime"
	"net/http"
	"strings"
)

// MaxBodyBytes caps the request body size (1 MB).
const MaxBodyBytes = 1 << 20

// DecodeJSON parses the JSON body of r into a value of type T.
//
// It enforces a Content-Type of application/json (when set), limits the body
// size, rejects unknown fields, and ensures the body holds exactly one JSON value.

// DecodeJSON parses the JSON body of r into dst, which must be a pointer.
// All failures are returned as *PlockErr.
func (s *Server) decodeJSON(w http.ResponseWriter, r *http.Request, dst any) error {
	if ct := r.Header.Get("Content-Type"); ct != "" {
		mediaType, _, err := mime.ParseMediaType(ct)
		if err != nil || mediaType != "application/json" {
			return s.perr.ReqUnsupportedContentType(err, ct)
		}
	}

	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(dst); err != nil {
		var syntaxErr *json.SyntaxError
		var typeErr *json.UnmarshalTypeError
		var maxErr *http.MaxBytesError

		switch {
		case errors.As(err, &syntaxErr):
			return s.perr.ReqMalformedJSON(err, syntaxErr.Offset)
		case errors.Is(err, io.ErrUnexpectedEOF):
			return s.perr.ReqMalformedJSON(err, -1)
		case errors.As(err, &typeErr):
			return s.perr.ReqInvalidFieldType(err, typeErr.Field, typeErr.Type.String())
		case strings.HasPrefix(err.Error(), "json: unknown field "):
			field := strings.TrimPrefix(err.Error(), "json: unknown field ")
			return s.perr.ReqUnknownField(err, field)
		case errors.Is(err, io.EOF):
			return s.perr.ReqEmptyBody(err)
		case errors.As(err, &maxErr):
			return s.perr.ReqBodyTooLarge(err, maxErr.Limit)
		default:
			return s.perr.ReqMalformedJSON(err, -1)
		}
	}

	if err := dec.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		return s.perr.ReqMultipleJSONValues(err)
	}

	return nil
}
