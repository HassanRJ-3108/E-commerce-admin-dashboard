import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/DashboardShell"
import ProductList from "@/components/dashboard/ProductList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products",
}

export default function ProductsPage() {
  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <ProductList />
    </DashboardShell>
  )
}

