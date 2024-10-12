"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import TideChart from "../_components/tide-chart"


export default function Dashboard() {
  const router = useRouter()

  const handleNavigateFlowPage = () => {
    router.push("/admin/flow")
  }

  const handleNavigateTidePage = () => {
    router.push("/admin/tide")
  }

  return (
    <div className=" space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div  onClick={handleNavigateTidePage}>
          <TideChart  />
        </div>

        <div  onClick={handleNavigateFlowPage}>
          
        </div>
      </div>
    </div>
  )
}