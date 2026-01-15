package authhttp

import (
	repo "hack4good-backend/db/sqlc"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type User struct {
	ID int32
	Name string
	Email string
	Role string
}

// convert DB user to response user
func toUser(u repo.User) User {
	return User{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
		Role:  u.Role,
	}
}

type RegisterUserPayload struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Email string `json:"email"`
	Role  string `json:"role"` // participant, caregiver, volunteer, staff
}

type LoginUserPayload struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type RenewAccessTokenPayload struct {
	RefreshToken string `json:"refresh_token"`
}

type RenewAccessTokenResponse struct {
	AccessToken          string    `json:"access_token"`
	AccessTokenExpiresAt time.Time `json:"access_token_expires_at"`
}

type CreateSessionParams struct {
	UserID       int32
	RefreshToken string
	IsRevoked    bool
	ExpiresAt    pgtype.Timestamp
	CreatedAt    pgtype.Timestamp
}

type SessionResponse struct {
	SessionID             int32    `json:"session_id"`
	AccessToken           string    `json:"access_token"`
	RefreshToken          string    `json:"refresh_token"`
	AccessTokenExpiresAt  time.Time `json:"access_token_expires_at"`
	RefreshTokenExpiresAt time.Time `json:"refresh_token_expires_at"`
	User                  User      `json:"user"`
}