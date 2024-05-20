import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          title: input.title,
        },
      });
    }),

  hello: publicProcedure.query(() => {
    return "hello";
  }),
});
