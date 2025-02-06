import { groq } from "next-sanity"

export const getProductsQuery = groq`
  *[_type == "product"] {
    _id,
    title,
    slug,
    price,
    originalPrice,
    rating,
    description,
    "imageUrl": images[0].asset->url,
    colors,
    sizes,
    tags,
    isNewArrival,
    isTopSelling,
    inventory,
    productDetails,
    faqs,
    category->{_id, name},
    style->{_id, name},
    "reviewCount": count(reviews)
  }
`

export const getProductByIdQuery = groq`
  *[_type == "product" && _id == $id][0] {
    _id,
    title,
    slug,
    price,
    originalPrice,
    rating,
    description,
    images[]{
      asset->{
        _id,
        url
      }
    },
    colors,
    sizes,
    tags,
    isNewArrival,
    isTopSelling,
    inventory,
    productDetails,
    faqs,
    category->{_id, name},
    style->{_id, name},
    reviews[]->{_id, rating, content, customer->{_id, firstName, lastName}}
  }
`

export const getCategoriesQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    slug
  }
`

export const getStylesQuery = groq`
  *[_type == "style"] {
    _id,
    name,
    slug
  }
`

