export interface DashboardData {
    totalRevenue: number
    orderCount: number
    productCount: number
    activeUsers: number
    revenueByMonth: { month: string; total: number }[]
    topProducts: { name: string; sales: number }[]
    recentOrders: {
      _id: string
      orderNumber: string
      totalAmount: number
      status: string
      createdAt: string
    }[]
  }
  
  