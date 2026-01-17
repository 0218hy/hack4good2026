-- name: GetUserByNameAndPhone :one
SELECT id, name, phone, email, role
FROM users
WHERE LOWER(name) = LOWER($1) AND phone = $2;

-- name: CreateSession :one
INSERT INTO sessions (
    id,
    user_id,
    refresh_token,
    is_revoked,
    expires_at
) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
)
RETURNING *;

-- name: GetSession :one
SELECT * FROM sessions WHERE id = $1;

-- name: RevokeSession :exec
UPDATE sessions SET is_revoked = TRUE WHERE id = $1;

-- name: DeleteSessionsByUserID :exec
DELETE FROM sessions
WHERE user_id = $1;

-- name: CreateUser :one
INSERT INTO users (
    name,
    phone,
    email,
    role
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: GetUserByPhone :one
SELECT * FROM users
WHERE phone = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: GetAllUsers :many
SELECT * FROM users
ORDER BY created_at DESC;

-- name: DeleteUserByID :exec
DELETE FROM users
WHERE id = $1;

-- name: ListActivities :many
SELECT
  * 
FROM
  activities; 

-- name: GetActivityByID :one 
SELECT
  *
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

-- name: UpdateActivityByID :one
UPDATE activities
SET 
  title = $1,
  description = $2,
  venue = $3,
  start_time = $4,
  end_time = $5,
  signup_deadline = $6,
  participant_capacity = $7,
  volunteer_capacity = $8
WHERE id = $9
RETURNING *;

-- name: ListBookings :many
SELECT
  * 
FROM
  bookings; 

-- name: GetBookingByID :one 
SELECT
  *
FROM
  bookings
WHERE
  id = $1;

-- name: CreateBooking :one
INSERT INTO bookings (
   id, activity_id, user_id, booked_for_user_id,
   role, is_paid, attendance_status, created_at,
   cancelled_at
) VALUES (
  gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), $7
)
RETURNING *;

-- name: DeleteBookingByID :exec
DELETE FROM bookings
WHERE id = $1;   

-- name: ListBookingsByActivityID :many
SELECT
  *
FROM
  bookings
WHERE
  activity_id = $1;

  -- name: countBookingsByActivityID :one
SELECT
  COUNT(*) as count
FROM
  bookings
WHERE
  activity_id = $1;


-- name: ListActivitiesWithCounts :many
SELECT
  a.id,
  a.title,
  a.description,
  a.venue,
  a.start_time,
  a.end_time,
  a.signup_deadline,
  a.participant_capacity,
  a.volunteer_capacity,
  COUNT(b.id) AS registered_participants_count
FROM activities a
LEFT JOIN bookings b
  ON b.activity_id = a.id
  AND b.role = 'participant';   -- filter only participants
