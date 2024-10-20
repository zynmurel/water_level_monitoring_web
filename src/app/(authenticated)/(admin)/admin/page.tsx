"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TideChart from "../_components/tide-chart";
import WaterFlowChart from "./flow/chart-flow";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface ChartDataItem {
  id: number;
  value: number;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<ChartDataItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [totalValue, setTotalValue] = useState(0);
  const { data } = api.waterFlow.getWaterFlowByInterval.useQuery({
    date: date,
    minInterval: 60,
  });
  const handleNavigateFlowPage = () => {
    router.push("/admin/flow");
  };

  const handleNavigateTidePage = () => {
    router.push("/admin/tide");
  };

  useEffect(() => {
    if ((data?.length || 0) > 0) {
      const filtered = data?.filter((item) => {
        // const itemDate = parseISO(item.createdAt);
        return true;
      });
      setFilteredData(filtered || []);
      const total = filtered?.reduce((sum, item) => sum + item.value, 0);
      setTotalValue(total || 0);
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div onClick={handleNavigateTidePage}>
          <TideChart mode={"VIEW"} />
        </div>

        <Card onClick={handleNavigateFlowPage}>
          <CardHeader>
            <CardTitle>Water Flow Chart</CardTitle>
            <CardDescription>
              {
                "Displaying today's water flow data for real-time monitoring and analysis."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="pb-5 text-xl font-bold text-blue-500">
              {format(new Date(), "PPPP")}
            </div>
            <WaterFlowChart filteredData={filteredData} />
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Average :{" "}
                  {(totalValue / filteredData.length).toLocaleString()}{" "}
                  {/* <TrendingUp className="h-4 w-4" /> */}Liter per Minute
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Every 1 hour
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
