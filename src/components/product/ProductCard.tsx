import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addItem } from '@/features/cart/cartSlice'
import { useAddToCartMutation } from '@/features/cart/cartApi'
import { toggleWishlist, selectIsWishlisted } from '@/features/wishlist/wishlistSlice'
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/features/wishlist/wishlistApi'
import { discountPercent, formatCurrency } from '@/utils/formatCurrency'
import { selectIsAuth } from '@/features/auth/authSlice'
import { addToast } from '@/features/ui/uiSlice'
import ProductBadge from '@/components/product/ProductBadge'
import type { AppDispatch } from '@/app/store'

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
  slug?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch<AppDispatch>()
  const [ hov, setHov ] = useState(false)

  const isAuth = useSelector(selectIsAuth)
  const wishlisted = useSelector(selectIsWishlisted(product.id))

  const [ addToBackendCart ] = useAddToCartMutation()
  const [ addToWishlistApi ] = useAddToWishlistMutation()
  const [ removeFromWishlistApi ] = useRemoveFromWishlistMutation()

  const discount = discountPercent(product.originalPrice, product.price)

  const handleAddToCart = async () => {
    if (isAuth) {
      try {
        await addToBackendCart({ productId: product.id, qty: 1 }).unwrap()
        dispatch(addToast(`${product.name} added to cart`, 'success'))
      } catch {
        dispatch(addToast('Could not add item to cart', 'error'))
      }
    } else {
      dispatch(addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image,
      }))
      dispatch(addToast(`${product.name} added to cart`, 'success'))
    }
  }

  const handleWishlist = () => {
    if (isAuth) {
      wishlisted
        ? removeFromWishlistApi(product.id)
        : addToWishlistApi(product.id)
    } else {
      dispatch(toggleWishlist(product.id))
    }
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--bg-elevated)' : 'var(--bg-card)',
        border: `1px solid ${hov ? 'var(--border-hi)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 18,
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ProductBadge type={product.badge} />
        <button
          onClick={handleWishlist}
          style={{
            background: wishlisted ? '#ff4d6a18' : 'transparent',
            border: `1px solid ${wishlisted ? '#ff4d6a44' : 'var(--border)'}`,
            borderRadius: 7,
            padding: '3px 6px',
            cursor: 'pointer',
            color: wishlisted ? '#ff4d6a' : 'var(--text-muted)',
          }}
        >
          ♥
        </button>
      </div>

      {/* Image */}
      <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-dim)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {product.image.startsWith('http') ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image' }}
          />
        ) : (
          <span style={{ fontSize: 44 }}>{product.image}</span>
        )}
      </div>

      {/* Info */}
      <Link to={`/products/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
        <p style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.category}</p>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{product.name}</h3>
      </Link>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: 'var(--gold)', fontSize: 12 }}>{'★'.repeat(Math.round(product.rating))}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>({product.reviews.toLocaleString()})</span>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(product.price)}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatCurrency(product.originalPrice)}</span>
        <span style={{ fontSize: 10, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>-{discount}%</span>
      </div>

      {/* Stock warning */}
      {product.stock < 10 && (
        <p style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>⚠ Only {product.stock} left</p>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        style={{
          background: hov ? 'var(--accent)' : 'var(--accent-dim)',
          color: hov ? '#08080e' : 'var(--accent)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 0',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        + ADD TO CART
      </button>
    </div>
  )
}