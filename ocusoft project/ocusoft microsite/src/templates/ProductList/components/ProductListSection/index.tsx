
export interface ProductBoxItem {
  slug: string
  image: string
  title: string
  is_available_for_order?: number
  product_id: string
  website_product_id: string
  is_discounted: number
  discount_per?: number
  product_tag_name: string
  is_fix_price?: number
  diamond_total_carat: number
  net_weight: number
  total_price: number
  currency_symbol?: string | null
  original_total_price: number
  sku: string
  _id?: string
  sectionName?: string
}


