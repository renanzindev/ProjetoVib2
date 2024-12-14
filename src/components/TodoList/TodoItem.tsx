import React, { useState, useRef } from 'react';
import { Trash2, ChevronRight, ChevronDown, Plus, GripVertical } from 'lucide-react';
import { TodoInput } from './TodoInput';
import type { TodoItem as TodoItemType } from '../../types/todo';

interface TodoItemProps {
  item: TodoItemType;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onAddSubItem: (text: string, parentId: string) => void;
  onMove: (itemId: string, newParentId: string | null) => void;
  isNested?: boolean;
}

export function TodoItem({ 
  item, 
  onDelete, 
  onToggle, 
  onAddSubItem,
  onMove,
  isNested = false 
}: TodoItemProps) {
  const [showAddSubItem, setShowAddSubItem] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const dragTimeout = useRef<number>();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsOver(false);
    if (dragTimeout.current) {
      window.clearTimeout(dragTimeout.current);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (!isOver) {
      setIsOver(true);
    }

    if (dragTimeout.current) {
      window.clearTimeout(dragTimeout.current);
    }

    dragTimeout.current = window.setTimeout(() => {
      if (!item.isExpanded) {
        onToggle(item.id);
      }
    }, 1000);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're still within the item's bounds
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return;
      }
    }
    
    setIsOver(false);
    if (dragTimeout.current) {
      window.clearTimeout(dragTimeout.current);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    
    const draggedItemId = e.dataTransfer.getData('text/plain');
    if (draggedItemId !== item.id) {
      onMove(draggedItemId, item.id);
    }
  };

  const handleAddSubItem = (text: string) => {
    onAddSubItem(text, item.id);
    setShowAddSubItem(false);
  };

  return (
    <div className={`space-y-2 ${isNested ? 'ml-6' : ''}`}>
      <div 
        ref={itemRef}
        className={`flex items-center gap-2 group rounded-lg p-2 transition-all
          ${isDragging ? 'opacity-50' : ''}
          ${isOver ? 'bg-cyber-light border-2 border-neon-blue shadow-neon' : 'hover:bg-cyber-light border border-transparent'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-neon-blue"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggle(item.id)}
          className="text-gray-500 hover:text-neon-blue"
        >
          {item.isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        <span className="flex-1 text-gray-300">{item.text}</span>
        
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
          <button
            onClick={() => setShowAddSubItem(!showAddSubItem)}
            className="text-gray-500 hover:text-neon-blue transition-colors"
            title="Add sub-item"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-500 hover:text-neon-pink transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAddSubItem && (
        <div className="ml-6 mt-2">
          <TodoInput
            onAdd={handleAddSubItem}
            placeholder="Add a sub-item..."
            autoFocus
          />
        </div>
      )}
      
      {item.isExpanded && (
        <div className="space-y-2">
          {item.children.map(child => (
            <TodoItem
              key={child.id}
              item={child}
              onDelete={onDelete}
              onToggle={onToggle}
              onAddSubItem={onAddSubItem}
              onMove={onMove}
              isNested
            />
          ))}
        </div>
      )}
    </div>
  );
}