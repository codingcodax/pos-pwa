import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createSchema = z.object({
  total: z.number(),
  items: z.array(z.string()),
});

export const orderRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.db.order.findMany();
  }),

  create: publicProcedure.input(createSchema).mutation(({ ctx, input }) => {
    return ctx.db.order.create({
      data: {
        total: input.total,
        items: input.items,
      },
    });
  }),
});
