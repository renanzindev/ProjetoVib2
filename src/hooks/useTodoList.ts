import { useState, useEffect } from 'react';
import type { TodoItem, TodoList } from '../types/todo';
import { storage } from '../services/storage';

export function useTodoList(listId?: string) {
  const [list, setList] = useState<TodoList | null>(null);
  const [items, setItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    if (listId) {
      const savedList = storage.getList(listId);
      if (savedList) {
        setList(savedList);
        setItems(savedList.items);
      }
    }
  }, [listId]);

  const saveChanges = (newItems: TodoItem[]) => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      items: newItems
    };
    
    setList(updatedList);
    setItems(newItems);
    storage.saveList(updatedList);
  };

  const createList = (title: string, createdBy: string) => {
    const newList: TodoList = {
      id: crypto.randomUUID(),
      title,
      items: [],
      createdBy,
      sharedWith: []
    };
    
    setList(newList);
    setItems([]);
    storage.saveList(newList);
    storage.setCurrentList(newList.id);
    
    return newList;
  };

  const addItem = (text: string, parentId: string | null = null) => {
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      text,
      parentId,
      children: [],
      isExpanded: true
    };

    setItems(prevItems => {
      const newItems = !parentId
        ? [...prevItems, newItem]
        : prevItems.map(item => addChildItem(item, parentId, newItem));
      
      saveChanges(newItems);
      return newItems;
    });
  };

  const addChildItem = (item: TodoItem, parentId: string, newChild: TodoItem): TodoItem => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...item.children, newChild],
        isExpanded: true
      };
    }

    if (item.children.length > 0) {
      return {
        ...item,
        children: item.children.map(child => addChildItem(child, parentId, newChild))
      };
    }

    return item;
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => {
      const deleteFromItems = (items: TodoItem[]): TodoItem[] => {
        return items
          .filter(item => item.id !== id)
          .map(item => ({
            ...item,
            children: deleteFromItems(item.children)
          }));
      };

      const newItems = deleteFromItems(prevItems);
      saveChanges(newItems);
      return newItems;
    });
  };

  const toggleItem = (id: string) => {
    setItems(prevItems => {
      const toggleInItems = (items: TodoItem[]): TodoItem[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          return { ...item, children: toggleInItems(item.children) };
        });
      };

      const newItems = toggleInItems(prevItems);
      saveChanges(newItems);
      return newItems;
    });
  };

  const flattenItems = (items: TodoItem[]): TodoItem[] => {
    return items.reduce<TodoItem[]>((acc, item) => {
      return [...acc, item, ...flattenItems(item.children)];
    }, []);
  };

  const moveItem = (itemId: string, newParentId: string | null) => {
    setItems(prevItems => {
      // Check if we're trying to move an item into its own descendant
      const flatItems = flattenItems(prevItems);
      const draggedItem = flatItems.find(item => item.id === itemId);
      const dropTarget = flatItems.find(item => item.id === newParentId);
      
      if (!draggedItem) return prevItems;
      
      // Prevent moving into own descendant
      if (dropTarget) {
        let current = dropTarget;
        while (current.parentId) {
          if (current.parentId === itemId) {
            return prevItems;
          }
          current = flatItems.find(item => item.id === current.parentId)!;
        }
      }

      // Remove the item from its current position
      const [itemsWithoutMoved, removedItem] = removeItemFromTree(prevItems, itemId);
      if (!removedItem) return prevItems;

      // Add the item to its new position
      let newItems: TodoItem[];
      if (newParentId === null) {
        // Move to root level
        newItems = [...itemsWithoutMoved, { ...removedItem, parentId: null }];
      } else {
        // Move as a child of another item
        newItems = addToParent(itemsWithoutMoved, newParentId, {
          ...removedItem,
          parentId: newParentId
        });
      }

      saveChanges(newItems);
      return newItems;
    });
  };

  const removeItemFromTree = (items: TodoItem[], id: string): [TodoItem[], TodoItem | null] => {
    let removedItem: TodoItem | null = null;
    
    const newItems = items.reduce<TodoItem[]>((acc, item) => {
      if (item.id === id) {
        removedItem = { ...item };
        return acc;
      }
      
      const [newChildren, removed] = removeItemFromTree(item.children, id);
      if (removed) {
        removedItem = removed;
        return [...acc, { ...item, children: newChildren }];
      }
      
      return [...acc, { ...item, children: newChildren }];
    }, []);
    
    return [newItems, removedItem];
  };

  const addToParent = (items: TodoItem[], parentId: string, itemToAdd: TodoItem): TodoItem[] => {
    return items.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [...item.children, itemToAdd],
          isExpanded: true
        };
      }
      return { ...item, children: addToParent(item.children, parentId, itemToAdd) };
    });
  };

  return {
    list,
    items,
    createList,
    addItem,
    deleteItem,
    toggleItem,
    moveItem
  };
}