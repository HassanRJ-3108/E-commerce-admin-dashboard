// app/products/page.tsx
import DashboardShell from "@/components/dashboard/DashboardShell"
import {ProductList} from "@/components/dashboard/products/ProductList"
// import ClientPage from "./ClientPage" // Client component

export default function ProductsPage() {
  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        {/* Interactive button and dialog are handled by the client component */}
        {/* <ClientPage /> */}
      </div>
      <ProductList />
    </DashboardShell>
  )
}
