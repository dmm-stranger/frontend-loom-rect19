import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface StripePaymentProps {
  onSuccess: (paymentIntentId: string) => void
  onError: (message: string) => void
  isLoading: boolean
}

export default function StripePayment({ onSuccess, onError, isLoading }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [ processing, setProcessing ] = useState(false)

  const handleSubmit = async () => {
    if (!stripe || !elements) return

    setProcessing(true)

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account`,
      },
      redirect: 'if_required',
    })

    if (error) {
      onError(error.message || 'Payment failed')
      setProcessing(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    }

    setProcessing(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PaymentElement />

      <button
        onClick={handleSubmit}
        disabled={!stripe || processing || isLoading}
        style={{
          width: '100%',
          background: processing || isLoading ? 'var(--border)' : 'var(--accent)',
          color: '#08080e',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          padding: '16px 0',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.1em',
          cursor: processing || isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {processing ? 'PROCESSING…' : '🔒 PAY NOW'}
      </button>

      <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
        🔒 Secured by Stripe — Test card: 4242 4242 4242 4242
      </p>
    </div>
  )
}