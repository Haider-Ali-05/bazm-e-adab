-- Run this on your Neon database to set up all tables
-- Go to: https://console.neon.tech → your project → SQL Editor → paste this → Run

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    genre VARCHAR(50) DEFAULT 'غزل',
    script_type VARCHAR(20) DEFAULT 'urdu',
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'published',
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poem_likes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, poem_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: create a demo user and a few sample poems so the feed isn't empty
INSERT INTO users (username, email, password_hash, display_name, bio, role)
VALUES (
    'iqbal',
    'iqbal@bazmeadab.com',
    '$2a$12$dummy_hash_not_for_login',
    'علامہ اقبال',
    'شاعرِ مشرق',
    'admin'
) ON CONFLICT DO NOTHING;

INSERT INTO poems (author_id, title, body, genre, script_type)
SELECT id, 'کبھی اے حقیقتِ منتظر',
'کبھی اے حقیقتِ منتظر نظر آ لباسِ مجاز میں
کہ ہزاروں سجدے تڑپ رہے ہیں میری جبینِ نیاز میں
طرب آشنائے خروش ہو تو نوا ہے محرمِ گوش ہو
وہ سرود کیا کہ چھپا ہوا ہو سکوتِ پردۂ ساز میں',
'غزل', 'urdu'
FROM users WHERE username = 'iqbal'
ON CONFLICT DO NOTHING;

INSERT INTO poems (author_id, title, body, genre, script_type)
SELECT id, 'لب پہ آتی ہے دعا بن کے تمنا میری',
'لب پہ آتی ہے دعا بن کے تمنا میری
زندگی شمع کی صورت ہو خدایا میری
دور دنیا کا مرے دم سے اندھیرا ہو جائے
ہر جگہ میرے چمکنے سے اجالا ہو جائے
ہو میرے دم سے یونہی میرے وطن کی زینت
جس طرح پھول سے ہوتی ہے چمن کی زینت',
'نظم', 'urdu'
FROM users WHERE username = 'iqbal'
ON CONFLICT DO NOTHING;

INSERT INTO poems (author_id, title, body, genre, script_type)
SELECT id, 'ستاروں سے آگے جہاں اور بھی ہیں',
'ستاروں سے آگے جہاں اور بھی ہیں
ابھی عشق کے امتحاں اور بھی ہیں
تہی زندگی سے نہیں یہ فضائیں
یہاں سینکڑوں کارواں اور بھی ہیں',
'غزل', 'urdu'
FROM users WHERE username = 'iqbal'
ON CONFLICT DO NOTHING;
