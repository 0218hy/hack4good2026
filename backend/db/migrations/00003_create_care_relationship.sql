-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS care_relationships (
    participant_id INT REFERENCES users(id) ON DELETE CASCADE,
    caregiver_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (participant_id, caregiver_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS care_relationships;
-- +goose StatementEnd
