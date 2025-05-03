"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartProps {
  title: string
  description?: string
  data: { month: string; value: number }[]
  valuePrefix?: string
  valueSuffix?: string
  type?: "line" | "bar"
  color?: string
}

export function AnalyticsChart({
  title,
  description,
  data,
  valuePrefix = "",
  valueSuffix = "",
  type = "line",
  color = "primary",
}: ChartProps) {
  const [timeRange, setTimeRange] = useState("6months")
  const [chartHeight, setChartHeight] = useState(200)

  useEffect(() => {
    // Adjust chart height based on window size
    const handleResize = () => {
      setChartHeight(window.innerWidth < 768 ? 150 : 200)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <svg width="100%" height={chartHeight} viewBox={`0 0 ${data.length * 50} ${chartHeight}`}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={chartHeight - (i * chartHeight) / 4}
                x2="100%"
                y2={chartHeight - (i * chartHeight) / 4}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}

            {/* Chart */}
            {type === "line" ? (
              <g>
                {/* Line */}
                <path
                  d={data
                    .map((item, i) => {
                      const x = i * 50 + 25
                      const y = chartHeight - (item.value / maxValue) * (chartHeight - 40)
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke={`hsl(var(--${color}))`}
                  strokeWidth="2"
                />

                {/* Area under the line */}
                <path
                  d={`${data
                    .map((item, i) => {
                      const x = i * 50 + 25
                      const y = chartHeight - (item.value / maxValue) * (chartHeight - 40)
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
                    })
                    .join(" ")} L ${(data.length - 1) * 50 + 25} ${chartHeight} L 25 ${chartHeight} Z`}
                  fill={`hsl(var(--${color}) / 0.1)`}
                />

                {/* Points */}
                {data.map((item, i) => {
                  const x = i * 50 + 25
                  const y = chartHeight - (item.value / maxValue) * (chartHeight - 40)
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill={`hsl(var(--${color}))`} stroke="white" strokeWidth="2" />
                  )
                })}
              </g>
            ) : (
              <g>
                {/* Bars */}
                {data.map((item, i) => {
                  const barWidth = 30
                  const x = i * 50 + 25 - barWidth / 2
                  const height = (item.value / maxValue) * (chartHeight - 40)
                  const y = chartHeight - height
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      rx="2"
                      fill={`hsl(var(--${color}) / 0.8)`}
                    />
                  )
                })}
              </g>
            )}

            {/* X-axis labels */}
            {data.map((item, i) => (
              <text
                key={i}
                x={i * 50 + 25}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {item.month}
              </text>
            ))}

            {/* Y-axis labels */}
            {[0, maxValue / 2, maxValue].map((value, i) => (
              <text
                key={i}
                x="10"
                y={chartHeight - (i * chartHeight) / 2 + 5}
                textAnchor="start"
                fontSize="12"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {valuePrefix}
                {Math.round(value)}
                {valueSuffix}
              </text>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
