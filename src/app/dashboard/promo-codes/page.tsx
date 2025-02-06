import { Suspense } from "react"
import { fetchPromoCodes } from "@/lib/api"
import DashboardShell from "@/components/dashboard/DashboardShell"
import { PromoCodeList } from "@/components/dashboard/promo-codes/PromoCodeList"
import { PromoCodeForm } from "@/components/dashboard/promo-codes/PromoCodeForm"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export const metadata = {
  title: "Promo Codes",
  description: "Manage your e-commerce promo codes",
}

export default async function PromoCodesPage() {
  const promoCodes = await fetchPromoCodes()

  return (
    <DashboardShell>
      <DashboardHeader heading="Promo Codes" text="Manage your e-commerce promo codes" />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid gap-8">
          <PromoCodeForm />
          <PromoCodeList initialPromoCodes={promoCodes} />
        </div>
      </Suspense>
    </DashboardShell>
  )
}

