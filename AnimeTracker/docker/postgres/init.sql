-- ========================================
-- Initialisation PostgreSQL - AnimeTracker
-- Exécuté automatiquement au premier démarrage
-- ========================================

-- Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TYPES ENUMÉRÉS
-- ========================================

CREATE TYPE user_role AS ENUM ('USER', 'MODERATEUR', 'ADMIN');
CREATE TYPE anime_status AS ENUM ('A_VOIR', 'EN_COURS', 'TERMINE', 'ABANDONNE');
CREATE TYPE visibility_type AS ENUM ('PUBLIC', 'PRIVE');
CREATE TYPE group_type AS ENUM ('OFFICIEL', 'PERSONNALISE');
CREATE TYPE notification_type AS ENUM ('NOUVEAU_FOLLOWER', 'NOUVEL_EPISODE', 'NOUVEAU_MESSAGE', 'REPONSE_GROUPE');
CREATE TYPE report_status AS ENUM ('EN_ATTENTE', 'TRAITE', 'REJETE');
CREATE TYPE reported_entity AS ENUM ('REVIEW', 'MESSAGE', 'GROUP_MESSAGE');

-- ========================================
-- TABLES PRINCIPALES
-- ========================================

CREATE TABLE "user" (
    id_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    pseudo VARCHAR(50) UNIQUE NOT NULL,
    photo VARCHAR(500),
    bio TEXT,
    role user_role DEFAULT 'USER' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_suspended BOOLEAN DEFAULT FALSE NOT NULL,
    suspension_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT chk_pseudo_length CHECK (LENGTH(pseudo) >= 3),
    CONSTRAINT chk_bio_length CHECK (LENGTH(bio) <= 500),
    CONSTRAINT chk_suspension CHECK (
        (is_suspended = FALSE) OR
        (is_suspended = TRUE AND suspension_end_date IS NOT NULL)
    )
);

CREATE TABLE genre (
    id_genre SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE studio (
    id_studio SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE anime (
    id_anime INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_english VARCHAR(255),
    synopsis TEXT,
    image_url VARCHAR(500),
    trailer_url VARCHAR(500),
    episodes INTEGER,
    score DECIMAL(3,2),
    year INTEGER,
    status VARCHAR(50),
    aired_from DATE,
    aired_to DATE,
    last_fetched_at TIMESTAMP,
    id_studio INTEGER,
    CONSTRAINT fk_anime_studio FOREIGN KEY (id_studio) REFERENCES studio(id_studio) ON DELETE SET NULL,
    CONSTRAINT chk_score CHECK (score >= 0 AND score <= 10),
    CONSTRAINT chk_year CHECK (year >= 1960 AND year <= 2100),
    CONSTRAINT chk_episodes CHECK (episodes > 0)
);

-- ========================================
-- TABLES D'ASSOCIATION
-- ========================================

CREATE TABLE user_anime (
    id_user_anime UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    id_anime INTEGER NOT NULL,
    status anime_status NOT NULL,
    episodes_watched INTEGER DEFAULT 0 NOT NULL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_user_anime_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_user_anime_anime FOREIGN KEY (id_anime) REFERENCES anime(id_anime) ON DELETE CASCADE,
    CONSTRAINT unq_user_anime UNIQUE (id_user, id_anime),
    CONSTRAINT chk_episodes_watched CHECK (episodes_watched >= 0)
);

CREATE TABLE anime_genre (
    id_anime INTEGER NOT NULL,
    id_genre INTEGER NOT NULL,
    PRIMARY KEY (id_anime, id_genre),
    CONSTRAINT fk_anime_genre_anime FOREIGN KEY (id_anime) REFERENCES anime(id_anime) ON DELETE CASCADE,
    CONSTRAINT fk_anime_genre_genre FOREIGN KEY (id_genre) REFERENCES genre(id_genre) ON DELETE CASCADE
);

-- ========================================
-- REVIEWS ET LIKES
-- ========================================

CREATE TABLE review (
    id_review UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    id_anime INTEGER NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    comment TEXT,
    visibility visibility_type DEFAULT 'PRIVE' NOT NULL,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_review_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_review_anime FOREIGN KEY (id_anime) REFERENCES anime(id_anime) ON DELETE CASCADE,
    CONSTRAINT unq_user_anime_review UNIQUE (id_user, id_anime),
    CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 10 AND MOD(rating * 2, 1) = 0),
    CONSTRAINT chk_comment_length CHECK (LENGTH(comment) <= 2000),
    CONSTRAINT chk_likes_count CHECK (likes_count >= 0)
);

CREATE TABLE review_like (
    id_review_like UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_review UUID NOT NULL,
    id_user UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_review_like_review FOREIGN KEY (id_review) REFERENCES review(id_review) ON DELETE CASCADE,
    CONSTRAINT fk_review_like_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT unq_review_user_like UNIQUE (id_review, id_user)
);

-- ========================================
-- INTERACTIONS SOCIALES
-- ========================================

CREATE TABLE follow (
    id_follow UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_follower UUID NOT NULL,
    id_following UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_follow_follower FOREIGN KEY (id_follower) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_follow_following FOREIGN KEY (id_following) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT unq_follow UNIQUE (id_follower, id_following),
    CONSTRAINT chk_no_self_follow CHECK (id_follower != id_following)
);

-- ========================================
-- MESSAGERIE PRIVÉE
-- ========================================

CREATE TABLE conversation (
    id_conversation UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE conversation_participant (
    id_participant UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_conversation UUID NOT NULL,
    id_user UUID NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_participant_conversation FOREIGN KEY (id_conversation) REFERENCES conversation(id_conversation) ON DELETE CASCADE,
    CONSTRAINT fk_participant_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT unq_conversation_user UNIQUE (id_conversation, id_user)
);

CREATE TABLE message (
    id_message UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_conversation UUID NOT NULL,
    id_sender UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_message_conversation FOREIGN KEY (id_conversation) REFERENCES conversation(id_conversation) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (id_sender) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT chk_message_content CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 1000)
);

-- ========================================
-- GROUPES DE DISCUSSION
-- ========================================

CREATE TABLE "group" (
    id_group UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type group_type NOT NULL,
    id_anime INTEGER,
    id_creator UUID NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_group_anime FOREIGN KEY (id_anime) REFERENCES anime(id_anime) ON DELETE CASCADE,
    CONSTRAINT fk_group_creator FOREIGN KEY (id_creator) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT chk_group_name CHECK (LENGTH(name) >= 3),
    CONSTRAINT chk_official_group_anime CHECK (
        (type = 'OFFICIEL' AND id_anime IS NOT NULL) OR (type = 'PERSONNALISE')
    )
);

CREATE UNIQUE INDEX unq_official_group_anime ON "group"(id_anime) WHERE type = 'OFFICIEL';

CREATE TABLE group_member (
    id_member UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_group UUID NOT NULL,
    id_user UUID NOT NULL,
    is_moderator BOOLEAN DEFAULT FALSE NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_group_member_group FOREIGN KEY (id_group) REFERENCES "group"(id_group) ON DELETE CASCADE,
    CONSTRAINT fk_group_member_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT unq_group_user UNIQUE (id_group, id_user)
);

CREATE TABLE group_message (
    id_group_message UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_group UUID NOT NULL,
    id_author UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    id_deleted_by UUID,
    CONSTRAINT fk_group_message_group FOREIGN KEY (id_group) REFERENCES "group"(id_group) ON DELETE CASCADE,
    CONSTRAINT fk_group_message_author FOREIGN KEY (id_author) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_group_message_deleted_by FOREIGN KEY (id_deleted_by) REFERENCES "user"(id_user) ON DELETE SET NULL,
    CONSTRAINT chk_group_message_content CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 1000)
);

-- ========================================
-- NOTIFICATIONS
-- ========================================

CREATE TABLE notification (
    id_notification UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID NOT NULL,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE
);

CREATE TABLE notification_preferences (
    id_preferences UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user UUID UNIQUE NOT NULL,
    new_follower BOOLEAN DEFAULT TRUE NOT NULL,
    new_episode BOOLEAN DEFAULT TRUE NOT NULL,
    new_message BOOLEAN DEFAULT TRUE NOT NULL,
    group_reply BOOLEAN DEFAULT TRUE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_preferences_user FOREIGN KEY (id_user) REFERENCES "user"(id_user) ON DELETE CASCADE
);

-- ========================================
-- MODÉRATION
-- ========================================

CREATE TABLE report (
    id_report UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_reporter UUID NOT NULL,
    reported_entity_type reported_entity NOT NULL,
    reported_entity_id UUID NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status report_status DEFAULT 'EN_ATTENTE' NOT NULL,
    id_reviewed_by UUID,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_report_reporter FOREIGN KEY (id_reporter) REFERENCES "user"(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_report_reviewer FOREIGN KEY (id_reviewed_by) REFERENCES "user"(id_user) ON DELETE SET NULL,
    CONSTRAINT chk_report_reviewed CHECK (
        (status = 'EN_ATTENTE' AND id_reviewed_by IS NULL AND reviewed_at IS NULL) OR
        (status != 'EN_ATTENTE' AND id_reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
    )
);

-- ========================================
-- INDEX DE PERFORMANCE
-- ========================================

CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_pseudo ON "user"(pseudo);
CREATE INDEX idx_anime_title ON anime(title);
CREATE INDEX idx_anime_score ON anime(score DESC);
CREATE INDEX idx_user_anime_user ON user_anime(id_user);
CREATE INDEX idx_user_anime_status ON user_anime(status);
CREATE INDEX idx_review_anime ON review(id_anime);
CREATE INDEX idx_review_visibility ON review(visibility);
CREATE INDEX idx_follow_follower ON follow(id_follower);
CREATE INDEX idx_follow_following ON follow(id_following);
CREATE INDEX idx_message_conversation ON message(id_conversation);
CREATE INDEX idx_message_created ON message(created_at DESC);
CREATE INDEX idx_group_message_group ON group_message(id_group);
CREATE INDEX idx_notification_user ON notification(id_user);
CREATE INDEX idx_notification_read ON notification(is_read);
CREATE INDEX idx_report_status ON report(status);

-- ========================================
-- TRIGGERS UPDATED_AT
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_user_anime_updated_at BEFORE UPDATE ON user_anime FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_review_updated_at BEFORE UPDATE ON review FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_conversation_updated_at BEFORE UPDATE ON conversation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_group_updated_at BEFORE UPDATE ON "group" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TRIGGERS LIKES COUNT
-- ========================================

CREATE OR REPLACE FUNCTION increment_review_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE review SET likes_count = likes_count + 1 WHERE id_review = NEW.id_review;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_review_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE review SET likes_count = likes_count - 1 WHERE id_review = OLD.id_review;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_like_insert AFTER INSERT ON review_like FOR EACH ROW EXECUTE FUNCTION increment_review_likes();
CREATE TRIGGER trg_review_like_delete AFTER DELETE ON review_like FOR EACH ROW EXECUTE FUNCTION decrement_review_likes();

-- ========================================
-- DONNÉES DE RÉFÉRENCE
-- ========================================

INSERT INTO genre (name) VALUES
    ('Action'), ('Adventure'), ('Comedy'), ('Drama'), ('Fantasy'),
    ('Horror'), ('Mystery'), ('Romance'), ('Sci-Fi'), ('Slice of Life'),
    ('Sports'), ('Supernatural'), ('Thriller'), ('Psychological'), ('Seinen'),
    ('Shounen'), ('Shoujo'), ('Mecha'), ('Music'), ('Historical');

INSERT INTO studio (name) VALUES
    ('Ufotable'), ('MAPPA'), ('Bones'), ('Wit Studio'), ('Production I.G'),
    ('Madhouse'), ('Kyoto Animation'), ('A-1 Pictures'), ('Studio Ghibli'),
    ('Trigger'), ('Shaft'), ('J.C.Staff'), ('Toei Animation'), ('Sunrise');
