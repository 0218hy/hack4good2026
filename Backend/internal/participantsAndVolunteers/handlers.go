package participants

import (
	"log"
	"net/http"
	"strconv"

	chi "github.com/go-chi/chi/v5"
	jsonutil "github.com/hack4good2026/internal/json"
)

type ParticipantHandler struct {
	service Service
}

func NewHandler(service Service) *ParticipantHandler {
	return &ParticipantHandler{
		service: service,
	}
}

// Get all participants by user ID where role = participant
// GET /participants/user/:user_id
func (h *ParticipantHandler) GetParticipantsByUserID(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.ParseInt(chi.URLParam(r, "user_id"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	participants, err := h.service.GetParticipantsByUserID(r.Context(), userID)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, participants)
}

// List all participants where role = participant
// GET /participants
func (h *ParticipantHandler) ListParticipants(w http.ResponseWriter, r *http.Request) {
	participants, err := h.service.ListParticipants(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, participants)
}

// Get all volunteers by user ID where role = volunteer
// GET /volunteers/user/:user_id
func (h *ParticipantHandler) GetVolunteersByUserID(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.ParseInt(chi.URLParam(r, "user_id"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	volunteers, err := h.service.GetVolunteersByUserID(r.Context(), userID)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, volunteers)
}

// List all volunteers where role = volunteer
// GET /volunteers
func (h *ParticipantHandler) ListVolunteers(w http.ResponseWriter, r *http.Request) {
	volunteers, err := h.service.ListVolunteers(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, volunteers)
}
