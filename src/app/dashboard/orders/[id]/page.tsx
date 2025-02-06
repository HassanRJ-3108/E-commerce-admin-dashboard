"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { client } from "@/sanity/lib/client"
import type { Order, Customer } from "@/types/Order"
import { Loader2 } from "lucide-react"
import type React from "react"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrderAndCustomer = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await client.fetch(
          `*[_type == "order" && _id == $id][0]{
            ...,
            customer->{
              _id,
              firstName,
              lastName,
              email,
              phone
            }
          }`,
          { id: params.id },
        )
        setOrder(result || { _id: params.id }) // Use an empty object with ID if no data
        setCustomer(result?.customer || {})
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError("Failed to load order. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderAndCustomer()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrder((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleNestedChange = (section: string, field: string, value: any) => {
    setOrder((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [field]: value,
        },
      }
    })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    setOrder((prev) => {
      if (!prev) return null
      const newItems = [...(prev.items || [])]
      newItems[index] = { ...newItems[index], [field]: value }
      return { ...prev, items: newItems }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return

    setIsLoading(true)
    setError(null)

    try {
      await client.createOrReplace(order)
      router.push("/dashboard/orders")
    } catch (error) {
      console.error("Failed to update order:", error)
      setError("Failed to update order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>{error}</p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="bg-blue-100 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <p>
          Name: {customer?.firstName || ""} {customer?.lastName || ""}
        </p>
        <p>Email: {customer?.email || ""}</p>
        <p>Phone: {customer?.phone || ""}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Order Number</label>
            <input
              type="text"
              name="orderNumber"
              value={order?.orderNumber || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={order?.status || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={order?.totalAmount || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Created At</label>
            <input
              type="datetime-local"
              name="createdAt"
              value={order?.createdAt ? new Date(order.createdAt).toISOString().slice(0, 16) : ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Shipping Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {["carrier", "service", "trackingNumber", "cost", "estimatedDays", "rateId"].map((field) => (
            <div key={field}>
              <label className="block mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "cost" || field === "estimatedDays" ? "number" : "text"}
                value={order?.shipping?.[field] || ""}
                onChange={(e) => handleNestedChange("shipping", field, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Order Items</h3>
        {(order?.items || []).map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4 p-4 border rounded">
            {["productId", "name", "quantity", "price", "color", "size"].map((field) => (
              <div key={field}>
                <label className="block mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "quantity" || field === "price" ? "number" : "text"}
                  value={item[field] || ""}
                  onChange={(e) => handleItemChange(index, field, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">Tracking Information</h3>
        <div>
          <label className="block mb-1">Tracking Status</label>
          <input
            type="text"
            value={order?.tracking?.status || ""}
            onChange={(e) => handleNestedChange("tracking", "status", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Tracking Events</h4>
          {(order?.tracking?.events || []).map((event, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded">
              {["date", "status", "description", "location"].map((field) => (
                <div key={field}>
                  <label className="block mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === "date" ? "datetime-local" : "text"}
                    value={event[field] || ""}
                    onChange={(e) => {
                      const newEvents = [...(order?.tracking?.events || [])]
                      newEvents[index] = { ...newEvents[index], [field]: e.target.value }
                      handleNestedChange("tracking", "events", newEvents)
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
            Updating...
          </>
        ) : (
          "Update Order"
        )}
      </button>
    </form>
  )
}

