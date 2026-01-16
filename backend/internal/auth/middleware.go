package auth

import (
	"context"
	"hack4good-backend/internal/json"
	"net/http"
	"strings"
)

type AuthKey struct{}

func RequireRole(tokenMaker *JWTMaker, allowedRoles ...string) func(http.Handler) http.Handler {
	roleSet := make(map[string]struct{})
	for _, r := range allowedRoles {
		roleSet[r] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// 1. Read Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				json.Write(w,http.StatusUnauthorized, map[string]string{
					"error": "missing authorization header",
				})
				return
			}

			// Expect: "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				json.Write(w, http.StatusUnauthorized, map[string]string{
					"error": "invalid authorization format",
				})
				return
			}

			token := parts[1]

			// 2. Verify JWT
			claims, err := tokenMaker.VerifyToken(token)
			if err != nil {
				json.Write(w, http.StatusUnauthorized, map[string]string{
					"error": "invalid or expired token",
				})
				return
			}

			// 3. Role check
			if len(roleSet) > 0 {
				if _, ok := roleSet[claims.Role]; !ok {
					json.Write(w, http.StatusForbidden, map[string]string{
						"error": "forbidden",
					})
					return
				}
			}

			// 4. Store claims in context
			ctx := context.WithValue(r.Context(), AuthKey{}, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func FromContext(ctx context.Context) (*UserClaims, bool) {
	claims, ok := ctx.Value(AuthKey{}).(*UserClaims)
	return claims, ok
}