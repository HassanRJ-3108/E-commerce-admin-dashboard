"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CustomerDetailsDialog } from "./CustomerDetailsDialoge"

interface Customer {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  orderCount: number
  wishlistCount: number
  createdAt: string
}

export function CustomerList({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const router = useRouter()

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  const handleCloseDetails = () => {
    setSelectedCustomer(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Wishlist Items</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{`${customer.firstName || ""} ${customer.lastName || ""}`}</TableCell>
                <TableCell>{customer.email || "N/A"}</TableCell>
                <TableCell>{customer.phone || "N/A"}</TableCell>
                <TableCell>{customer.orderCount || 0}</TableCell>
                <TableCell>{customer.wishlistCount || 0}</TableCell>
                <TableCell>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(customer)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {selectedCustomer && <CustomerDetailsDialog customer={selectedCustomer} onClose={handleCloseDetails} />}
    </Card>
  )
}

