"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface PromoCode {
  _id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  startDate: string
  endDate: string
  isActive: boolean
  usageLimit: number
  usageCount: number
}

export function PromoCodeList({ initialPromoCodes }: { initialPromoCodes: PromoCode[] }) {
  const [promoCodes, setPromoCodes] = useState(initialPromoCodes)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/promo-codes/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete promo code")
      setPromoCodes(promoCodes.filter((code) => code._id !== id))
      toast({ title: "Promo code deleted successfully" })
      router.refresh()
    } catch (error) {
      toast({ title: "Error deleting promo code", variant: "destructive" })
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/promo-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (!response.ok) throw new Error("Failed to update promo code")
      setPromoCodes(promoCodes.map((code) => (code._id === id ? { ...code, isActive: !currentStatus } : code)))
      toast({ title: "Promo code updated successfully" })
      router.refresh()
    } catch (error) {
      toast({ title: "Error updating promo code", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promo Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes.map((promoCode) => (
              <TableRow key={promoCode._id}>
                <TableCell>{promoCode.code}</TableCell>
                <TableCell>
                  {promoCode.discountType === "percentage"
                    ? `${promoCode.discountValue}%`
                    : `$${promoCode.discountValue.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {new Date(promoCode.startDate).toLocaleDateString()} -
                  {new Date(promoCode.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {promoCode.usageCount} / {promoCode.usageLimit}
                </TableCell>
                <TableCell>{promoCode.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(promoCode._id, promoCode.isActive)}
                  >
                    {promoCode.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(promoCode._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

