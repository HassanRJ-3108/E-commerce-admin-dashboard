"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/types/Product"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
})


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await client.fetch('*[_type == "product"]')
      setProducts(response)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await client.delete(productToDelete)
        setProducts(products.filter((product) => product._id !== productToDelete))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      } finally {
        setIsDeleteDialogOpen(false)
        setProductToDelete(null)
      }
    }
  }

  const columns = [
    { header: "Title", accessor: "title" as keyof Product },
    { header: "Price", accessor: "price" as keyof Product, cell: (product: Product) => `$${product.price.toFixed(2)}` },
    {
      header: "Original Price",
      accessor: "originalPrice" as keyof Product,
      cell: (product: Product) => (product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : "-"),
    },
    { header: "Rating", accessor: "rating" as keyof Product },
    { header: "Inventory", accessor: "inventory" as keyof Product },
    { header: "Category", accessor: "category.name" as keyof Product },
    { header: "Style", accessor: "style.name" as keyof Product },
    {
      header: "Tags",
      accessor: "tags" as keyof Product,
      cell: (product: Product) => product.tags?.join(", ") || "-",
    },
    {
      header: "New Arrival",
      accessor: "isNewArrival" as keyof Product,
      cell: (product: Product) => (product.isNewArrival ? "Yes" : "No"),
    },
    {
      header: "Top Selling",
      accessor: "isTopSelling" as keyof Product,
      cell: (product: Product) => (product.isTopSelling ? "Yes" : "No"),
    },
    {
      header: "Actions",
      accessor: "actions" as keyof Product,
      cell: (product: Product) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setProductToDelete(product._id)
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product List</h2>
        <Button onClick={() => router.push("/dashboard/products/add")}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>
      <DataTable data={products} columns={columns} />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

