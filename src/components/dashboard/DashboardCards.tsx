import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react"

export function DashboardCards({ data }: { data: any }) {
  const cards = [
    { title: "Total Revenue", value: `$${(Number(data.totalRevenue) || 0).toFixed(2)}`, icon: DollarSign },
    { title: "Orders", value: data.orderCount ?? 0, icon: ShoppingCart },
    { title: "Products", value: data.productCount ?? 0, icon: Package },
    { title: "Customers", value: data.customerCount ?? 0, icon: Users },
  ];

  return (
    <>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

