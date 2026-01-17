package users

import (
	"context"
	repo "hack4good-backend/db/sqlc"
)

type Service interface {
	GetUserByID(ctx context.Context, userID int32) (repo.User, error)
	GetUserByEmail(ctx context.Context, email string) (repo.User, error)
	ListUsersByRole(ctx context.Context, role string) ([]repo.User, error)
	GetUserByPhone (ctx context.Context, phone string) (repo.User, error)
	DeleteUserByID (ctx context.Context, id int32) (error)
	CreateUser (ctx context.Context, param CreateUserParams) (repo.User, error)
}

type svc struct {
	repo *repo.Queries
}

func NewService(repo *repo.Queries) Service {
	return &svc{
		repo: repo,
	}
}

func (s *svc) GetUserByID(ctx context.Context, userID int32) (repo.User, error) {
	return s.repo.GetUserByID(ctx, userID)
}

func (s *svc) GetUserByEmail(ctx context.Context, email string) (repo.User, error) {
	return s.repo.GetUserByEmail(ctx, email)
}

func (s *svc) GetUserByPhone (ctx context.Context, phone string) (repo.User, error) {
	return s.repo.GetUserByPhone(ctx, phone)
}

func (s *svc) DeleteUserByID (ctx context.Context, id int32) (error) {
	return s.repo.DeleteUserByID(ctx, id)
}

func (s *svc) CreateUser (ctx context.Context, param CreateUserParams) (repo.User, error) {
	user, err := s.repo.CreateUser(ctx, repo.CreateUserParams{
		Name: param.Name,
		Phone: param.Phone,
		Email: param.Email,
		Role: param.Role,
	})
	if err != nil {
		return repo.User{}, err
	}

	return user, nil
}

func (s *svc) ListUsersByRole(ctx context.Context, role string) ([]repo.User, error) {
	return s.repo.ListUsersByRole(ctx, role)
}