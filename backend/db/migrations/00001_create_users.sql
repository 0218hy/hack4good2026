-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone sql.NullString UNIQUE,
    email TEXT UNIQUE NOT NULL CHECK (email LIKE '%_@_%.__%'),
    password sql.NullString,
    role TEXT NOT NULL CHECK (role IN ('participant', 'caregiver', 'volunteer','staff')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT staff_password_required CHECK (role != 'staff' OR password_hash IS NOT NULL),
    CONSTRAINT nonstaff_phone_required CHECK (role = 'staff' OR phone IS NOT NULL)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
