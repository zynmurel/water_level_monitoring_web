import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const waterDataRouter = createTRPCRouter({
  createFloatData: publicProcedure
    .input(z.object({ value: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.floatSensor.create({
        data: {
            value: parseInt(input.value)
        }
      })
    }),

createFlowData: publicProcedure
    .input(z.object({ value:  z.string()  }))
    .query(({ input,ctx }) => {
        return ctx.db.waterFlowSensor.create({
            data: {
                value: parseFloat(input.value)
            }
          })
    }),

getFloatData: publicProcedure
    .input(z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }))
    .query(async ({ input, ctx }) => {
      
      if (input.from && input.to && input.from > input.to) {
        throw new Error("The 'from' date must be less than or equal to the 'to' date.");
      }
  
      return ctx.db.floatSensor.findMany({
        where: {
          ...(input.from && { createdAt: { gte: input.from } }),
          ...(input.to && { createdAt: { lte: input.to } }),
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),
  
getWaterSensorData: publicProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
    }))
    .query(async ({ input, ctx }) => {
        
      if (input.from > input.to) {
        throw new Error("The 'from' date must be less than or equal to the 'to' date.");
      }

      return ctx.db.waterFlowSensor.findMany({
        where: {
          createdAt: {
            lte: input.to,
            gte: input.from,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),
});