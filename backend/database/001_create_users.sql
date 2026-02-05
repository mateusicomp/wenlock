CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name VARCHAR(30) NOT NULL,
  email VARCHAR(40) NOT NULL,
  registration VARCHAR(10) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_registration_unique UNIQUE (registration),

  -- regras de tamanho
  CONSTRAINT users_name_length_chk CHECK (char_length(name) BETWEEN 1 AND 30),
  CONSTRAINT users_email_length_chk CHECK (char_length(email) BETWEEN 1 AND 40),
  CONSTRAINT users_registration_length_chk CHECK (char_length(registration) BETWEEN 4 AND 10),

  -- matrícula só números
  CONSTRAINT users_registration_digits_chk CHECK (registration ~ '^[0-9]+$'),

  -- nome só letras e espaços 
  CONSTRAINT users_name_letters_chk CHECK (name ~ '^[A-Za-zÀ-ÖØ-öø-ÿ ]+$')
);

-- Índice para busca por nome, ajuda na listagem com search
CREATE INDEX IF NOT EXISTS idx_users_name ON users (name);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
