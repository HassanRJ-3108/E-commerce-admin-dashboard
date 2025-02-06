import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  useCdn: false,
  apiVersion: "2023-05-03",
})

export async function fetchDashboardData() {
  const query = `{
    "orders": *[_type == "order"] {
      totalAmount,
      _id,
      orderNumber,
      status,
      createdAt,
      "customerName": customer->firstName + " " + customer->lastName
    },
    "productCount": count(*[_type == "product"]),
    "customerCount": count(*[_type == "customer"]),
    "topProducts": *[_type == "product"] | order(rating desc)[0...5]{
      _id,
      title,
      price,
      rating
    }
  }`

  const result = await client.fetch(query)

  // Calculate total revenue and order count
  const totalRevenue = result.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const orderCount = result.orders.length

  // Get recent orders
  const recentOrders = result.orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    totalRevenue,
    orderCount,
    productCount: result.productCount,
    customerCount: result.customerCount,
    recentOrders,
    topProducts: result.topProducts,
  }
}

export async function fetchPromoCodes() {
  const query = `*[_type == "promoCode"] | order(startDate desc)`
  return client.fetch(query)
}

export async function fetchUsers() {
  const query = `*[_type == "user"] | order(registrationDate desc) {
    _id,
    email,
    name,
    role,
    isBanned,
    lastLogin,
    registrationDate,
    orderCount,
    totalSpent
  }`
  return client.fetch(query)
}

export async function fetchCustomers() {
  const query = `*[_type == "customer"] | order(createdAt desc) {
    _id,
    firstName,
    lastName,
    email,
    phone,
    addresses,
    totalOrders,
    totalWishlistItems,
    createdAt,
    updatedAt,
    "orderCount": count(orders),
    "wishlistCount": count(wishlist)
  }`
  return client.fetch(query)
}

