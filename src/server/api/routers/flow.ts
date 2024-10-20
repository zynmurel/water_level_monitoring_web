import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { addMinutes, endOfDay, format, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
export const waterFlowRouter = createTRPCRouter({
  getWaterFlowByInterval : publicProcedure
  .input(z.object({
    date:z.date(),
    minInterval:z.number(),
})).query(async ({ ctx,input : {date, minInterval} }) => {
    let minIntervalData = 0
    const startDate = startOfDay(date)
    const minsPerDay =1440
    const createInterval = (startDate:Date, minutes:number) => {
      const endDate = addMinutes(startDate, minutes);
      return {
        start: startDate,
        end: endDate,
        duration: `${minutes} minutes`
      };
    };
    const data = await ctx.db.waterFlowSensor.findMany({
      where:{
        createdAt:{
          gte:startDate,
          lte:endOfDay(date),
        }
      }
    }).then(data=>{
      return data.map(d=>({
        ...d,
      }))
    })
const isGreaterThanOrEqual = (date1:Date, date2:Date) => {
  return isEqual(date1, date2) || isAfter(date1, date2);
};

const isLessThanOrEqual = (date1:Date, date2:Date) => {
  return isBefore(date1, date2);
};
const datas:{
  value:number;
  id:number;
  createdAt:string;
}[] = []
    do{
      const interval = createInterval(addMinutes(startDate,minIntervalData), minInterval);
      const foundDatas = data.filter(flow=>{
        return isGreaterThanOrEqual(flow.createdAt,interval.start) && isLessThanOrEqual( flow.createdAt,interval.end,)
      })
      
      datas.push({
        value : !!Number(foundDatas.reduce((curr, acc)=>{ 
          return (curr||0)+(acc.value||0) 
        },0))?Number(foundDatas.reduce((curr, acc)=>{ 
          return (curr||0)+(acc.value||0) 
        },0))/foundDatas.length:0,
        id:minIntervalData,
        createdAt:format(addMinutes(startDate,minIntervalData),"yyyy-MM-dd'T'HH:mm:ssXXX")
      })

      minIntervalData = minIntervalData+minInterval
    }while(minIntervalData<minsPerDay)
    return datas

  }),
  clearWaterflowDate : publicProcedure.mutation(async ({ ctx }) => {
    return ctx.db.waterFlowSensor.deleteMany({

    })
  }),
  clearWatertideDate : publicProcedure.mutation(async ({ ctx }) => {
    console.log("dat delete")
    return ctx.db.floatSensor.deleteMany({
      
    })
  }),
});
