package participants

import (
	"context"

	repo "github.com/hack4good2026/internal/adapters/postgresql/sqlc"
)

// method
type Service interface {
	GetParticipantsByUserID(ctx context.Context, userID int64) ([]repo.User, error)
	ListParticipants(ctx context.Context) ([]repo.User, error)
	GetVolunteersByUserID(ctx context.Context, userID int64) ([]repo.User, error)
	ListVolunteers(ctx context.Context) ([]repo.User, error)
}

// struct
type svc struct {
	repo repo.Querier //repository
}

// constructor (receive repo.Querier and return Service)
func NewService(repo repo.Querier) Service {
	return &svc{repo: repo}
}

// GetParticipantsByUserID retrieves all participants for a specific user ID where role = participant
func (s *svc) GetParticipantsByUserID(ctx context.Context, userID int64) ([]repo.User, error) {
	return s.repo.GetParticipantsByUserID(ctx, userID)
}

// ListParticipants retrieves all participants where role = participant
func (s *svc) ListParticipants(ctx context.Context) ([]repo.User, error) {
	return s.repo.ListParticipants(ctx)
}

// GetVolunteersByUserID retrieves all volunteers for a specific user ID where role = volunteer
func (s *svc) GetVolunteersByUserID(ctx context.Context, userID int64) ([]repo.User, error) {
	return s.repo.GetVolunteersByUserID(ctx, userID)
}

// ListVolunteers retrieves all volunteers where role = volunteer
func (s *svc) ListVolunteers(ctx context.Context) ([]repo.User, error) {
	return s.repo.ListVolunteers(ctx)
}
