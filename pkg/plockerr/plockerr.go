package plockerr

import (
	"log/slog"
	"net/http"
)

// type Response struct {
// 	Error *PlockErr `json:"error"`
// }

type PlockErr struct {
	Code    string `json:"code"`
	Title   string `json:"title"`
	Message string `json:"message"`

	Status   int         `json:"-"`
	Module   string      `json:"-"`
	Err      error       `json:"-"`
	LogAttrs []slog.Attr `json:"-"`
}

func (e *PlockErr) Error() string {
	if e.Err != nil {
		return e.Code + ": " + e.Err.Error()
	}
	return e.Code
}

func (e *PlockErr) Unwrap() error {
	return e.Err
}

func (e *PlockErr) With(key string, val any) *PlockErr {
	e.LogAttrs = append(e.LogAttrs, slog.Attr{
		Key:   key,
		Value: slog.AnyValue(val),
	})
	return e
}

type PlockErrFactory struct {
	module string
}

func NewFactory(module string) PlockErrFactory {
	return PlockErrFactory{
		module: module,
	}
}

var ErrReqValidation = PlockErr{
	Code:   "REQVALIDATION",
	Title:  "Request validation failed",
	Status: http.StatusBadRequest,
}

func (p PlockErrFactory) ReqValidation(err error, message string) *PlockErr {
	e := ErrReqValidation
	e.Module = p.module
	e.Err = err
	e.Message = message

	return &e
}
