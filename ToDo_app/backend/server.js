const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL接続設定
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'todoapp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// データベース接続テスト
pool.connect((err, client, release) => {
  if (err) {
    console.error('データベース接続エラー:', err.stack);
  } else {
    console.log('データベースに正常に接続されました');
    release();
  }
});

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo API is running' });
});

// すべてのTodoを取得
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Todoの取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Todoを作成
app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'タイトルは必須です' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Todoの作成エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Todoを更新
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todoが見つかりません' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Todoの更新エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Todoの完了状態を切り替え
app.patch('/api/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE todos SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todoが見つかりません' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Todoの更新エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Todoを削除
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todoが見つかりません' });
    }

    res.json({ message: 'Todoが削除されました', todo: result.rows[0] });
  } catch (err) {
    console.error('Todoの削除エラー:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 404ハンドラー
app.use((req, res) => {
  res.status(404).json({ error: 'エンドポイントが見つかりません' });
});

// エラーハンドラー
app.use((err, req, res, next) => {
  console.error('予期しないエラー:', err);
  res.status(500).json({ error: '内部サーバーエラー' });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
