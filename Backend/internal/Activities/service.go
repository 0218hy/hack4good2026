package activities

import (
	"context"

	//repo: to be implemented
	repo "github.com/hack4good2026/internal/adapters/postgresql/sqlc"
)

// this file is for business logic (provide services)
// method 
type Service interface {
	ListActivities(ctx context.Context) ([]repo.Activity, error)
	CreateActivity(ctx context.Context, req CreateActivity) (repo.Activity, error)
	UpdateActivity(ctx context.Context, id string, req UpdateActivity) (repo.Activity, error)
	DeleteActivity(ctx context.Context, id string) error
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
	panic("unimplemented")
}

func (s *svc) UpdateActivity(ctx context.Context, id string, req UpdateActivity) (repo.Activity, error) {
	panic("unimplemented")
}

func (s *svc) DeleteActivity(ctx context.Context, id string) error {
	panic("unimplemented")
}
