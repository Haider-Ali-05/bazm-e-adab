ALTER TABLE poems ADD COLUMN IF NOT EXISTS simhash BIGINT;

CREATE TABLE IF NOT EXISTS copyright_reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL,
    poem_id INT NOT NULL,
    evidence TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plagiarism_reports (
    id SERIAL PRIMARY KEY,
    poem_id INT NOT NULL,
    original_poem_id INT,
    external_url TEXT,
    similarity_score FLOAT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
