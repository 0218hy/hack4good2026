package bookings

import (
	"context"

	repo "github.com/hack4good2026/internal/adapters/postgresql/sqlc"
)

type Service interface {
	ListBookings(ctx context.Context) ([]repo.Booking, error)
	CreateBooking(ctx context.Context, req CreateBooking) (repo.Booking, error)
	DeleteBooking(ctx context.Context, id string) error
	ListBookingsByActivityID(ctx context.Context, activityID string) ([]repo.Booking, error)
	CountBookingsByActivityID(ctx context.Context, activityID string) (int64, error)
}

// struct
type svc struct {
	repo repo.Querier
}

// constructor
func NewService(repo repo.Querier) Service {
	return &svc{repo: repo}
}

// methods
func (s *svc) ListBookings(ctx context.Context) ([]repo.Booking, error) {
	return s.repo.ListBookings(ctx)
}

func (s *svc) CreateBooking(ctx context.Context, req CreateBooking) (repo.Booking, error) {
	panic("unimplemented")
}

func (s *svc) DeleteBooking(ctx context.Context, id string) error {
	panic("unimplemented")
}

func (s *svc) ListBookingsByActivityID(ctx context.Context, activityID string) ([]repo.Booking, error) {
	panic("unimplemented")
}

func (s *svc) CountBookingsByActivityID(ctx context.Context, activityID string) (int64, error) {
	panic("unimplemented")
}
