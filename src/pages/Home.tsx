import React, { useState, useEffect } from 'react';
import { PlusCircle, Share2, Trash2 } from 'lucide-react';
import { TodoInput } from '../components/TodoList/TodoInput';
import { TodoItem } from '../components/TodoList/TodoItem';
import { FeatureCard } from '../components/FeatureCard';
import { useTodoList } from '../hooks/useTodoList';
import { storage } from '../services/storage';

export function Home() {
  const [showCreateList, setShowCreateList] = useState(false);
  const [title, setTitle] = useState('');
  const { list, items, createList, addItem, deleteItem, toggleItem, moveItem } = useTodoList();

  useEffect(() => {
    const data = storage.load();
    if (data.currentListId) {
      const currentList = storage.getList(data.currentListId);
      if (currentList) {
        setShowCreateList(true);
        setTitle(currentList.title);
      }
    }
  }, []);

  const handleCreateList = () => {
    if (title.trim()) {
      createList(title.trim(), 'current-user');
      setShowCreateList(true);
    }
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    moveItem(draggedItemId, null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-dark to-cyber-darker text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {!showCreateList ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-pulse-slow">
                Welcome to Vibbraneo ToDo
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Create, manage, and share your collaborative task lists with ease.
                Perfect for team coordination and project management.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <FeatureCard
                icon={<PlusCircle className="w-8 h-8 text-neon-blue" />}
                title="Create Lists"
                description="Start a new todo list and organize your tasks with unlimited sub-items"
              />
              <FeatureCard
                icon={<Share2 className="w-8 h-8 text-neon-purple" />}
                title="Collaborate"
                description="Share your lists with team members via email for seamless collaboration"
              />
              <FeatureCard
                icon={<Trash2 className="w-8 h-8 text-neon-pink" />}
                title="Manage"
                description="Edit, delete, and reorganize items with intuitive controls"
              />
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowCreateList(true)}
                className="px-8 py-3 rounded-lg font-semibold bg-cyber-light border border-neon-blue/50 text-neon-blue hover:shadow-neon transition-all duration-300 transform hover:-translate-y-1"
              >
                Create New List
              </button>
            </div>
          </>
        ) : (
          <div 
            className="bg-cyber-light border border-neon-blue/20 rounded-2xl shadow-neon p-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleRootDrop}
          >
            <div className="flex justify-between items-center mb-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleCreateList}
                placeholder="List Title"
                className="flex-1 mr-4 text-3xl font-bold px-4 py-2 rounded-lg bg-cyber-dark border border-neon-blue/30 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-neon"
              />
              <button
                onClick={() => {
                  setShowCreateList(false);
                  storage.setCurrentList(null);
                }}
                className="text-neon-blue hover:text-white hover:shadow-neon transition-colors duration-300"
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              <TodoInput onAdd={(text) => addItem(text)} />
              
              <div className="space-y-4">
                {items.map(item => (
                  <TodoItem
                    key={item.id}
                    item={item}
                    onDelete={deleteItem}
                    onToggle={toggleItem}
                    onAddSubItem={addItem}
                    onMove={moveItem}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}