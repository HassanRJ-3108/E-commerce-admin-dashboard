export interface Category {
  _id: string
  name: string
  slug: {
    current: string
  }
  imageUrl?: string
}

export interface Style {
  _id: string
  name: string
  slug: {
    current: string
  }
}

export interface Color {
  _key: string
  name: string
}

export interface FAQ {
  _key: string
  question: string
  answer: string
}

export interface Review {
  _id: string
  rating: number
  content: string
  createdAt: string
  isVerified: boolean
  customer?: {
    name: string
    email: string
  }
}

export interface Product {
  _id: string
  title: string
  price: number
  originalPrice?: number
  rating: number
  description: string
  images: {
    _type: string
    asset: {
      _type: string
      _ref: string
    }
    _key: string
  }[]
  colors: Color[]
  sizes: string[]
  category: {
    _type: string
    _ref: string
  }
  style: {
    _type: string
    _ref: string
  }
  inventory: number
  slug: {
    _type: string
    current: string
  }
  productDetails: string[]
  faqs: FAQ[]
  isNewArrival: boolean
  isTopSelling: boolean
  tags?: string[]
  createdAt: string
  reviews: Review[]
}

