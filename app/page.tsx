'use client';

import { useEffect, useState } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (!input) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = async (todo: Todo) => {
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => (t.id === updated.id ? updated : t)));
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Todo App</h1>
        <div className="flex mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="新しいタスク"
            onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
            onClick={addTodo}
          >
            追加
          </button>
        </div>
        <ul>
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <span
                className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                onClick={() => toggleTodo(todo)}
              >
                {todo.title}
              </span>
              <button
                className="ml-4 text-red-500 hover:text-red-700 transition"
                onClick={() => deleteTodo(todo.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
