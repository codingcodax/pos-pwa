"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { NextPage } from "next";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useNetwork } from "~/hooks/useNetwork";
import { db } from "~/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

const orderSchema = z.object({
  total: z.string(),
  items: z.string(),
});

type OrderType = z.infer<typeof orderSchema>;

const Home: NextPage = () => {
  const utils = api.useUtils();
  const { isOnline } = useNetwork();
  const { data: ordersFromCloud } = api.order.get.useQuery(undefined, {
    enabled: isOnline,
  });
  const ordersFromLocal = useLiveQuery(() => db.orders.toArray());
  const { mutate: createOrder } = api.order.create.useMutation({
    onSuccess: async () => {
      await utils.order.get.invalidate();
      form.reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<OrderType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      total: "",
      items: "",
    },
  });

  const onSubmit = async (data: OrderType) => {
    const total = Number(data.total);
    const items = data.items.split(" ");

    if (isOnline) {
      createOrder({ total, items });
      return;
    }

    await db.createOrder({ total, items });
    form.reset();
  };

  return (
    <div>
      <p>online page</p>

      <ol>
        {(ordersFromCloud ?? ordersFromLocal)?.map((order, index) => (
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
};

export default Home;
