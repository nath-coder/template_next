"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'

export function ProductionOverview() {
  const productionData = [
    { name: "Línea A", progress: 85, target: 1200, current: 1020 },
    { name: "Línea B", progress: 72, target: 800, current: 576 },
    { name: "Línea C", progress: 94, target: 1500, current: 1410 },
    { name: "Línea D", progress: 68, target: 600, current: 408 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {productionData.map((line) => (
        <Card key={line.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{line.name}</CardTitle>
            <CardDescription>
              {line.current} / {line.target} unidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{line.progress}%</div>
            <Progress value={line.progress} className="mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}