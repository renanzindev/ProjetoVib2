import React, { useState } from 'react';
import { TodoInput } from '../components/TodoList/TodoInput';
import { TodoItem } from '../components/TodoList/TodoItem';
import type { TodoItem as TodoItemType } from '../types/todo';

export function CreateList() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<TodoItemType[]>([]);

  const handleAddItem = (text: string) => {
    const newItem: TodoItemType = {
      id: crypto.randomUUID(),
      text,
      parentId: null,
      children: [],
      isExpanded: true
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, isExpanded: !item.isExpanded }
        : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="List Title"
            className="w-full text-3xl font-bold mb-8 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <div className="space-y-6">
            <TodoInput onAdd={handleAddItem} />
            
            <div className="space-y-4">
              {items.map(item => (
                <TodoItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  onToggle={handleToggleItem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}