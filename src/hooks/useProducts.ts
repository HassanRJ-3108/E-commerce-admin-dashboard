import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { getProductsQuery, getProductByIdQuery, getCategoriesQuery, getStylesQuery } from "@/lib/queries"
import type { Product, Category, Style } from "@/types/Product"


import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
})

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [styles, setStyles] = useState<Style[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await client.fetch(getProductsQuery)
      setProducts(result)
    } catch (err) {
      setError("Failed to fetch products")
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await client.fetch(getCategoriesQuery)
      setCategories(result)
    } catch (err) {
      setError("Failed to fetch categories")
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const fetchStyles = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await client.fetch(getStylesQuery)
      setStyles(result)
    } catch (err) {
      setError("Failed to fetch styles")
      toast({
        title: "Error",
        description: "Failed to fetch styles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getProductById = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await client.fetch(getProductByIdQuery, { id })
        return result
      } catch (err) {
        setError("Failed to fetch product")
        toast({
          title: "Error",
          description: "Failed to fetch product details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const createProduct = useCallback(
    async (product: Omit<Product, "_id">) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await client.create({ _type: "product", ...product })
        setProducts((prev) => [...prev, result])
        toast({
          title: "Success",
          description: "Product created successfully.",
        })
        return result
      } catch (err) {
        setError("Failed to create product")
        toast({
          title: "Error",
          description: "Failed to create product. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await client.patch(id).set(updates).commit()
        setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...result } : p)))
        toast({
          title: "Success",
          description: "Product updated successfully.",
        })
        return result
      } catch (err) {
        setError("Failed to update product")
        toast({
          title: "Error",
          description: "Failed to update product. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await client.delete(id)
        setProducts((prev) => prev.filter((p) => p._id !== id))
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        })
      } catch (err) {
        setError("Failed to delete product")
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    products,
    categories,
    styles,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    fetchStyles,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

