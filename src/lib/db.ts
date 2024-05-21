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

export type OrderType = {
  total: number;
  items: string[];
};

export class TodoDB extends Dexie {
  todoLists!: Table<TodoList, number>;
  todoItems!: Table<TodoItem, number>;
  orders!: Table<OrderType, number>;
  constructor() {
    super("TodoDB");
    this.version(1).stores({
      todoLists: "++id",
      todoItems: "++id, todoListId",
      orders: "++id",
    });
  }

  deleteList(todoListId: number) {
    return this.transaction(
      "rw",
      this.todoItems,
      this.todoLists,
      this.orders,
      () => {
        void this.todoItems.where({ todoListId }).delete();
        void this.todoLists.delete(todoListId);
      },
    );
  }

  deleteOrder(id: number) {
    return this.transaction("rw", this.orders, () => {
      void this.orders.delete(id);
    });
  }

  deleteOrders() {
    return this.transaction("rw", this.orders, () => {
      void this.orders.clear();
    });
  }

  createOrder({ total, items }: OrderType) {
    return this.transaction("rw", this.orders, () => {
      void this.orders.add({ total, items });
    });
  }
}

export const db = new TodoDB();

db.on("populate", populate);

export function resetDatabase() {
  return db.transaction(
    "rw",
    db.todoLists,
    db.todoItems,
    db.orders,
    async () => {
      await Promise.all(db.tables.map((table) => table.clear()));
      await populate();
    },
  );
}
