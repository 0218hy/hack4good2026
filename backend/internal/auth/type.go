package auth

import "github.com/golang-jwt/jwt/v5"

type User struct {
	ID int32
	Name string
	Phone string
	Role string
}

type UserClaims struct {
	ID       int32 `json:"id"`
	Name     string `json:"name"`
	Role 	 string `json:"role"`
	jwt.RegisteredClaims
}

