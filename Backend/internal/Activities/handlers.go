package activities

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	jsonutil "hack4good-backend/internal/json"

	chi "github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

// GET /activities
type GetActivity struct {
	service Service
}

func NewHandler(service Service) *GetActivity {
	return &GetActivity{
		service: service,
	}
}

//method 
func (h *GetActivity) ListActivities(w http.ResponseWriter, r *http.Request) {
	activities, err := h.service.ListActivities(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, activities) //rewrote reusable handler 
	//return json from http handler 
} 


// POST /activities (create new activity)
type CreateActivity struct {
	Title               string `json:"title"`
	Description         string `json:"description"`
	Venue               string `json:"venue"`
	StartTime           pgtype.Timestamp `json:"start_time"`     // RFC3339 format
	EndTime             pgtype.Timestamp `json:"end_time"`       // RFC3339 format
	SignupDeadline      pgtype.Timestamp `json:"signup_deadline"` // RFC3339 format
	ParticipantCapacity int    `json:"participant_capacity"`
	VolunteerCapacity   int    `json:"volunteer_capacity"`
}

// method
func (h *GetActivity) CreateActivity(w http.ResponseWriter, r *http.Request) {
	var req CreateActivity
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Title == "" || req.Venue == "" {
		http.Error(w, "title and venue are required", http.StatusBadRequest)
		return
	}

	// Call service to create activity
	activity, err := h.service.CreateActivity(r.Context(), req)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusCreated, activity)
}

// DELETE /activities/{id}
func (h *GetActivity) DeleteActivity(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "activity id is required", http.StatusBadRequest)
		return
	}

	// Call service to delete activity
	err = h.service.DeleteActivity(r.Context(), int32(id))
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to delete activity", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
