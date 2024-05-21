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

const orderSchema = z.object({
  total: z.string(),
  items: z.string(),
});

type OrderType = z.infer<typeof orderSchema>;

const Home: NextPage = () => {
  const utils = api.useUtils();
  const { data: orders } = api.order.get.useQuery();
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

  const onSubmit = (data: OrderType) => {
    const total = Number(data.total);
    const items = data.items.split(" ");

    createOrder({ total, items });
  };

  return (
    <div>
      <p>online page</p>

      <ol>
        {orders?.map((order) => (
          <li key={order.id} className="list-inside list-decimal">
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
