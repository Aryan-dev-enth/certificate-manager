"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface ChartsSectionProps {
  certificatesPerClub: Array<{ _id: string; count: number }>
  certificatesPerEvent: Array<{ _id: string; count: number }>
}

const COLORS = ["#6366f1", "#be123c", "#0891b2", "#374151", "#f8fafc"]

export function ChartsSection({ certificatesPerClub = [], certificatesPerEvent = [] }: ChartsSectionProps) {
  const clubData = certificatesPerClub.slice(0, 5).map((item) => ({
    name: item._id.replace("@college.edu", "").replace("@", ""),
    count: item.count,
  }))

  const eventData = certificatesPerEvent.slice(0, 8).map((item, index) => ({
    name: item._id.length > 15 ? `${item._id.substring(0, 15)}...` : item._id,
    fullName: item._id,
    count: item.count,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Certificates by Club</CardTitle>
          <CardDescription>Distribution of certificates across different clubs</CardDescription>
        </CardHeader>
        <CardContent>
          {clubData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clubData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Events</CardTitle>
          <CardDescription>Most popular events by certificate count</CardDescription>
        </CardHeader>
        <CardContent>
          {eventData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={eventData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {eventData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2">
                {eventData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm truncate" title={item.fullName}>
                      {item.name}
                    </span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
