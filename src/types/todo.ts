export interface TodoItem {
  id: string;
  text: string;
  parentId: string | null;
  children: TodoItem[];
  isExpanded?: boolean;
}

export interface TodoList {
  id: string;
  title: string;
  items: TodoItem[];
  createdBy: string;
  sharedWith: string[];
}