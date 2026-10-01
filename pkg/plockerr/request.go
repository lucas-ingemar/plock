package plockerr

import (
	"fmt"
	"net/http"
)

var ErrReqUnsupportedContentType = PlockErr{
	Code:   "REQUNSUPPORTEDCONTENTTYPE",
	Title:  "Unsupported content type",
	Status: http.StatusUnsupportedMediaType,
}

var ErrReqEmptyBody = PlockErr{
	Code:   "REQEMPTYBODY",
	Title:  "Request body is empty",
	Status: http.StatusBadRequest,
}

var ErrReqBodyTooLarge = PlockErr{
	Code:   "REQBODYTOOLARGE",
	Title:  "Request body too large",
	Status: http.StatusRequestEntityTooLarge,
}

var ErrReqMalformedJSON = PlockErr{
	Code:   "REQMALFORMEDJSON",
	Title:  "Malformed JSON",
	Status: http.StatusBadRequest,
}

var ErrReqInvalidFieldType = PlockErr{
	Code:   "REQINVALIDFIELDTYPE",
	Title:  "Invalid field type",
	Status: http.StatusBadRequest,
}

var ErrReqUnknownField = PlockErr{
	Code:   "REQUNKNOWNFIELD",
	Title:  "Unknown field",
	Status: http.StatusBadRequest,
}

var ErrReqMultipleJSONValues = PlockErr{
	Code:   "REQMULTIPLEJSONVALUES",
	Title:  "Multiple JSON values",
	Status: http.StatusBadRequest,
}

func (p PlockErrFactory) ReqUnsupportedContentType(err error, got string) *PlockErr {
	e := ErrReqUnsupportedContentType
	e.Module = p.module
	e.Err = err
	e.Message = fmt.Sprintf("Content-Type must be application/json, got %q", got)
	return &e
}

func (p PlockErrFactory) ReqEmptyBody(err error) *PlockErr {
	e := ErrReqEmptyBody
	e.Module = p.module
	e.Err = err
	e.Message = "Request body must not be empty"
	return &e
}

func (p PlockErrFactory) ReqBodyTooLarge(err error, limit int64) *PlockErr {
	e := ErrReqBodyTooLarge
	e.Module = p.module
	e.Err = err
	e.Message = fmt.Sprintf("Request body must not exceed %d bytes", limit)
	return &e
}

// offset is the byte position of the syntax error, or -1 if unknown.
func (p PlockErrFactory) ReqMalformedJSON(err error, offset int64) *PlockErr {
	e := ErrReqMalformedJSON
	e.Module = p.module
	e.Err = err
	e.Message = err.Error()
	// if offset >= 0 {
	// 	e.Message = fmt.Sprintf("Request body contains malformed JSON at position %d", offset)
	// } else {
	// 	e.Message = "Request body contains malformed JSON"
	// }
	return &e
}

func (p PlockErrFactory) ReqInvalidFieldType(err error, field, expected string) *PlockErr {
	e := ErrReqInvalidFieldType
	e.Module = p.module
	e.Err = err
	e.Message = fmt.Sprintf("Field %q must be of type %s", field, expected)
	return &e
}

func (p PlockErrFactory) ReqUnknownField(err error, field string) *PlockErr {
	e := ErrReqUnknownField
	e.Module = p.module
	e.Err = err
	e.Message = fmt.Sprintf("Request body contains unknown field %s", field)
	return &e
}

func (p PlockErrFactory) ReqMultipleJSONValues(err error) *PlockErr {
	e := ErrReqMultipleJSONValues
	e.Module = p.module
	e.Err = err
	e.Message = "Request body must contain a single JSON object"
	return &e
}
