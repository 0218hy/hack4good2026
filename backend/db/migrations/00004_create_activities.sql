-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description sql.NullString,
    venue TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    signup_deadline TIMESTAMP NOT NULL,
    participant_capacity INT NOT NULL CHECK (participant_capacity >= 0),
    volunteer_capacity INT NOT NULL CHECK (volunteer_capacity >= 0),
    wheelchair_accessible BOOLEAN NOT NULL DEFAULT FALSE,
    sign_language_available BOOLEAN NOT NULL DEFAULT FALSE,
    requires_payment BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'FULL', 'CLOSED', 'CANCELLED')),
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS activities;
-- +goose StatementEnd
