// // components/dashboard/products/ProductActions.tsx
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Plus } from "lucide-react"

// export default function ClientPage() {
//   const [isAddProductOpen, setIsAddProductOpen] = useState(false)

//   return (
//     <>
//       <Button onClick={() => setIsAddProductOpen(true)}>
//         <Plus className="mr-2 h-4 w-4" /> Add Product
//       </Button>
//       <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>Add New Product</DialogTitle>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
