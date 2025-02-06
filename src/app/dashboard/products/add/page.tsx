"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X, Plus, Loader2 } from 'lucide-react'

import { createClient } from "@sanity/client"
import type { Product, Category, Style } from "@/types/Product"

const formatPrice = (value: string): string => {
  let cleanValue = value.replace(/[^\d.]/g, "")
  const parts = cleanValue.split(".")
  if (parts.length > 2) {
    cleanValue = parts[0] + "." + parts.slice(1).join("")
  }
  if (cleanValue.includes(".")) {
    const [whole, decimal] = cleanValue.split(".")
    return `${whole}.${decimal.padEnd(2, "0")}`
  } else {
    return `${cleanValue}.00`
  }
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
})

type ProductFormData = Omit<Product, "_id" | "createdAt" | "slug" | "reviews"> & {
  slug: string
}

export default function AddProductPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      rating: 0,
      description: "",
      images: [],
      colors: [],
      sizes: [],
      tags: [],
      isNewArrival: false,
      isTopSelling: false,
      inventory: 0,
      productDetails: [],
      faqs: [],
      category: { _type: "reference", _ref: "" },
      style: { _type: "reference", _ref: "" },
    },
  })

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: "colors" })
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" })
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" })
  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({ control, name: "productDetails" })
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" })

  const [categories, setCategories] = useState<Category[]>([])
  const [styles, setStyles] = useState<Style[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()
  const router = useRouter()

  const title = watch("title")

  useEffect(() => {
    fetchCategories()
    fetchStyles()
  }, [])

  useEffect(() => {
    if (title) {
      const slug = title.toLowerCase().replace(/\s+/g, "-").slice(0, 96)
      setValue("slug", slug)
    }
  }, [title, setValue])

  const fetchCategories = async () => {
    try {
      const result = await client.fetch('*[_type == "category"]{_id, name, "slug": slug.current}')
      setCategories(result)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" })
    }
  }

  const fetchStyles = async () => {
    try {
      const result = await client.fetch('*[_type == "style"]{_id, name, "slug": slug.current}')
      setStyles(result)
    } catch (error) {
      console.error("Error fetching styles:", error)
      toast({ title: "Error", description: "Failed to fetch styles", variant: "destructive" })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setImageFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3))
    }
  }

  const removeImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true)
    try {
      if (imageFiles.length === 0) {
        throw new Error("At least one image is required")
      }

      const imageAssets = await Promise.all(
        imageFiles.map(async (file) => {
          return client.assets.upload("image", file)
        })
      )
      const product = {
        _type: "product",
        title: data.title,
        slug: { _type: "slug", current: data.slug },
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        rating: Number(data.rating),
        description: data.description,
        images: imageAssets.map((asset) => ({
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          _key: asset._id,
        })),
        colors: data.colors.map(color => color),
        sizes: data.sizes,
        tags: data.tags,
        isNewArrival: data.isNewArrival,
        isTopSelling: data.isTopSelling,
        inventory: Math.round(Number(data.inventory)),
        productDetails: data.productDetails,
        faqs: data.faqs.map((faq, index) => ({
          ...faq,
          _key: `faq_${index}`,
        })),
        category: { _type: "reference", _ref: data.category._ref },
        style: { _type: "reference", _ref: data.style._ref },
      }

      const result = await client.create(product)
      toast({ title: "Success", description: "Product added successfully" })
      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error adding product:", error)
      if (error instanceof Error) {
        toast({ title: "Error", description: error.message || "Failed to add product", variant: "destructive" })
      } else {
        toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto my-20">
      <h1 className="text-3xl font-bold">Add New Product</h1>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug", { required: "Slug is required" })} />
        {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="text"
          {...register("price", {
            required: "Price is required",
            validate: (value) => {
              const numValue = Number(value)
              return (!isNaN(numValue) && numValue >= 0) || "Invalid price format"
            },
          })}
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <Label htmlFor="originalPrice">Original Price</Label>
        <Input
          id="originalPrice"
          type="text"
          {...register("originalPrice", {
            validate: (value) => {
              if (!value) return true
              const numValue = Number(value)
              return (!isNaN(numValue) && numValue >= 0) || "Invalid price format"
            },
          })}
        />
        {errors.originalPrice && <p className="text-red-500">{errors.originalPrice.message}</p>}
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input
          id="rating"
          type="number"
          step="0.1"
          {...register("rating", {
            required: "Rating is required",
            min: 0,
            max: 5,
            validate: (value) => !isNaN(Number(value.toString())) || "Invalid rating format",
          })}
        />
        {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description", { required: "Description is required" })} />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="images">Images (up to 3)</Label>
        <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        <div className="flex mt-2 space-x-2">
          {imageFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {imageFiles.length < 3 && (
          <Button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2">
            Add Image
          </Button>
        )}
      </div>

      <div>
        <Label>Colors</Label>
        {colorFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mt-2">
            <Input {...register(`colors.${index}`)} placeholder="Enter color" />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeColor(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendColor("")} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Color
        </Button>
      </div>

      <div>
        <Label>Sizes</Label>
        {sizeFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mt-2">
            <Input {...register(`sizes.${index}`)} placeholder="Enter size" />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeSize(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendSize("")} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Size
        </Button>
      </div>

      <div>
        <Label>Tags</Label>
        {tagFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mt-2">
            <Input {...register(`tags.${index}`)} placeholder="Enter tag" />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeTag(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendTag("")} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Tag
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isNewArrival"
          {...register("isNewArrival")}
        />
        <label htmlFor="isNewArrival">New Arrival</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTopSelling"
          {...register("isTopSelling")}
        />
        <label htmlFor="isTopSelling">Top Selling</label>
      </div>


      <div>
        <Label htmlFor="inventory">Inventory</Label>
        <Input
          id="inventory"
          type="number"
          {...register("inventory", {
            required: "Inventory is required",
            min: 0,
            validate: (value) => Number.isInteger(Number(value)) || "Inventory must be a whole number",
          })}
        />
        {errors.inventory && <p className="text-red-500">{errors.inventory.message}</p>}
      </div>

      <div>
        <Label>Product Details</Label>
        {detailFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mt-2">
            <Input {...register(`productDetails.${index}`)} placeholder="Enter product detail" />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => appendDetail("")} className="mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Product Detail
        </Button>
      </div>

      <div>
        <Label>FAQs</Label>
        {faqFields.map((field, index) => (
          <div key={field.id} className="space-y-2 mt-4">
            <Input {...register(`faqs.${index}.question`)} placeholder="Question" />
            <Textarea {...register(`faqs.${index}.answer`)} placeholder="Answer" />
            <Button type="button" variant="destructive" size="sm" onClick={() => removeFaq(index)}>
              Remove FAQ
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendFaq({ question: "", answer: "" })}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => setValue("category._ref", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}
      </div>

      <div>
        <Label htmlFor="style">Style</Label>
        <Select onValueChange={(value) => setValue("style._ref", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((style) => (
              <SelectItem key={style._id} value={style._id}>
                {style.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.style && <p className="text-red-500">{errors.style.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Product...
          </>
        ) : (
          "Add Product"
        )}
      </Button>
    </form>
  )
}