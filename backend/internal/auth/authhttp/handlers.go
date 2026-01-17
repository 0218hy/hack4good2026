package authhttp

import (
	"hack4good-backend/internal/auth"
	"hack4good-backend/internal/json"
	"hack4good-backend/internal/users"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)


type handler struct {
	service Service
	userService users.Service
	tokenMaker *auth.JWTMaker
}

func NewHandler(service Service, userService users.Service, tokenMaker *auth.JWTMaker) *handler {
	return &handler{
		service:     service,
		userService: userService,
		tokenMaker:  tokenMaker,
	}
}

// handle registration of a new user
func (h *handler) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var payload RegisterUserPayload
	if err := json.Read(r, &payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// validate role
	validRoles := map[string]bool{"participant": true, "caregiver": true, "volunteer": true, "staff": true}
	if !validRoles[payload.Role] {
		http.Error(w, "invalid role", http.StatusBadRequest)
		return
	}

	// check if user exists (by phone or email)
	if _, err := h.userService.GetUserByPhone(r.Context(), payload.Phone); err == nil {
		http.Error(w, "phone already registered", http.StatusBadRequest)
		return
	}
	if _, err := h.userService.GetUserByEmail(r.Context(), payload.Email); err == nil {
		http.Error(w, "email already registered", http.StatusBadRequest)
		return
	}

	// hash phone
	hashedPhone, err := auth.HashPhone(payload.Phone)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to hash phone", http.StatusInternalServerError)
		return
	}

	// create user in DB
	newUser := users.CreateUserParams{
		Name:      payload.Name,
		Phone: hashedPhone,
		Email:     payload.Email,
		Role:      payload.Role,
	}

	userID, err := h.userService.CreateUser(r.Context(), newUser)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to create user", http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, map[string]interface{}{"user_id": userID})
}

// handle login using email and phone 
func (h *handler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var payload LoginUserPayload
	if err := json.Read(r, &payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// get user info from DB
	user, err := h.userService.GetUserByEmail(r.Context(), payload.Email)
	if err != nil {
		http.Error(w, "user not found", http.StatusBadRequest)
		return
	}

	// role-based credential check 
	switch user.Role {
	case "staff":
		storedPassword := user.Password.(string)
		if storedPassword == "" {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		if !auth.CheckPassword(storedPassword, []byte(payload.Password)) {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
	default:
		storedPhone := user.Phone.(string)
		if storedPhone == "" {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		if !auth.CheckPhone(storedPhone, []byte(payload.Phone)) {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
	}

	// create JWT token
	accessToken, accessClaims, err := h.tokenMaker.CreateToken(int32(user.ID), user.Name, user.Role, 15*time.Minute)
	if err != nil {
		http.Error(w, "failed to create access token", http.StatusInternalServerError)
		return
	}
	refreshToken, refreshClaims, err := h.tokenMaker.CreateToken(int32(user.ID), user.Name, user.Role, 24*time.Hour)
	if err != nil {
		http.Error(w, "failed to create refresh token", http.StatusInternalServerError)
		return
	}

	// creating session 
	session, err := h.service.CreateSession(r.Context(), CreateSessionParams{
		UserID:       int32(user.ID),
		RefreshToken: refreshToken,
		IsRevoked:    false,
		ExpiresAt:    pgtype.Timestamp{Time: refreshClaims.ExpiresAt.Time, Valid: true},
		CreatedAt:    pgtype.Timestamp{Time: time.Now(), Valid: true},
	})
	if err != nil {
		http.Error(w, "failed to create session", http.StatusInternalServerError)
		return
	}

	// return response
	resp := SessionResponse{
		SessionID:             session.ID,
		AccessToken:           accessToken,
		RefreshToken:          refreshToken,
		AccessTokenExpiresAt:  accessClaims.ExpiresAt.Time,
		RefreshTokenExpiresAt: refreshClaims.ExpiresAt.Time,
		User:                  toUser(user),
	}

	json.Write(w, http.StatusOK, resp)
}

// handle logout 
func (h *handler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	// getting claims from token 
	claims := r.Context().Value(auth.AuthKey{}).(*auth.UserClaims)
	if claims == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	if err := h.service.RevokeSession(r.Context(), claims.RegisteredClaims.ID); err != nil {
		http.Error(w, "failed to revoke session", http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, map[string]string{"message": "logged out successfully"})
}

// to renew access token for session
func (h *handler) RenewAccessToken(w http.ResponseWriter, r *http.Request) {
	var payload RenewAccessTokenPayload
	if err := json.Read(r, &payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	refreshClaims, err := h.tokenMaker.VerifyToken(payload.RefreshToken)
	if err != nil {
		http.Error(w, "invalid refresh token", http.StatusUnauthorized)
		return
	}

	session, err := h.service.GetSession(r.Context(), refreshClaims.RegisteredClaims.ID)
	if err != nil || session.IsRevoked {
		http.Error(w, "session invalid or revoked", http.StatusUnauthorized)
		return
	}

	accessToken, accessClaims, err := h.tokenMaker.CreateToken(session.UserID, refreshClaims.Name, refreshClaims.Role, 15*time.Minute)
	if err != nil {
		http.Error(w, "failed to create access token", http.StatusInternalServerError)
		return
	}

	resp := RenewAccessTokenResponse{
		AccessToken:          accessToken,
		AccessTokenExpiresAt: accessClaims.ExpiresAt.Time,
	}

	json.Write(w, http.StatusOK, resp)
}

