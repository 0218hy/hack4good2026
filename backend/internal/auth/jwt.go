package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JWTMaker struct {
	secretKey string
}

func NewJWTMaker(secretKey string) *JWTMaker {
	return &JWTMaker{
		secretKey: secretKey,
	}
}

// generate JWT for user
func (maker *JWTMaker) CreateToken(userID int32, name, role string, duration time.Duration) (string, *UserClaims, error) {
	claims, err := NewUserClaims(userID, name, role, duration)
	if err != nil {
		return "", nil, fmt.Errorf("failed to create user claims: %w", err)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(maker.secretKey))
	if err != nil {
		return "", nil, fmt.Errorf("failed to sign token: %w", err)
	}
	return signedToken, claims, nil
}

// validates JWT
func (maker *JWTMaker) VerifyToken(tokenString string) (*UserClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}
		return []byte(maker.secretKey), nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*UserClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}	

// create JWT claims for user
func NewUserClaims(userID int32, name, role string, duration time.Duration) (*UserClaims, error) {
	tokenID, err := uuid.NewRandom()
	if err != nil {
		return nil, fmt.Errorf("failed to generate token ID: %w", err)
	}
	claims := &UserClaims{
		ID:    userID,
		Name:  name,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:       tokenID.String(),
			Subject:  fmt.Sprintf("%d", userID),
			IssuedAt: jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
		},
	}
	return claims, nil
}