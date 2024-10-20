"use client";
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useEffect } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import WaterFlowChart from "./chart-flow";

interface ChartDataItem {
  id: number;
  value: number;
  createdAt: string;
}

type TimeInterval = "5m" | "10m" | "15m" | "30m" | "1h";

export default function ValueOverTimeChart() {
  const [timeInterval, setTimeInterval] = useState<TimeInterval>("1h");
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filteredData, setFilteredData] = useState<ChartDataItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  const { data } = api.waterFlow.getWaterFlowByInterval.useQuery(
    {
      date: date || new Date(),
      minInterval: {
        "5m": 5,
        "10m": 10,
        "15m": 15,
        "30m": 30,
        "1h": 60,
      }[timeInterval],
    },
    {
      // enabled: !!date,
    },
  );

  useEffect(() => {
    data && setChartData(data);
  }, [data]);

  useEffect(() => {
    if (date && chartData.length > 0) {
      const filtered = chartData.filter((item) => {
        // const itemDate = parseISO(item.createdAt);
        return true;
      });
      setFilteredData(filtered);

      const total = filtered.reduce((sum, item) => sum + item.value, 0);
      setTotalValue(total);
    }
  }, [date, chartData, data]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filter Water Flow Chart</CardTitle>
        <CardDescription>
          Showing value for the selected time interval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
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
            </SelectContent>
          </Select>
        </div>
        <WaterFlowChart filteredData={filteredData} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Average : {(totalValue / filteredData.length).toLocaleString()}{" "}
              {/* <TrendingUp className="h-4 w-4" /> */}Liter per Minute
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeInterval === "5m" && "Every 5 minutes"}
              {timeInterval === "10m" && "Every 10 minutes"}
              {timeInterval === "15m" && "Every 15 minutes"}
              {timeInterval === "30m" && "Every 30 minutes"}
              {timeInterval === "1h" && "Every 1 hour"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
