-- Todoテーブルの作成
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT INTO todos (title, description, completed) VALUES
('買い物に行く', '牛乳、パン、卵を買う', false),
('プロジェクトの資料作成', 'プレゼンテーション用の資料を作成する', false),
('ジムに行く', '有酸素運動30分', true),
('本を読む', 'プログラミング関連の技術書', false);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
