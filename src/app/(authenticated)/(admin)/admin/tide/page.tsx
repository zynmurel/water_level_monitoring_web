"use client"

import { useState, useEffect } from "react"
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
import { addMinutes, format, isWithinInterval, parseISO, subMinutes, subHours, subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface ChartDataItem {
  id: number
  value: number
  createdAt: string
  updatedAt: string
}

type TimeInterval = "5m" | "10m" | "15m" | "30m" | "1h" | "24h" | "1d"

const generateChartData = (count: number, interval: TimeInterval): ChartDataItem[] => {
  const now = new Date()
  const intervalMinutes = {
    "5m": 5,
    "10m": 10,
    "15m": 15,
    "30m": 30,
    "1h": 60,
    "24h": 1440,
    "1d": 1440
  }[interval]

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    value: Math.floor(Math.random() * 1000),
    createdAt: format(subMinutes(now, (count - 1 - index) * intervalMinutes), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    updatedAt: format(subMinutes(now, (count - 1 - index) * intervalMinutes), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  }))
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function ValueOverTimeChart() {
  const [timeInterval, setTimeInterval] = useState<TimeInterval>("1h")
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [filteredData, setFilteredData] = useState<ChartDataItem[]>([])
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const dataCount = {
      "5m": 12,
      "10m": 6,
      "15m": 4,
      "30m": 2,
      "1h": 1,
      "24h": 24,
      "1d": 24
    }[timeInterval]

    const newChartData = generateChartData(dataCount, timeInterval)
    setChartData(newChartData)

    const now = new Date()
    let startDate: Date

    switch (timeInterval) {
      case "5m":
      case "10m":
      case "15m":
      case "30m":
      case "1h":
        startDate = subHours(now, 1)
        break
      case "24h":
        startDate = subDays(now, 1)
        break
      case "1d":
        startDate = subDays(now, 1)
        break
    }

    setDate({ from: startDate, to: now })
  }, [timeInterval])

  useEffect(() => {
    if (date?.from && date?.to && chartData.length > 0) {
      const filtered = chartData.filter((item) => {
        const itemDate = parseISO(item.createdAt)
        return isWithinInterval(itemDate, { start: date.from!, end: date.to! })
      })
      setFilteredData(filtered)

      const total = filtered.reduce((sum, item) => sum + item.value, 0)
      setTotalValue(total)
    }
  }, [date, chartData])

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Value Over Time Chart</CardTitle>
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
                      {format(date.from, "LLL dd, y HH:mm")} -{" "}
                      {format(date.to, "LLL dd, y HH:mm")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y HH:mm")
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
                numberOfMonths={1}
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
              accessibilityLayer
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
                tickFormatter={(value) => format(parseISO(value), "HH:mm")}
              />
              <YAxis />
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