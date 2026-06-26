-- 不動産管理アプリ用の物件テーブル定義
-- Supabaseダッシュボードの「SQL Editor」でこのファイルの内容を実行してください。

-- UUIDを生成するための拡張機能を有効化する
create extension if not exists pgcrypto;

-- 物件情報を保存するテーブル
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade, -- 登録したユーザー
  name text not null,                                                  -- 物件名
  rent integer not null,                                                -- 家賃（円）
  area text not null,                                                  -- エリア名
  layout text not null,                                                -- 間取り（例：1LDK）
  created_at timestamptz not null default now()
);

-- RLS（行単位のアクセス制御）を有効化する
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
create policy "select_own_properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のuser_idでのみ新規登録できる
create policy "insert_own_properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "update_own_properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "delete_own_properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
