import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { hash } from "bcryptjs"; 

export const adminRouter = createTRPCRouter({
  createAdmin: publicProcedure
    .input(z.object({ username: z.string(), name: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hash(input.password, 10);
      return ctx.db.admin.create({
        data: {
          username: input.username,
          name: input.name,
          password: hashedPassword,
        },
      });
    }),

  getAdmins: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.admin.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }),

  updateAdmin: publicProcedure
    .input(z.object({ id: z.number(), username: z.string(), name: z.string(), password: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const updateData: any = {
        username: input.username,
        name: input.name,
      };

      // Only hash the password if it's provided
      if (input.password) {
        updateData.password = await hash(input.password, 10);
      }

      return ctx.db.admin.update({
        where: { id: input.id },
        data: updateData,
      });
    }),
});
