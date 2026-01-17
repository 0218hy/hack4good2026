package activities

import "github.com/jackc/pgx/v5/pgtype"

type ActivityResponse struct {
	ID 					int `json:"id"`
	Title               string `json:"title"`
	Description         string `json:"description"`
	Venue               string `json:"venue"`
	StartTime           pgtype.Timestamp `json:"start_time"`     // RFC3339 format
	EndTime             pgtype.Timestamp `json:"end_time"`       // RFC3339 format
	SignupDeadline      pgtype.Timestamp `json:"signup_deadline"` // RFC3339 format
	ParticipantCapacity int    `json:"participant_capacity"`
	VolunteerCapacity   int    `json:"volunteer_capacity"`
	RegisteredParticipantsCount int `json:"registered_participants_count`
}

type CreateActivity struct {
	Title               string `json:"title"`
	Description         string `json:"description"`
	Venue               string `json:"venue"`
	StartTime           pgtype.Timestamp `json:"start_time"`     // RFC3339 format
	EndTime             pgtype.Timestamp `json:"end_time"`       // RFC3339 format
	SignupDeadline      pgtype.Timestamp `json:"signup_deadline"` // RFC3339 format
	ParticipantCapacity int    `json:"participant_capacity"`
	VolunteerCapacity   int    `json:"volunteer_capacity"`
}