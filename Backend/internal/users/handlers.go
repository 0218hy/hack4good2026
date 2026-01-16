package users

import (
	"hack4good-backend/internal/auth"
	"hack4good-backend/internal/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)


type Handler struct {
    service Service
}

func NewHandler(service Service) *Handler {
    return &Handler{
		service: service,
	}
}

// Get me
func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(auth.AuthKey{}).(*auth.UserClaims)

	user, err := h.service.GetUserByID(r.Context(), claims.ID)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, user)
}

// Get user by ID 
func (h *Handler) GetUserByID(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "invalid user id", http.StatusBadRequest)
        return
    }

    user, err := h.service.GetUserByID(r.Context(), int32(id))
    if err != nil {
        http.Error(w, "user not found", http.StatusNotFound)
        return
    }

    json.Write(w, http.StatusOK, user)
}

// Create User (only by staff)
func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.Read(r, &req); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }

    if req.Name == "" || req.Phone == "" || req.Email == "" || req.Role == "" {
        http.Error(w, "missing required fields", http.StatusBadRequest)
        return
    }

    params := CreateUserParams{
        Name:  req.Name,
        Phone: req.Phone,
        Email: req.Email,
        Role:  req.Role,
    }

    user, err := h.service.CreateUser(r.Context(), params)
    if err != nil {
        log.Println(err)
        http.Error(w, "failed to create user", http.StatusInternalServerError)
        return
    }

    json.Write(w, http.StatusCreated, user)
}

// Delete user by ID (by staff)
func (h *Handler) DeleteUserByID(w http.ResponseWriter, r *http.Request) {
    idStr := chi.URLParam(r, "id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "invalid user id", http.StatusBadRequest)
        return
    }

    if err := h.service.DeleteUserByID(r.Context(), int32(id)); err != nil {
        log.Println(err)
        http.Error(w, "failed to delete user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}
