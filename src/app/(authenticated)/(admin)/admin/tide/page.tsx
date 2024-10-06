"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingUp, CalendarIcon, Clock } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, isWithinInterval, parseISO, subDays, addMinutes, startOfDay, endOfDay } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

export type ChartDataItem = {
  id: number
  value: number
  createdAt: Date
  updatedAt: Date,
  label: 'High' | 'Low';
}

type TimeInterval = "5m" | "10m" | "15m" | "30m" | "1h" | "24h" | "1d"

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const getIntervalMinutes = (interval: TimeInterval): number => {
  switch (interval) {
    case "5m": return 5
    case "10m": return 10
    case "15m": return 15
    case "30m": return 30
    case "1h": return 60
    case "24h": return 24 * 60
    case "1d": return 24 * 60
    default: return 5
  }
}



export default function ValueOverTimeChart() {
  const defaultDate = {
    from: subDays(new Date(), 5),
    to: new Date(),
  }
  const [timeInterval, setTimeInterval] = useState<TimeInterval>("5m")
  const [date, setDate] = useState<DateRange | undefined>(defaultDate)
  const [filteredData, setFilteredData] = useState<ChartDataItem[]>([])
  const [totalValue, setTotalValue] = useState(0)

  const { data: sensorData, isLoading, error } = api.water.getWaterSensorData.useQuery<ChartDataItem[]>({
    from: date?.from ? startOfDay(date.from) : startOfDay(defaultDate.from),
    to: date?.to ? endOfDay(date.to) : endOfDay(defaultDate.to),
  }, {
    enabled: !!date?.from && !!date?.to, 
  })


const processedData = useMemo(() => {
  if (!sensorData || !date?.from || !date?.to) return [];

  const intervalMinutes = getIntervalMinutes(timeInterval);
  const result: ChartDataItem[] = [];
  let currentTime = new Date(date.from);
  const endTime = new Date(date.to);

  while (currentTime <= endTime) {
    const nextTime = addMinutes(currentTime, intervalMinutes);
    const dataInInterval = sensorData.filter(item => 
      isWithinInterval(new Date(item.createdAt), {
        start: currentTime,
        end: nextTime
      })
    );

    if (dataInInterval.length > 0) {
      const averageValue = dataInInterval.reduce((sum, item) => sum + item.value, 0) / dataInInterval.length;
      result.push({
        id: currentTime.getTime(),
        value: Number(averageValue.toFixed(2)),
        createdAt: new Date(currentTime),
        updatedAt: new Date(currentTime),
        label: averageValue === 1 ? 'High' : 'Low' 
      });
    }

    currentTime = nextTime;
  }

  return result;
}, [sensorData, date, timeInterval]);
  useEffect(() => {
    setFilteredData(processedData)
    const total = processedData.reduce((sum, item) => sum + item.value, 0)
    setTotalValue(Number(total.toFixed(2)))
  }, [processedData])

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Tide Flow Chart</CardTitle>
        <CardDescription>Showing total value for the selected time interval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Select
            value={timeInterval}
            onValueChange={(value: TimeInterval) => setTimeInterval(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Every 5 minutes</SelectItem>
              <SelectItem value="10m">Every 10 minutes</SelectItem>
              <SelectItem value="15m">Every 15 minutes</SelectItem>
              <SelectItem value="30m">Every 30 minutes</SelectItem>
              <SelectItem value="1h">Every 1 hour</SelectItem>
              <SelectItem value="24h">Every 24 hours</SelectItem>
              <SelectItem value="1d">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={filteredData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="createdAt"
                tickFormatter={(value) => format(new Date(value), "MMM dd, HH:mm")}
              />
             <YAxis
                  tickFormatter={(value) => {
                    return value > 0 ? 'High' : 'Low';
                  }}
                  tickCount={2}
                />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Total value: {totalValue.toLocaleString()} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeInterval === "5m" && "Every 5 minutes"}
              {timeInterval === "10m" && "Every 10 minutes"}
              {timeInterval === "15m" && "Every 15 minutes"}
              {timeInterval === "30m" && "Every 30 minutes"}
              {timeInterval === "1h" && "Every 1 hour"}
              {timeInterval === "24h" && "Every 24 hours"}
              {timeInterval === "1d" && "Daily"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}