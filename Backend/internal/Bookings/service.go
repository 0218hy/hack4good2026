package bookings

import (
	"context"
	"strconv"

	repo "hack4good-backend/db/sqlc"
)

type Service interface {
	ListBookings(ctx context.Context) ([]repo.Booking, error)
	CreateBooking(ctx context.Context, req CreateBooking) (repo.Booking, error)
	DeleteBookingByID(ctx context.Context, id string) error
	ListBookingsByActivityID(ctx context.Context, activityID string) ([]repo.Booking, error)
	CountBookingsByActivityID(ctx context.Context, activityID string) (int64, error)
	UpdateBooking(ctx context.Context, id string, req repo.UpdateBookingParams) (repo.Booking, error)
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
	return s.repo.CreateBooking(ctx, repo.CreateBookingParams{
		ActivityID:      req.ActivityID,
		UserID:          req.UserID,
		BookedForUserID: req.BookedForUserID,
		Role:            req.Role,
		IsPaid:          req.IsPaid,
	})	
}

func (s *svc) DeleteBookingByID(ctx context.Context, id string) error {
	id64, err := strconv.ParseInt(id, 10, 32)
    if err != nil {
        return err // invalid id string
    }
    return s.repo.DeleteBookingByID(ctx, int32(id64))
}

func (s *svc) ListBookingsByActivityID(ctx context.Context, activityID string) ([]repo.Booking, error) {
	id64, err := strconv.ParseInt(activityID, 10, 32)
    if err != nil {
        return nil, err // or wrap: fmt.Errorf("invalid activityID: %w", err)
    }
	return s.repo.ListBookingsByActivityID(ctx, int32(id64))
}

func (s *svc) CountBookingsByActivityID(ctx context.Context, activityID string) (int64, error) {
	id64, err := strconv.ParseInt(activityID, 10, 32)
    if err != nil {
        return 0, err // or wrap: fmt.Errorf("invalid activityID: %w", err)
    }
	return s.repo.CountBookingsByActivityID(ctx, int32(id64))
}

func (s *svc) UpdateBooking(ctx context.Context, id string, req repo.UpdateBookingParams) (repo.Booking, error) {
	return s.repo.UpdateBooking(ctx, req)
}

