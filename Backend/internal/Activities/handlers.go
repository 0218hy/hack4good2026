package activities

import (
	"encoding/json"
	"log"
	"net/http"

	chi "github.com/go-chi/chi/v5"
	jsonutil "github.com/hack4good2026/internal/json" 
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
	StartTime           string `json:"start_time"`     // RFC3339 format
	EndTime             string `json:"end_time"`       // RFC3339 format
	SignupDeadline      string `json:"signup_deadline"` // RFC3339 format
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

// PUT /activities/{id}
type UpdateActivity struct {
	Title               string `json:"title"`
	Description         string `json:"description"`
	Venue               string `json:"venue"`
	StartTime           string `json:"start_time"`     // RFC3339 format
	EndTime             string `json:"end_time"`       // RFC3339 format
	SignupDeadline      string `json:"signup_deadline"` // RFC3339 format
	ParticipantCapacity int    `json:"participant_capacity"`
	VolunteerCapacity   int    `json:"volunteer_capacity"`
}

// method
func (h *GetActivity) UpdateActivity(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "activity id is required", http.StatusBadRequest)
		return
	}

	var req UpdateActivity
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Title == "" || req.Venue == "" {
		http.Error(w, "title and venue are required", http.StatusBadRequest)
		return
	}

	// Call service to update activity
	activity, err := h.service.UpdateActivity(r.Context(), id, req)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to update activity", http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, activity)
}

// DELETE /activities/{id}
func (h *GetActivity) DeleteActivity(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "activity id is required", http.StatusBadRequest)
		return
	}

	// Call service to delete activity
	err := h.service.DeleteActivity(r.Context(), id)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to delete activity", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
