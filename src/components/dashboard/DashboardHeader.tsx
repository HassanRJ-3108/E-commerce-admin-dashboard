"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchDashboardData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {

  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center space-x-2">
      </div>
    </div>
  )
}

