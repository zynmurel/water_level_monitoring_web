'use client'

import React, { useState } from 'react'
import { format, startOfDay, endOfDay } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'

interface WaterFlowDataItem {
  id: number
  value: number
  createdAt: string
}

interface WaterSensorDataItem {
  id: number
  value: number
  createdAt: Date
  updatedAt: Date
}

type TimeInterval = '5m' | '10m' | '15m' | '30m' | '1h'

export default function Component() {
  const [date, setDate] = useState<Date>(new Date())
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('1h')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  const { data: waterFlowData, isLoading: isLoadingWaterFlow } = api.waterFlow.getWaterFlowByInterval.useQuery<WaterFlowDataItem[]>(
    {
      date: date,
      minInterval: {
        '5m': 5,
        '10m': 10,
        '15m': 15,
        '30m': 30,
        '1h': 60,
      }[timeInterval],
    },
    {
      enabled: !!date,
    }
  )

  const { data: sensorData, isLoading: isLoadingSensorData } = api.water.getWaterSensorData.useQuery<WaterSensorDataItem[]>(
    {
      from: startOfDay(date),
      to: endOfDay(date),
    },
    {
      enabled: !!date,
    }
  )

  const isLoading = isLoadingWaterFlow || isLoadingSensorData

  const getTideStatus = (value: number | null): 'High' | 'Low' => {
    if (value === null || value === undefined) return 'Low'
    return value > 0 ? 'High' : 'Low'
  }

  const displayTide = (): JSX.Element[] => {
    type DataItem = {
      id: number
      createdAt: string | Date
      value?: number | null
      type: 'sensor' | 'waterFlow'
    }

    const combinedData: DataItem[] = []

    if (sensorData) {
      combinedData.push(
        ...sensorData.map((item) => ({
          id: item.id,
          createdAt: item.createdAt,
          value: item.value,
          type: 'sensor' as const,
        }))
      )
    }

    if (waterFlowData) {
      combinedData.push(
        ...waterFlowData.map((item, index) => ({
          id: item.id ?? index, 
          createdAt: item.createdAt,
          value: null, 
          type: 'waterFlow' as const,
        }))
      )
    }

    combinedData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = combinedData.slice(startIndex, endIndex)

    return paginatedData.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{format(new Date(item.createdAt), 'HH:mm:ss')}</TableCell>
        <TableCell>
          {item.type === 'sensor' && item.value !== null && item.value !== undefined
            ? `${getTideStatus(item.value)}`
            : 'Low ' }
        </TableCell>
      </TableRow>
    ))
  }

  const totalPages = Math.ceil((waterFlowData?.length || 0) / itemsPerPage)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Water Data Display</CardTitle>
        <CardDescription>Showing water flow and tide data for the selected date and interval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={timeInterval} onValueChange={(value: TimeInterval) => setTimeInterval(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Every 5 minutes</SelectItem>
              <SelectItem value="10m">Every 10 minutes</SelectItem>
              <SelectItem value="15m">Every 15 minutes</SelectItem>
              <SelectItem value="30m">Every 30 minutes</SelectItem>
              <SelectItem value="1h">Every 1 hour</SelectItem>
            </SelectContent>
          </Select>
          <div className='md:ml-auto flex gap-4 justify-center items-center text-center'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">Loading data...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card >
              <CardHeader>
                <CardTitle>Water Flow Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Value (L/min)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waterFlowData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(new Date(item.createdAt), 'HH:mm:ss')}</TableCell>
                          <TableCell>{item.value.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tide Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Tide Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayTide()}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}