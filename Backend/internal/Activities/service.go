package activities

import (
	"context"

	//repo: to be implemented
	repo "hack4good-backend/db/sqlc"
)

// this file is for business logic (provide services)
// method
type Service interface {
	ListActivities(ctx context.Context) ([]repo.Activity, error)
	CreateActivity(ctx context.Context, req CreateActivity) (repo.Activity, error)
	DeleteActivity(ctx context.Context, id int32) error
}

// struct
type svc struct {
	repo repo.Querier //repository
}

// constructor (receive repo.Querier and return Service)
func NewService(repo repo.Querier) Service {
	return &svc{repo: repo}
}

// method
func (s *svc) ListActivities(ctx context.Context) ([]repo.Activity, error) {
	return s.repo.ListActivities(ctx)
}

func (s *svc) CreateActivity(ctx context.Context, req CreateActivity) (repo.Activity, error) {
	return s.repo.CreateActivity(ctx, repo.CreateActivityParams{
		Title:               req.Title,
		Description:         req.Description,
		Venue:               req.Venue,
		StartTime:           req.StartTime,
		EndTime:             req.EndTime,
		SignupDeadline:      req.SignupDeadline,
		ParticipantCapacity: int32(req.ParticipantCapacity),
		VolunteerCapacity:   int32(req.VolunteerCapacity),
	})
}

func (s *svc) DeleteActivity(ctx context.Context, id int32) error {
	return s.repo.DeleteActivityByID(ctx, id)
}
