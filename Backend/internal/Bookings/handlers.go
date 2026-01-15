package bookings

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	chi "github.com/go-chi/chi/v5"
	jsonutil "github.com/hack4good2026/internal/json" 
)

// GET /bookings
type GetBooking struct {
	service    Service
	countsMu   sync.RWMutex
	countsCache map[string]int64
}

func NewHandler(service Service) *GetBooking {
	return &GetBooking{
		service:     service,
		countsCache: make(map[string]int64),
	}
}

// method 
func (h *GetBooking) ListBookings(w http.ResponseWriter, r *http.Request) {
	bookings, err := h.service.ListBookings(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, bookings)
} 


// POST /bookings (create new booking)
type CreateBooking struct {
	ActivityID      string `json:"activity_id"`
	UserID          string `json:"user_id"`
	BookedForUserID string `json:"booked_for_user_id"`
	Role            string `json:"role"` // participant or volunteer
	IsPaid          bool   `json:"is_paid"`
}

func (h *GetBooking) CreateBooking(w http.ResponseWriter, r *http.Request) {
	var req CreateBooking
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Call service to create booking
	booking, err := h.service.CreateBooking(r.Context(), req)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusCreated, booking)
}

// DELETE /bookings/{id}
func (h *GetBooking) DeleteBooking(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "booking id is required", http.StatusBadRequest)
		return
	}

	// Call service to delete booking
	err := h.service.DeleteBooking(r.Context(), id)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to delete booking", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// GET /bookings/activity/{activity_id}
func (h *GetBooking) ListBookingsByActivityID(w http.ResponseWriter, r *http.Request) {
	activityID := chi.URLParam(r, "activity_id")
	if activityID == "" {
		http.Error(w, "activity id is required", http.StatusBadRequest)
		return
	}

	bookings, err := h.service.ListBookingsByActivityID(r.Context(), activityID)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to list bookings", http.StatusInternalServerError)
		return
	}

	jsonutil.Write(w, http.StatusOK, bookings)
}

// GET /bookings/activity/{activity_id}/count
func (h *GetBooking) CountBookingsByActivityID(w http.ResponseWriter, r *http.Request) {
	activityID := chi.URLParam(r, "activity_id")
	if activityID == "" {
		http.Error(w, "activity id is required", http.StatusBadRequest)
		return
	}

	count, err := h.service.CountBookingsByActivityID(r.Context(), activityID)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to count bookings", http.StatusInternalServerError)
		return
	}

	// store count in handler 
	h.countsMu.Lock()
	h.countsCache[activityID] = count
	h.countsMu.Unlock()

	// read back into a variable if needed
	h.countsMu.RLock()
	cached := h.countsCache[activityID]
	h.countsMu.RUnlock()

	jsonutil.Write(w, http.StatusOK, map[string]int64{"count": cached})
}



