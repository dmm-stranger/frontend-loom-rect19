import ProductCard from '@/components/product/ProductCard'

interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  badge: 'HOT' | 'NEW' | 'SALE' | 'DEAL' | null
  stock: number
  image: string
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: 16,
    }}>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}