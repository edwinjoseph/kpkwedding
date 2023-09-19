ALTER TABLE IF EXISTS rsvp.invites
ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE IF EXISTS rsvp.users
ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE IF EXISTS rsvp.responses
ALTER COLUMN created_at SET DEFAULT now();
