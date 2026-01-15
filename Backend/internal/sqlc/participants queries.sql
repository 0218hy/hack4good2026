--name ListParticipants :many
SELECT
  *
FROM
  participants; 

--name GetParticipantByID :one
SELECT
  *
FROM
  participants
WHERE
  id = $1; 

--name CreateParticipant :one 
INSERT INTO participants (
  id,
  user_id,
  name,
  email,
  phone_number
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING *;

--name GetVolunteerByUserID :one
SELECT
  *
FROM
  users
WHERE
  user_id = $1 AND role = 'volunteer';  

  --CreateVolunteer :one
INSERT INTO users (
  user_id,
  name,
  email,
  phone_number,
  role
) VALUES (
  $1,
  $2,
  $3,
  $4,
  'volunteer'
) RETURNING *;  

