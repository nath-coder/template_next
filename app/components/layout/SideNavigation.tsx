"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  LayoutDashboard,
  Factory,
  Award,
  Users,
  Settings,
  Cog,
  Package,
  Route,
  Calendar,
  BarChart3,
  TrendingUp,
  Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/app/components/ui/button'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible'

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Producción',
    icon: Factory,
    children: [
      { title: 'Recursos', href: '/dashboard/produccion/recursos', icon: Wrench },
      { title: 'Operadores', href: '/dashboard/produccion/operadores', icon: Users },
      { title: 'Productos', href: '/dashboard/produccion/productos', icon: Package },
      { title: 'Rutas de Producción', href: '/dashboard/produccion/rutas', icon: Route },
      { title: 'Órdenes de Producción', href: '/dashboard/produccion/ordenes', icon: Calendar },
    ],
  },
  {
    title: 'Calidad',
    icon: Award,
    children: [
      { title: 'Scrap por Área', href: '/dashboard/calidad/scrap', icon: BarChart3 },
      { title: 'OEE', href: '/dashboard/calidad/oee', icon: TrendingUp },
      { title: 'Recursos de Medida', href: '/dashboard/calidad/recursos-medida', icon: Cog },
    ],
  },
]

export default function SideNavigation() {
  const [collapsed, setCollapsed] = useState(false)
  const [openItems, setOpenItems] = useState<string[]>(['Producción'])
  const pathname = usePathname()

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const isOpen = openItems.includes(item.title)
    const isActive = item.href === pathname
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                level > 0 && "pl-6",
                collapsed && "px-2"
              )}
            >
              <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!collapsed && (
            <CollapsibleContent className="space-y-1">
              <div className="ml-4">
                {item.children?.map(child => renderNavItem(child, level + 1))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      )
    }

    return (
      <Button
        key={item.title}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start text-left font-normal",
          level > 0 && "pl-6",
          collapsed && "px-2"
        )}
        asChild
      >
        <Link href={item.href || '#'}>
          <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && <span>{item.title}</span>}
        </Link>
      </Button>
    )
  }

  return (
    <div className={cn("relative flex flex-col border-r bg-background", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && <h2 className="text-lg font-semibold">Menu</h2>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-8 w-8", collapsed && "ml-0")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map(item => renderNavItem(item))}
        </div>
      </ScrollArea>
    </div>
  )
}