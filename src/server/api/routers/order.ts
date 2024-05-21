import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createSchema = z.object({
  total: z.number(),
  items: z.array(z.string()),
});

export const orderRouter = createTRPCRouter({
  create: protectedProcedure.input(createSchema).mutation(({ ctx, input }) => {
    return ctx.db.order.create({
      data: {
        total: input.total,
        items: input.items,
      },
    });
  }),
});
