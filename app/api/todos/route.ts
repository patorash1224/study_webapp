import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Todo一覧取得
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(todos);
}

// POST: Todo追加
export async function POST(request: NextRequest) {
  const { title } = await request.json();
  const newTodo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(newTodo, { status: 201 });
}

// PUT: Todo更新
export async function PUT(request: NextRequest) {
  const { id, title, completed } = await request.json();
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { title, completed },
  });
  return NextResponse.json(updatedTodo);
}

//DElETE: Todo削除
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.todo.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Todo deleted' });
}
