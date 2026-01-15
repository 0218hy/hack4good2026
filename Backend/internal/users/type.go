package users

type User struct {
	ID int32
	Name string
	Email string
	Role string
}

type CreateUserParams struct {
	Name string `json:"name"`
	Phone string `json:"phonehash"`
	Email string `json:"email"`
	Role string `json:"role"`
}

type CreateUserRequest struct {
	Name string `json:"name"`
	Phone string `json:"phonehash"`
	Email string `json:"email"`
	Role string `json:"role"`
}