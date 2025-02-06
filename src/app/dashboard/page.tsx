import { Suspense } from "react"
import { fetchDashboardData } from "@/lib/api"
import DashboardShell from "@/components/dashboard/DashboardShell"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"

export const metadata = {
  title: "Dashboard",
  description: "E-commerce Dashboard Overview",
}

export default async function DashboardPage() {
  const dashboardData = await fetchDashboardData()

  return (
    <DashboardShell>
      <DashboardHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCards data={dashboardData} />
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <RecentOrders data={dashboardData.recentOrders} />
          <TopProducts data={dashboardData.topProducts} />
        </div>
      </Suspense>
    </DashboardShell>
  )
}

