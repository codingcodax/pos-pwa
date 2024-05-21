"use client";

import { Button } from "~/components/ui/button";
import { useLiveQuery } from "dexie-react-hooks";
import { db, resetDatabase } from "~/lib/db";

export default function Page() {
  const orders = useLiveQuery(() => db.orders.toArray());

  const handleDeleteOrders = async () => {
    await db.deleteOrders();
  };

  return (
    <div>
      <p>offline page</p>

      <Button onClick={handleDeleteOrders}>Delete orders</Button>
      <Button onClick={resetDatabase}>Pupulate DB</Button>

      <ol>
        {orders?.map((order, index) => (
          <li
            key={`${order.total}-${index}`}
            className="list-inside list-decimal"
          >
            <span>
              {order.total}
              {order.items.map((item) => ` ${item}`)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
