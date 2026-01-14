-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    activity_id INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booked_for_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('participant', 'volunteer')),
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    attendance_status TEXT DEFAULT 'UNKNOWN'
        CHECK (attendance_status IN ('UNKNOWN', 'PRESENT', 'ABSENT')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMP,

    CONSTRAINT no_self_book_on_behalf
        CHECK (booked_for_user_id IS NULL OR booked_for_user_id <> user_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS bookings;
-- +goose StatementEnd
