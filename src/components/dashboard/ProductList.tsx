"use client"

import { useState, useEffect } from "react"
import { client } from "@/sanity/lib/client"
import type { Product } from "@/types/Product"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await client.fetch('*[_type == "product"]')
      setProducts(result)
    }

    fetchProducts()
  }, [])

  const columns = [
    { header: "Title", accessor: "title" as keyof Product },
    { header: "Price", accessor: "price" as keyof Product },
    {
      header: "Status",
      accessor: "status" as keyof Product,
      cell: (product: Product) => (
        <Badge variant={product.status === "In Stock" ? "default" : "destructive"}>{product.status}</Badge>
      ),
    },
    { header: "Description", accessor: "description" as keyof Product },
  ]

  return <DataTable data={products} columns={columns} />
}

