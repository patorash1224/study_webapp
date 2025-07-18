import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Todoリストを取得
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Todoの取得に失敗しました');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // 新しいTodoを作成
  const createTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/api/todos`, newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
      setError('');
    } catch (err) {
      setError('Todoの作成に失敗しました');
      console.error('Error creating todo:', err);
    }
  };

  // Todoを更新
  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_URL}/api/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      setEditingTodo(null);
      setError('');
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error('Error updating todo:', err);
    }
  };

  // Todoの完了状態を切り替え
  const toggleTodo = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/api/todos/${id}/toggle`);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      setError('');
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error('Error toggling todo:', err);
    }
  };

  // Todoを削除
  const deleteTodo = async (id) => {
    if (window.confirm('このTodoを削除しますか？')) {
      try {
        await axios.delete(`${API_URL}/api/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
        setError('');
      } catch (err) {
        setError('Todoの削除に失敗しました');
        console.error('Error deleting todo:', err);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* 新しいTodo作成フォーム */}
      <form onSubmit={createTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="タイトルを入力..."
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="todo-input"
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="説明を入力（任意）..."
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="todo-textarea"
          />
        </div>
        <button type="submit" className="btn btn-primary">Todoを追加</button>
      </form>

      {/* Todoリスト */}
      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="no-todos">Todoがありません</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingTodo === todo.id ? (
                <EditTodoForm
                  todo={todo}
                  onSave={(updatedTodo) => updateTodo(todo.id, updatedTodo)}
                  onCancel={() => setEditingTodo(null)}
                />
              ) : (
                <TodoItem
                  todo={todo}
                  onToggle={() => toggleTodo(todo.id)}
                  onEdit={() => setEditingTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 個別のTodoアイテムコンポーネント
const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  return (
    <div className="todo-content">
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="todo-checkbox"
        />
        <div className="todo-text">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && <p className="todo-description">{todo.description}</p>}
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={onEdit} className="btn btn-secondary">編集</button>
        <button onClick={onDelete} className="btn btn-danger">削除</button>
      </div>
    </div>
  );
};

// Todo編集フォームコンポーネント
const EditTodoForm = ({ todo, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    completed: todo.completed
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editData.title.trim()) return;
    onSave(editData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="todo-input"
        />
      </div>
      <div className="form-group">
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="todo-textarea"
        />
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={editData.completed}
            onChange={(e) => setEditData({ ...editData, completed: e.target.checked })}
          />
          完了済み
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">保存</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">キャンセル</button>
      </div>
    </form>
  );
};

export default App;
