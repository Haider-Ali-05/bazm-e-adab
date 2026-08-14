CREATE TABLE book_templates (
    id VARCHAR(50) PRIMARY KEY,
    name_ur VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    description TEXT,
    page_width_mm NUMERIC NOT NULL,
    page_height_mm NUMERIC NOT NULL,
    margin_top_mm NUMERIC NOT NULL DEFAULT 20,
    margin_bottom_mm NUMERIC NOT NULL DEFAULT 25,
    margin_inner_mm NUMERIC NOT NULL DEFAULT 25,
    margin_outer_mm NUMERIC NOT NULL DEFAULT 18,
    base_font_size_pt NUMERIC NOT NULL DEFAULT 16,
    line_height NUMERIC NOT NULL DEFAULT 2.2,
    sher_spacing_pt NUMERIC NOT NULL DEFAULT 24,
    header_enabled BOOLEAN DEFAULT true,
    footer_enabled BOOLEAN DEFAULT true,
    decoration_style JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    poet_name VARCHAR(200),
    template_id VARCHAR(50) REFERENCES book_templates(id),
    custom_settings JSONB DEFAULT '{}',
    font_name VARCHAR(200) DEFAULT 'Jameel Noori Nastaleeq',
    font_size_pt NUMERIC DEFAULT 16,
    page_count INTEGER,
    couplet_count INTEGER,
    poem_type VARCHAR(50),
    source_text TEXT,
    structured_data JSONB,
    pdf_url TEXT,
    pdf_generated_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_user ON books(user_id);
CREATE INDEX idx_books_status ON books(status);

-- Seed the 5 pre-built templates
INSERT INTO book_templates (id, name_ur, name_en, description, page_width_mm, page_height_mm, margin_top_mm, margin_bottom_mm, margin_inner_mm, margin_outer_mm, base_font_size_pt, line_height, sher_spacing_pt, decoration_style) VALUES
('classical', 'کلاسیکی', 'Classical', 'Ornate borders, traditional style for divans and collected works', 176, 250, 22, 28, 28, 20, 18, 2.4, 28, '{"separator": "✦", "border": true, "ornate_header": true}'),
('modern', 'جدید', 'Modern', 'Minimal clean design for contemporary poetry', 148, 210, 20, 25, 22, 18, 16, 2.2, 24, '{"separator": "—", "border": false, "ornate_header": false}'),
('calligraphic', 'خوشنویسی', 'Calligraphic', 'Wide margins, large font for gift and display editions', 210, 297, 30, 35, 35, 25, 22, 2.6, 32, '{"separator": "❋", "border": true, "ornate_header": true}'),
('pocket', 'جیبی', 'Pocket', 'Compact size for pocket-size poetry collections', 105, 148, 12, 15, 15, 12, 12, 2.0, 18, '{"separator": "·", "border": false, "ornate_header": false}'),
('digital', 'ڈیجیٹل', 'Digital', 'Screen-optimized layout for e-books and digital reading', 160, 220, 18, 22, 20, 18, 16, 2.2, 22, '{"separator": "◆", "border": false, "ornate_header": false}');
