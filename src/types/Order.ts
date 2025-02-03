export interface Order {
    _id: string
    orderNumber: string
    customer: {
      _ref: string
      _type: "reference"
    }
    items: {
      _key: string
      productId: string
      quantity: number
      price: number
    }[]
    totalAmount: number
    status: string
    createdAt: string
  }
  
  