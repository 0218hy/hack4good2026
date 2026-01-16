package authhttp

import (
	"context"
	"fmt"
	repo "hack4good-backend/db/sqlc"

)

type Service interface {
	CreateSession(ctx context.Context, params CreateSessionParams) (*repo.Session, error)
	GetSession(ctx context.Context, sessionID string) (*repo.Session, error)
	RevokeSession(ctx context.Context, sessionID string) error
	DeleteSessionsByUserID(ctx context.Context, userID int32) error

}

type svc struct {
	repo *repo.Queries
}

func NewService(repo *repo.Queries) Service {
	return &svc{
		repo: repo,
	}
}

// create new session in DB
func (s *svc) CreateSession(ctx context.Context, params CreateSessionParams) (*repo.Session, error) {
	session, err := s.repo.CreateSession(ctx, repo.CreateSessionParams{
		UserID:       params.UserID,
		RefreshToken: params.RefreshToken,
		IsRevoked:    params.IsRevoked,
		ExpiresAt:    params.ExpiresAt,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}
	return &session, nil
}

// get session by ID
func (s *svc) GetSession(ctx context.Context, sessionID string) (*repo.Session, error) {
	session, err := s.repo.GetSession(ctx, sessionID)
	if err != nil {
		return nil, fmt.Errorf("failed to get session: %w", err)
	}
	return &session, nil
}

// revoke session
func (s *svc) RevokeSession(ctx context.Context, sessionID string) error {
	if err := s.repo.RevokeSession(ctx, sessionID); err != nil {
		return fmt.Errorf("failed to revoke session: %w", err)
	}
	return nil
}

// delete session for given user
func (s *svc) DeleteSessionsByUserID(ctx context.Context, userID int32) error {
	if err := s.repo.DeleteSessionsByUserID(ctx, userID); err != nil {
		return fmt.Errorf("failed to delete sessions for user %d: %w", userID, err)
	}
	return nil
}