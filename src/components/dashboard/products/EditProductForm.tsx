"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, Plus, Loader2 } from "lucide-react"
import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
})


interface ProductFormData {
  _id: string
  title: string
  slug: string
  price: number
  originalPrice?: number
  rating: number
  description: string
  images: string[]
  colors: string[]
  sizes: string[]
  tags: string[]
  isNewArrival: boolean
  isTopSelling: boolean
  inventory: number
  productDetails: string[]
  faqs: { question: string; answer: string }[]
  category: string
  style: string
}

interface EditProductFormProps {
  productId: string
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>()
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: "colors" })
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" })
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" })
  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({ control, name: "productDetails" })
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" })

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [styles, setStyles] = useState<{ _id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>([])

  const { toast } = useToast()
  const router = useRouter()

  const title = watch("title")

  useEffect(() => {
    fetchProduct()
  }, [productId])

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

  const fetchProduct = async () => {
    try {
      const result = await client.fetch(`*[_type == "product" && _id == $productId][0]`, { productId })
      if (result) {
        Object.keys(result).forEach((key) => {
          setValue(key as keyof ProductFormData, result[key])
        })
        setImagePreview(result.images.map((image: any) => image.asset.url))
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({ title: "Error", description: "Failed to fetch product", variant: "destructive" })
    }
  }

  const fetchCategories = async () => {
    try {
      const result = await client.fetch('*[_type == "category"]{_id, name}')
      setCategories(result)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" })
    }
  }

  const fetchStyles = async () => {
    try {
      const result = await client.fetch('*[_type == "style"]{_id, name}')
      setStyles(result)
    } catch (error) {
      console.error("Error fetching styles:", error)
      toast({ title: "Error", description: "Failed to fetch styles", variant: "destructive" })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImagePreview = Array.from(files).map((file) => URL.createObjectURL(file))
      setImagePreview((prevPreview) => [...prevPreview, ...newImagePreview].slice(0, 3))
    }
  }

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true)
    try {
      const imageAssets = await Promise.all(
        data.images.map(async (image) => {
          if (image.startsWith("http")) {
            return { _type: "image", asset: { _type: "reference", _ref: image.split("/").pop()?.split("-")[1] } }
          } else {
            const response = await fetch(image)
            const blob = await response.blob()
            const asset = await client.assets.upload("image", blob)
            return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
          }
        }),
      )

      const product = {
        _type: "product",
        title: data.title,
        slug: { _type: "slug", current: data.slug },
        price: data.price,
        originalPrice: data.originalPrice,
        rating: data.rating,
        description: data.description,
        images: imageAssets,
        colors: data.colors,
        sizes: data.sizes,
        tags: data.tags,
        isNewArrival: data.isNewArrival,
        isTopSelling: data.isTopSelling,
        inventory: data.inventory,
        productDetails: data.productDetails,
        faqs: data.faqs,
        category: { _type: "reference", _ref: data.category },
        style: { _type: "reference", _ref: data.style },
      }

      await client.patch(productId).set(product).commit()
      toast({ title: "Success", description: "Product updated successfully" })
      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Edit Product</h1>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="slug">Slug (optional)</Label>
        <Input id="slug" {...register("slug")} />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" {...register("price", { required: "Price is required", min: 0 })} />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <Label htmlFor="originalPrice">Original Price</Label>
        <Input id="originalPrice" type="number" step="0.01" {...register("originalPrice", { min: 0 })} />
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input
          id="rating"
          type="number"
          step="0.1"
          {...register("rating", { required: "Rating is required", min: 0, max: 5 })}
        />
        {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description", { required: "Description is required", maxLength: 500 })}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="images">Images (up to 3)</Label>
        <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div className="flex mt-2 space-x-2">
          {imagePreview.map((src, index) => (
            <img
              key={index}
              src={src || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
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
        <Switch id="isNewArrival" {...register("isNewArrival")} />
        <Label htmlFor="isNewArrival">New Arrival</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isTopSelling" {...register("isTopSelling")} />
        <Label htmlFor="isTopSelling">Top Selling</Label>
      </div>

      <div>
        <Label htmlFor="inventory">Inventory</Label>
        <Input id="inventory" type="number" {...register("inventory", { required: "Inventory is required", min: 0 })} />
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
        <Select onValueChange={(value) => setValue("category", value)}>
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
        <Select onValueChange={(value) => setValue("style", value)}>
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
            Updating Product...
          </>
        ) : (
          "Update Product"
        )}
      </Button>
    </form>
  )
}

