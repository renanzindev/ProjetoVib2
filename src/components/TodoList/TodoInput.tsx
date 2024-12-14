import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAdd: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function TodoInput({ 
  onAdd, 
  placeholder = 'Add a new item...', 
  autoFocus = false 
}: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 px-4 py-2 rounded-lg bg-cyber-dark border border-neon-blue/30 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-neon"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-cyber-dark border border-neon-blue/50 text-neon-blue hover:shadow-neon transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
}