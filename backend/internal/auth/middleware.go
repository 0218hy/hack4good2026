package auth

import (
	"context"
	"encoding/json"
	"net/http"
)

type AuthKey struct{}

// AuthMiddleware allows passing allowed roles for a route
func AuthMiddleware(tokenMaker *JWTMaker, allowedRoles ...string) func(http.Handler) http.Handler {
	roleSet := make(map[string]struct{})
	for _, r := range allowedRoles {
		roleSet[r] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 1. Read token from request body JSON payload
			var payload struct {
				Token string `json:"token"`
			}

			if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.Token == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(
					map[string]string{"error": "missing token"},
				)
				return
			}

			// 2. Verify JWT
			claims, err := tokenMaker.VerifyToken(payload.Token)
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(
					map[string]string{"error": "invalid token"},
				)
				return
			}

			// 3. Role check
			if len(roleSet) > 0 {
				if _, ok := roleSet[claims.Role]; !ok {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusForbidden)
					json.NewEncoder(w).Encode(
						map[string]string{"error": "forbidden"},
					)
					return
				}
			}

			// 4. Pass claims to context
			ctx := context.WithValue(r.Context(), AuthKey{}, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// FromContext retrieves claims from request context
func FromContext(ctx context.Context) (*UserClaims, bool) {
	claims, ok := ctx.Value(AuthKey{}).(*UserClaims)
	return claims, ok
}
