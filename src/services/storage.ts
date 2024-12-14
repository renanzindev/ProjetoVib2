import type { TodoItem, TodoList } from '../types/todo';

const STORAGE_KEY = 'vibbraneo_todo_lists';

export interface Storage {
  lists: TodoList[];
  currentListId: string | null;
}

const defaultStorage: Storage = {
  lists: [],
  currentListId: null
};

export const storage = {
  load(): Storage {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultStorage;
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      return defaultStorage;
    }
  },

  save(data: Storage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to storage:', error);
    }
  },

  saveList(list: TodoList): void {
    const data = this.load();
    const existingIndex = data.lists.findIndex(l => l.id === list.id);
    
    if (existingIndex >= 0) {
      data.lists[existingIndex] = list;
    } else {
      data.lists.push(list);
    }
    
    this.save(data);
  },

  getList(id: string): TodoList | null {
    const data = this.load();
    return data.lists.find(list => list.id === id) || null;
  },

  deleteList(id: string): void {
    const data = this.load();
    data.lists = data.lists.filter(list => list.id !== id);
    if (data.currentListId === id) {
      data.currentListId = null;
    }
    this.save(data);
  },

  setCurrentList(id: string | null): void {
    const data = this.load();
    data.currentListId = id;
    this.save(data);
  }
};