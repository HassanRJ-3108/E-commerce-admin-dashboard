// "use client"

// import { useState, useRef } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { useRouter } from "next/navigation"
// import { toast } from "react-hot-toast"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { X, Plus, Loader2, Save } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import type { Category, Style, Product } from "@/types/Product"

// type ProductFormData = Omit<Product, "_id" | "createdAt" | "slug" | "reviews"> & {
//   slug: string
// }

// interface AddProductFormProps {
//   categories: Category[]
//   styles: Style[]
//   onSubmit: (data: ProductFormData) => Promise<void>
// }

// const formatPrice = (value: string): string => {
//   let cleanValue = value.replace(/[^\d.]/g, "")
//   const parts = cleanValue.split(".")
//   if (parts.length > 2) {
//     cleanValue = parts[0] + "." + parts.slice(1).join("")
//   }
//   if (cleanValue.includes(".")) {
//     const [whole, decimal] = cleanValue.split(".")
//     return `${whole}.${decimal.padEnd(2, "0")}`
//   } else {
//     return `${cleanValue}.00`
//   }
// }

// export function AddProductForm({ categories, styles, onSubmit }: AddProductFormProps) {
//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<ProductFormData>({
//     defaultValues: {
//       title: "",
//       slug: "",
//       price: 0,
//       originalPrice: 0,
//       rating: 0,
//       description: "",
//       images: [],
//       colors: [],
//       sizes: [],
//       tags: [],
//       isNewArrival: false,
//       isTopSelling: false,
//       inventory: 0,
//       productDetails: [],
//       faqs: [],
//       category: { _type: "reference", _ref: "" },
//       style: { _type: "reference", _ref: "" },
//     },
//   })

//   const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: "colors" })
//   const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" })
//   const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" })
//   const {
//     fields: detailFields,
//     append: appendDetail,
//     remove: removeDetail,
//   } = useFieldArray({ control, name: "productDetails" })
//   const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" })

//   const [isLoading, setIsLoading] = useState(false)
//   const [imageFiles, setImageFiles] = useState<File[]>([])
//   const [priceEditing, setPriceEditing] = useState(false)
//   const [originalPriceEditing, setOriginalPriceEditing] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const router = useRouter()

//   const title = watch("title")

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (files) {
//       const newFiles = Array.from(files)
//       setImageFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3))
//     }
//   }

//   const removeImage = (index: number) => {
//     setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
//   }

//   const handlePriceChange = (field: "price" | "originalPrice", value: string) => {
//     const formattedValue = formatPrice(value)
//     setValue(field, Number.parseFloat(formattedValue))
//     if (field === "price") {
//       setPriceEditing(false)
//     } else {
//       setOriginalPriceEditing(false)
//     }
//   }

//   const handleFormSubmit = async (data: ProductFormData) => {
//     setIsLoading(true)
//     try {
//       if (imageFiles.length === 0) {
//         throw new Error("At least one image is required")
//       }

//       await onSubmit({
//         ...data,
//         images: imageFiles,
//         slug: { _type: "slug", current: data.slug },
//       })

//       toast.success("Product added successfully")
//       router.push("/dashboard/products")
//     } catch (error) {
//       console.error("Error adding product:", error)
//       toast.error("Failed to add product")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" {...register("title", { required: "Title is required" })} />
//               {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor="slug">Slug</Label>
//               <Input id="slug" {...register("slug", { required: "Slug is required" })} />
//               {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="price">Price</Label>
//               <div className="flex items-center space-x-2">
//                 <Input
//                   id="price"
//                   type="text"
//                   {...register("price", {
//                     required: "Price is required",
//                     validate: (value) => {
//                       const numValue = Number.parseFloat(value.toString())
//                       return (!isNaN(numValue) && numValue >= 0) || "Invalid price format"
//                     },
//                   })}
//                   disabled={!priceEditing}
//                   onChange={(e) => handlePriceChange("price", e.target.value)}
//                 />
//                 <Button type="button" onClick={() => setPriceEditing(!priceEditing)}>
//                   {priceEditing ? <Save className="h-4 w-4" /> : "Edit"}
//                 </Button>
//               </div>
//               {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor="originalPrice">Original Price</Label>
//               <div className="flex items-center space-x-2">
//                 <Input
//                   id="originalPrice"
//                   type="text"
//                   {...register("originalPrice", {
//                     validate: (value) => {
//                       if (!value) return true
//                       const numValue = Number.parseFloat(value.toString())
//                       return (!isNaN(numValue) && numValue >= 0) || "Invalid price format"
//                     },
//                   })}
//                   disabled={!originalPriceEditing}
//                   onChange={(e) => handlePriceChange("originalPrice", e.target.value)}
//                 />
//                 <Button type="button" onClick={() => setOriginalPriceEditing(!originalPriceEditing)}>
//                   {originalPriceEditing ? <Save className="h-4 w-4" /> : "Edit"}
//                 </Button>
//               </div>
//               {errors.originalPrice && <p className="text-red-500 text-sm mt-1">{errors.originalPrice.message}</p>}
//             </div>
//           </div>
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea id="description" {...register("description", { required: "Description is required" })} />
//             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Images</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div>
//             <Label htmlFor="images">Product Images (up to 3)</Label>
//             <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
//             <div className="flex mt-2 space-x-2">
//               {imageFiles.map((file, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={URL.createObjectURL(file) || "/placeholder.svg"}
//                     alt={`Preview ${index + 1}`}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {imageFiles.length < 3 && (
//               <Button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2">
//                 Add Image
//               </Button>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Product Details</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>Colors</Label>
//             {colorFields.map((field, index) => (
//               <div key={field.id} className="flex items-center space-x-2 mt-2">
//                 <Input {...register(`colors.${index}.name`)} placeholder="Enter color" />
//                 <Button type="button" variant="destructive" size="icon" onClick={() => removeColor(index)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => appendColor({ _key: `color_${colorFields.length}`, name: "" })}
//               className="mt-2"
//             >
//               <Plus className="h-4 w-4 mr-2" /> Add Color
//             </Button>
//           </div>
//           <div>
//             <Label>Sizes</Label>
//             {sizeFields.map((field, index) => (
//               <div key={field.id} className="flex items-center space-x-2 mt-2">
//                 <Input {...register(`sizes.${index}`)} placeholder="Enter size" />
//                 <Button type="button" variant="destructive" size="icon" onClick={() => removeSize(index)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             <Button type="button" variant="outline" size="sm" onClick={() => appendSize("")} className="mt-2">
//               <Plus className="h-4 w-4 mr-2" /> Add Size
//             </Button>
//           </div>
//           <div>
//             <Label>Tags</Label>
//             {tagFields.map((field, index) => (
//               <div key={field.id} className="flex items-center space-x-2 mt-2">
//                 <Input {...register(`tags.${index}`)} placeholder="Enter tag" />
//                 <Button type="button" variant="destructive" size="icon" onClick={() => removeTag(index)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             <Button type="button" variant="outline" size="sm" onClick={() => appendTag("")} className="mt-2">
//               <Plus className="h-4 w-4 mr-2" /> Add Tag
//             </Button>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center space-x-2">
//               <Switch id="isNewArrival" {...register("isNewArrival")} />
//               <Label htmlFor="isNewArrival">New Arrival</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Switch id="isTopSelling" {...register("isTopSelling")} />
//               <Label htmlFor="isTopSelling">Top Selling</Label>
//             </div>
//           </div>
//           <div>
//             <Label htmlFor="inventory">Inventory</Label>
//             <Input
//               id="inventory"
//               type="number"
//               {...register("inventory", {
//                 required: "Inventory is required",
//                 min: 0,
//                 validate: (value) => Number.isInteger(Number(value)) || "Inventory must be a whole number",
//               })}
//             />
//             {errors.inventory && <p className="text-red-500 text-sm mt-1">{errors.inventory.message}</p>}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Additional Information</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>Product Details</Label>
//             {detailFields.map((field, index) => (
//               <div key={field.id} className="flex items-center space-x-2 mt-2">
//                 <Input {...register(`productDetails.${index}`)} placeholder="Enter product detail" />
//                 <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             <Button type="button" variant="outline" size="sm" onClick={() => appendDetail("")} className="mt-2">
//               <Plus className="h-4 w-4 mr-2" /> Add Product Detail
//             </Button>
//           </div>
//           <div>
//             <Label>FAQs</Label>
//             {faqFields.map((field, index) => (
//               <div key={field.id} className="space-y-2 mt-4">
//                 <Input {...register(`faqs.${index}.question`)} placeholder="Question" />
//                 <Textarea {...register(`faqs.${index}.answer`)} placeholder="Answer" />
//                 <Button type="button" variant="destructive" size="sm" onClick={() => removeFaq(index)}>
//                   Remove FAQ
//                 </Button>
//               </div>
//             ))}
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => appendFaq({ _key: `faq_${faqFields.length}`, question: "", answer: "" })}
//               className="mt-2"
//             >
//               <Plus className="h-4 w-4 mr-2" /> Add FAQ
//             </Button>
//           </div>
//           <div>
//             <Label htmlFor="category">Category</Label>
//             <Select onValueChange={(value) => setValue("category._ref", value)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((category) => (
//                   <SelectItem key={category._id} value={category._id}>
//                     {category.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
//           </div>
//           <div>
//             <Label htmlFor="style">Style</Label>
//             <Select onValueChange={(value) => setValue("style._ref", value)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a style" />
//               </SelectTrigger>
//               <SelectContent>
//                 {styles.map((style) => (
//                   <SelectItem key={style._id} value={style._id}>
//                     {style.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.style && <p className="text-red-500 text-sm mt-1">{errors.style.message}</p>}
//           </div>
//         </CardContent>
//       </Card>

//       <Button type="submit" disabled={isLoading} className="w-full">
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Adding Product...
//           </>
//         ) : (
//           "Add Product"
//         )}
//       </Button>
//     </form>
//   )
// }

