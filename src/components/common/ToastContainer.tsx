import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectToasts, removeToast } from '@/features/ui/uiSlice'
import type { AppDispatch } from '@/app/store'

const ICONS: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

const COLORS: Record<string, string> = {
  success: 'var(--success)',
  error: 'var(--danger)',
  info: 'var(--accent)',
}

function ToastItem({ id, message, type }: { id: number; message: string; type: 'success' | 'error' | 'info' }) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), 2800)
    return () => clearTimeout(timer)
  }, [ id, dispatch ])

  return (
    <div
      onClick={() => dispatch(removeToast(id))}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-elevated)', border: `1px solid ${COLORS[ type ]}`,
        borderRadius: 'var(--radius-md)', padding: '12px 16px',
        boxShadow: '0 8px 24px #00000040', cursor: 'pointer',
        minWidth: 200, maxWidth: 320,
        animation: 'toast-in 0.2s ease-out',
      }}
    >
      <span style={{
        color: COLORS[ type ], fontWeight: 700, fontSize: 13,
        width: 20, height: 20, borderRadius: '50%',
        border: `1px solid ${COLORS[ type ]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {ICONS[ type ]}
      </span>
      <span style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>{message}</span>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useSelector(selectToasts)

  if (toasts.length === 0) return null

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8,
        alignItems: 'center', width: 'min(320px, calc(100vw - 32px))',
      }}>
        {toasts.map(t => <ToastItem key={t.id} {...t} />)}
      </div>
    </>
  )
}
