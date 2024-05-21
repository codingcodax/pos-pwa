"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useLiveQuery } from "dexie-react-hooks";
import { db, resetDatabase } from "~/lib/db";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";

const orderSchema = z.object({
  total: z.string(),
  items: z.string(),
});

type OrderType = z.infer<typeof orderSchema>;

export default function Page() {
  const orders = useLiveQuery(() => db.orders.toArray());
  const form = useForm<OrderType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      total: "",
      items: "",
    },
  });

  const handleDeleteOrders = async () => {
    await db.deleteOrders();
  };

  const onSubmit = async (data: OrderType) => {
    const total = Number(data.total);
    const items = data.items.split(" ");

    await db.createOrder({ total, items });

    form.reset();
  };

  return (
    <div>
      <p>offline page</p>

      <Button onClick={handleDeleteOrders}>Delete orders</Button>
      <Button onClick={resetDatabase}>Pupulate DB</Button>
      <Button onClick={() => db.reset()}>Reset DB</Button>

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

      <Form {...form}>
        <form className="max-w-sm" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input placeholder="10" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Items</FormLabel>
                <FormControl>
                  <Input placeholder="hamburger" type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
