package json

import (
	"encoding/json"
	"net/http"
)

func Write(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func Read(r *http.Request, data any) error {
	decode := json.NewDecoder(r.Body)
	decode.DisallowUnknownFields() // to avoid silent errors and prevent malicious input
	return decode.Decode(data)
}

