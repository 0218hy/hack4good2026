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
  gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), $8
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

