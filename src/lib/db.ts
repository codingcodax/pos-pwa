import Dexie, { type Table } from "dexie";
import { populate } from "./populate";

export type TodoItem = {
  id?: number;
  todoListId: number;
  title: string;
  done?: boolean;
};

export type TodoList = {
  id?: number;
  title: string;
};

export class TodoDB extends Dexie {
  todoLists!: Table<TodoList, number>;
  todoItems!: Table<TodoItem, number>;
  constructor() {
    super("TodoDB");
    this.version(1).stores({
      todoLists: "++id",
      todoItems: "++id, todoListId",
    });
  }

  deleteList(todoListId: number) {
    return this.transaction("rw", this.todoItems, this.todoLists, () => {
      void this.todoItems.where({ todoListId }).delete();
      void this.todoLists.delete(todoListId);
    });
  }
}

export const db = new TodoDB();

db.on("populate", populate);

export function resetDatabase() {
  return db.transaction("rw", db.todoLists, db.todoItems, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
    await populate();
  });
}
