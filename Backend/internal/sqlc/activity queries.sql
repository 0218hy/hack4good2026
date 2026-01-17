-- SQL queries for sqlc to generate Go code for repository layer

-- name: ListActivities :many
SELECT
  * 
FROM
  activities; 

-- name: GetActivityByID :one 
SELECT
  id
FROM
  activities
WHERE
  id = $1;

-- name: CreateActivity :one
INSERT INTO activities (
  id, title, description, venue, start_time, end_time,
  signup_deadline, participant_capacity, volunteer_capacity,
  wheelchair_accessible, sign_language_available, requires_payment,
  status, created_by, created_at
) VALUES (
    gen_random_uuid(), $1, $2, $3, $4, $5,
    $6, $7, $8,
    $9, $10, $11,
    $12, $13, $14
)
RETURNING *;

-- name: DeleteActivityByID :exec
DELETE FROM activities
WHERE id = $1;

-- name: UpdateActivityByID :exec
UPDATE activities
SET status = $2
WHERE id = $1;  