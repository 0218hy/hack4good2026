-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS participant_profiles (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INT,
    membership_type TEXT CHECK (membership IN ('Ad hoc', 'once a week', 'twice a week', '3 or more times a week')),
    wheelchair BOOLEAN NOT NULL DEFAULT FALSE,
    sign_language BOOLEAN NOT NULL DEFAULT FALSE,
    other_need TEXT,
    created_At TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS participant_profiles;
-- +goose StatementEnd
