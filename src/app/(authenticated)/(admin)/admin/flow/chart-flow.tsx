/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
interface ChartDataItem {
  id: number;
  value: number;
  createdAt: string;
}
const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
const WaterFlowChart = ({
  filteredData,
}: {
  filteredData: ChartDataItem[];
}) => {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={filteredData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={"createdAt"}
          tickFormatter={(value) => format(parseISO(value), "hh:mm aaa")}
          // tickSize={10}
        />
        <YAxis />
        <ChartTooltip content={<CustomTooltipContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#1c96c5"
          fill="#15b6dd"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ChartContainer>
  );
};

const CustomTooltipContent = ({ payload, label }: any) => {
  if (payload?.length) {
    return (
      <div className="p-2">
        <p className="text-sm font-bold">{`Date: ${format(label || new Date(), "PPP hh:mm aaa")}`}</p>
        <p className="text-sm font-bold text-blue-500">{`${payload[0].value.toFixed(2)} meter/hour`}</p>
      </div>
    );
  }

  return null;
};

export default WaterFlowChart;
