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



