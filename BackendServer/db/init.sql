CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID DEFAULT (uuid_generate_v4()) PRIMARY KEY,
    name character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);