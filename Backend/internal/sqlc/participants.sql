
--name GetParticipantsByUserID :many
SELECT
  *
FROM
  user
WHERE
  id = $1 AND role = 'participant';

--name ListParticipants :many
SELECT
  *
FROM
  user 
WHERE
  role = 'participant';

--name GetVolunteersByUserID :many
SELECT
  *
FROM
  user
WHERE
  id = $1 AND role = 'volunteer';

  --name ListVolunteers :many
SELECT
  *
FROM
  user 
WHERE
  role = 'volunteer'; 



