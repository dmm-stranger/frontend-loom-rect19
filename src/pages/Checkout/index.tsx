import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { selectIsAuth } from '@/features/auth/authSlice'
import { useGetCartQuery } from '@/features/cart/cartApi'
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
} from '@/features/orders/checkoutApi'
import { clearCart } from '@/features/cart/cartSlice'
import { formatCurrency } from '@/utils/formatCurrency'
import Spinner from '@/components/common/Spinner'
import StripePayment from '@/components/checkout/StripePayment'
import { ROUTES } from '@/constants/routes'
import type { AppDispatch } from '@/app/store'

// Load Stripe outside component to avoid re-creating on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

type Step = 'shipping' | 'payment' | 'confirmation'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useSelector(selectIsAuth)

  const { data, isLoading } = useGetCartQuery({}, { skip: !isAuth })
  const [ createOrder, { isLoading: ordering } ] = useCreateOrderMutation()
  const [ createPaymentIntent ] = useCreatePaymentIntentMutation()
  // NOTE: usePayOrderMutation/checkoutApi's payOrder is unused — the backend
  // has no POST /orders/:id/pay route. Order payment status is set by the
  // Stripe webhook (payment.routes.js), confirmed via handlePaymentSuccess
  // below. Left out of the destructure to keep the strict unused-var check
  // passing; the mutation itself is left in checkoutApi.ts in case a manual
  // fallback confirmation path is added later.

  const cart = data?.data
  const items = cart?.items || []

  // Step state
  const [ step, setStep ] = useState<Step>('shipping')
  const [ clientSecret, setClientSecret ] = useState('')
  const [ orderId, setOrderId ] = useState('')
  const [ error, setError ] = useState('')

  // Shipping form
  const [ form, setForm ] = useState({
    fullName: '', line1: '', city: '',
    state: '', postalCode: '', country: '', phone: '',
  })

  if (!isAuth) return <Navigate to={ROUTES.LOGIN} replace />
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size={40} /></div>
  if (items.length === 0 && step !== 'confirmation') return <Navigate to={ROUTES.CART} replace />

  const handleChange = (field: string, value: string) => setForm(f => ({ ...f, [ field ]: value }))

  // Step 1 → Step 2: Create order + payment intent
  const handleProceedToPayment = async () => {
    setError('')

    const required = [ 'fullName', 'line1', 'city', 'state', 'postalCode', 'country', 'phone' ]
    for (const field of required) {
      if (!form[ field as keyof typeof form ].trim()) {
        return setError(`${field.replace(/([A-Z])/g, ' $1')} is required`)
      }
    }

    try {
      // 1. Create order in backend
      const orderResult = await createOrder({
        shippingAddress: form,
        paymentMethod: 'stripe',
      }).unwrap()

      const newOrderId = orderResult.data.order._id
      setOrderId(newOrderId)

      // 2. Create Stripe payment intent


      // 2. Create Stripe payment intent — backend needs orderId
      const intentResult = await createPaymentIntent({
        orderId: newOrderId,
      }).unwrap()

      setClientSecret(intentResult.data.clientSecret)
      setStep('payment')

    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create order. Please try again.')
    }
  }

  // Step 2 → Step 3: Payment confirmed
  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    // No /pay endpoint needed — Stripe webhook handles order status update
    // Just clear cart and show confirmation
    dispatch(clearCart())
    setStep('confirmation')
  }

  const handlePaymentError = (message: string) => setError(message)

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text)',
    fontFamily: 'var(--font-sans)', fontSize: 13,
    outline: 'none', boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)', fontSize: 9,
    color: 'var(--text-muted)', letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px 28px' }} >

      {/* ── Step indicator ── */}
      < div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        {([ 'shipping', 'payment', 'confirmation' ] as Step[]).map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: step === s ? 'var(--accent)' : s === 'confirmation' && step === 'confirmation' ? 'var(--success)' : 'var(--bg-card)',
              border: `2px solid ${step === s ? 'var(--accent)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              color: step === s ? '#08080e' : 'var(--text-muted)',
            }}>
              {i + 1}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: step === s ? 'var(--accent)' : 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {s}
            </span>
            {i < 2 && <span style={{ color: 'var(--border)', margin: '0 4px' }}>›</span>}
          </div>
        ))
        }
      </div >

      {/* ── Error ── */}
      {
        error && (
          <div style={{ background: '#ff4d6a18', border: '1px solid #ff4d6a33', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--danger)', margin: 0 }}>{error}</p>
          </div>
        )
      }

      {/* ════════════════ STEP 1: SHIPPING ════════════════ */}
      {
        step === 'shipping' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 24 }}>Shipping Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={labelStyle}>Full Name</label><input style={inputStyle} placeholder="John Doe" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} /></div>
                <div><label style={labelStyle}>Street Address</label><input style={inputStyle} placeholder="123 Main Street" value={form.line1} onChange={e => handleChange('line1', e.target.value)} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={labelStyle}>City</label><input style={inputStyle} placeholder="New York" value={form.city} onChange={e => handleChange('city', e.target.value)} /></div>
                  <div><label style={labelStyle}>State</label><input style={inputStyle} placeholder="NY" value={form.state} onChange={e => handleChange('state', e.target.value)} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={labelStyle}>Postal Code</label><input style={inputStyle} placeholder="10001" value={form.postalCode} onChange={e => handleChange('postalCode', e.target.value)} /></div>
                  <div><label style={labelStyle}>Country</label><input style={inputStyle} placeholder="USA" value={form.country} onChange={e => handleChange('country', e.target.value)} /></div>
                </div>
                <div><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="+1234567890" value={form.phone} onChange={e => handleChange('phone', e.target.value)} /></div>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 20 }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {items.map((item: any) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-sub)' }}>{item.name} x{item.qty}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text)' }}>{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{formatCurrency(cart?.subtotal || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--success)' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{formatCurrency(cart?.total || 0)}</span>
                </div>
              </div>
              <button
                onClick={handleProceedToPayment}
                disabled={ordering}
                style={{ width: '100%', marginTop: 20, background: ordering ? 'var(--border)' : 'var(--accent)', color: '#08080e', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', cursor: ordering ? 'not-allowed' : 'pointer' }}
              >
                {ordering ? 'PROCESSING…' : 'CONTINUE TO PAYMENT →'}
              </button>
            </div>
          </div>
        )
      }

      {/* ════════════════ STEP 2: PAYMENT ════════════════ */}
      {
        step === 'payment' && clientSecret && (
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 24 }}>
                Payment Details
              </h2>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#00cfff',
                      colorBackground: '#14141f',
                      colorText: '#eaeaf4',
                      borderRadius: '10px',
                    },
                  },
                }}
              >
                <StripePayment
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  isLoading={false}
                />
              </Elements>
            </div>
            <button
              onClick={() => setStep('shipping')}
              style={{ marginTop: 16, background: 'transparent', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', letterSpacing: '0.08em' }}
            >
              ← BACK TO SHIPPING
            </button>
          </div>
        )
      }

      {/* ════════════════ STEP 3: CONFIRMATION ════════════════ */}
      {
        step === 'confirmation' && (
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 12 }}>
              Order Confirmed!
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)', marginBottom: 8 }}>
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 32, letterSpacing: '0.08em' }}>
              ORDER #{orderId.slice(-8).toUpperCase()}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/account')}
                style={{ background: 'var(--accent)', color: '#08080e', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}
              >
                VIEW MY ORDERS
              </button>
              <button
                onClick={() => navigate(ROUTES.CATALOG)}
                style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )
      }
    </div >
  )
}