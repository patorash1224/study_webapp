# Todo App

Docker、React、Node.js、PostgreSQLを使用したフルスタックTodoアプリケーションです。

## 技術スタック

- **フロントエンド:** React 18
- **バックエンド:** Node.js, Express
- **データベース:** PostgreSQL 15
- **コンテナ:** Docker & Docker Compose

## 機能

- ✅ Todoの作成、読み取り、更新、削除（CRUD操作）
- ✅ Todoの完了状態の切り替え
- ✅ レスポンシブデザイン
- ✅ リアルタイムでのデータ同期
- ✅ エラーハンドリング

## プロジェクト構成

```
ToDo_app/
├── docker-compose.yml      # Docker Compose設定
├── frontend/               # Reactフロントエンド
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── backend/                # Node.js/Expressバックエンド
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── init.sql
└── README.md
```

## セットアップと起動方法

### 前提条件

- Docker Desktop がインストールされていること
- Docker Compose が利用可能であること

### 起動手順

1. **プロジェクトルートに移動**
   ```bash
   cd ToDo_app
   ```

2. **Docker Composeでアプリケーションを起動**
   ```bash
   docker-compose up --build
   ```

3. **アプリケーションにアクセス**
   - フロントエンド: http://localhost:3000
   - バックエンドAPI: http://localhost:3001
   - データベース: localhost:5432

### 停止方法

```bash
docker-compose down
```

### データベースのリセット

```bash
docker-compose down -v
docker-compose up --build
```

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/todos` | 全てのTodoを取得 |
| POST | `/api/todos` | 新しいTodoを作成 |
| PUT | `/api/todos/:id` | Todoを更新 |
| PATCH | `/api/todos/:id/toggle` | Todoの完了状態を切り替え |
| DELETE | `/api/todos/:id` | Todoを削除 |

## 開発

### 個別コンテナでの開発

#### バックエンドのみ起動

```bash
docker-compose up db backend
```

#### フロントエンドの開発

```bash
cd frontend
npm install
npm start
```

### ログの確認

```bash
# 全コンテナのログ
docker-compose logs

# 特定のサービスのログ
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### データベースへの接続

```bash
docker-compose exec db psql -U postgres -d todoapp
```

## トラブルシューティング

### ポートの競合

他のアプリケーションが同じポートを使用している場合、docker-compose.ymlでポート番号を変更してください。

### データベース接続エラー

1. データベースコンテナが完全に起動するまで待機
2. 環境変数の確認
3. ネットワーク設定の確認

### パッケージの依存関係エラー

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## ライセンス

MIT License
