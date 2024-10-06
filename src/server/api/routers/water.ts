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
    .query(({ input, ctx }) => {
      return ctx.db.floatSensor.findMany({orderBy: {
        createdAt: 'asc'
      }, })
    }),
    
getWaterSensorData: publicProcedure
    .query(({ input, ctx }) => {
      return ctx.db.waterFlowSensor.findMany({orderBy: {
        createdAt: 'asc'
      }, })
    })
});
