import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Address {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface Customer {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  addresses: Address[]
  totalOrders: number
  totalWishlistItems: number
  createdAt: string
  updatedAt: string
}

interface CustomerDetailsDialogProps {
  customer: Customer | null
  onClose: () => void
}

export function CustomerDetailsDialog({ customer, onClose }: CustomerDetailsDialogProps) {
  if (!customer) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`${customer.firstName || ""} ${customer.lastName || ""}`}</DialogTitle>
          <DialogDescription>Customer Details</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh]">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Contact Information</h4>
              <p>Email: {customer.email || "N/A"}</p>
              <p>Phone: {customer.phone || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Addresses</h4>
              {customer.addresses && customer.addresses.length > 0 ? (
                customer.addresses.map((address, index) => (
                  <div key={index} className="mt-2">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                    <p>{address.country}</p>
                    {address.isDefault && <p className="text-sm text-muted-foreground">Default Address</p>}
                  </div>
                ))
              ) : (
                <p>No addresses found</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold">Order Information</h4>
              <p>Total Orders: {customer.totalOrders || 0}</p>
              <p>Wishlist Items: {customer.totalWishlistItems || 0}</p>
            </div>
            <div>
              <h4 className="font-semibold">Account Information</h4>
              <p>Created: {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "N/A"}</p>
              <p>Last Updated: {customer.updatedAt ? new Date(customer.updatedAt).toLocaleString() : "N/A"}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

  