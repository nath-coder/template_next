"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      user: "Juan Pérez",
      action: "Completó orden de producción #1234",
      time: "Hace 2 minutos",
      avatar: "JP",
    },
    {
      user: "María García",
      action: "Reportó scrap en línea A",
      time: "Hace 5 minutos", 
      avatar: "MG",
    },
    {
      user: "Carlos López",
      action: "Inició mantenimiento preventivo",
      time: "Hace 15 minutos",
      avatar: "CL",
    },
    {
      user: "Ana Martín",
      action: "Validó calidad lote #5678",
      time: "Hace 30 minutos",
      avatar: "AM",
    },
  ]

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>{activity.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}