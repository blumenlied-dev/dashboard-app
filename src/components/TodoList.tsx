import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import Card from "./Card";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const STORAGE_KEY = "dashboard-todos";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    try {
      return JSON.parse(saved) as Todo[];
    } catch {
      console.warn("invalid todos in localstorage");
      return [];
    }
  });

  const [input, setInput] = useState("");

  // todosの内容が変更されるたびにローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    const newTodo: Todo = {
      id: Date.now(),
      title,
      done: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleDone = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Card title="Todo List">
      <form 
        onSubmit={handleAdd}
        className="flex gap-2  mb-4"
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力してください。"
          className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 
            text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <button
          type="submit"
          className="px-3 py-2 text-sm rounded-md bg-sky-600 hover:bg-sky-500 transition"
        >
        追加
        </button>
      </form>

      <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {todos.map((todo) => (
          <li 
            key={todo.id}
            className="flex items-center justify-between gap-2"
          >
            <label className="flex items-center gap-2 flex-1">
              <input 
                type="checkbox" 
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
              />
              <span
                className={
                  "text-sm " +
                  (todo.done ? "line-through text-gray-500" : "text-gray-100")
                }
              >
                {todo.title}
              </span>
            </label>
            <button
              type="button"
              onClick={() => removeTodo(todo.id)}
              className="text-xs text-gray-400 hover:text-red-400"
            >
              削除
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-sm text-gray-400">
            まだタスクはありません。
          </li>
        )}
      </ul>
    </Card>
  );
}
