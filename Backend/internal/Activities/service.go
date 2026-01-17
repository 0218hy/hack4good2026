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
	ListActivitiesWithCounts(ctx context.Context) ([]ActivityResponse, error)
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

func (s *svc) ListActivitiesWithCounts(ctx context.Context) ([]ActivityResponse, error) {
	rows, err := s.repo.ListActivitiesWithCounts(ctx)
	if err != nil {
		return nil, err
	}

	res := make([]ActivityResponse, 0, len(rows))
	for _, r := range rows {
		res = append(res, ActivityResponse{
			ID:                          int(r.ID),
			Title:                       r.Title,
			Description:                 r.Description.(string),
			Venue:                       r.Venue,
			StartTime:                   r.StartTime,
			EndTime:                     r.EndTime,
			SignupDeadline:              r.SignupDeadline,
			ParticipantCapacity:         int(r.ParticipantCapacity),
			VolunteerCapacity:           int(r.VolunteerCapacity),
			RegisteredParticipantsCount: int(r.RegisteredParticipantsCount),
		})
	}

	return res, nil
}

