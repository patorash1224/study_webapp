FROM node:18-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ポート3001を公開
EXPOSE 3001

# アプリケーションを起動
CMD ["npm", "run", "dev"]
