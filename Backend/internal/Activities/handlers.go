package activities

import (
	"log"
	"net/http"
	"strconv"

	repo "hack4good-backend/db/sqlc"
	"hack4good-backend/internal/json"

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

	json.Write(w, http.StatusOK, activities) //rewrote reusable handler 
	//return json from http handler 
} 


// POST /activities (create new activity)
type CreateActivity struct {
	Title               string `json:"title"`
	Description         string `json:"description"`
	Venue               string `json:"venue"`
	StartTime           pgtype.Timestamp `json:"start_time"` 
	EndTime             pgtype.Timestamp `json:"end_time"`       
	SignupDeadline      pgtype.Timestamp `json:"signup_deadline"` 
	ParticipantCapacity int    `json:"participant_capacity"`
	VolunteerCapacity   int    `json:"volunteer_capacity"`
}

// method
func (h *GetActivity) CreateActivity(w http.ResponseWriter, r *http.Request) {
	var req CreateActivity
	if err := json.Read(r,&req); err != nil {
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

	json.Write(w, http.StatusCreated, activity)
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

// PATCH /activities/{id}
func (h *GetActivity) UpdateActivity(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "activity id is required", http.StatusBadRequest)
		return
	}

	var req repo.UpdateActivityParams
	if err := json.Read(r, &req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Call service to update activity
	activity, err := h.service.UpdateActivity(r.Context(), int32(id), repo.UpdateActivityParams{
		Title:               req.Title,
		Description:         req.Description,
		Venue:               req.Venue,
		StartTime:           req.StartTime,
		EndTime:             req.EndTime,
		SignupDeadline:      req.SignupDeadline,
		ParticipantCapacity: int32(req.ParticipantCapacity),
		VolunteerCapacity:   int32(req.VolunteerCapacity),
	})
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to update activity", http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, activity)
}
