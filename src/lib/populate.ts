import { db } from "./db";

export async function populate() {
  const todoListId = await db.todoLists.add({
    title: "To Do Today",
  });
  await db.todoItems.bulkAdd([
    {
      todoListId,
      title: "Feed the birds",
    },
    {
      todoListId,
      title: "Watch a movie",
    },
    {
      todoListId,
      title: "Have some sleep",
    },
  ]);
  await db.orders.bulkAdd([
    {
      total: 10,
      items: ["milk", "eggs"],
    },
    {
      total: 20,
      items: ["bread", "eggs"],
    },
  ]);
}
