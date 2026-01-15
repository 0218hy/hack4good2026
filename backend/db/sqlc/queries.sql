-- name: GetUserByNameAndPhone :one
SELECT id, name, phone, email, role
FROM users
WHERE LOWER(name) = LOWER($1) AND phone = $2;

-- name: CreateUser :one
INSERT INTO users (name, phone, email, role)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: CreateSession :one
INSERT INTO sessions (
    id,
    user_id,
    refresh_token,
    is_revoked,
    expires_at
) VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: GetSession :one
SELECT * FROM sessions WHERE id = $1;

-- name: RevokeSession :exec
UPDATE sessions SET is_revoked = TRUE WHERE id = $1;

-- name: DeleteSessionsByUserID :exec
DELETE FROM sessions
WHERE user_id = $1;



