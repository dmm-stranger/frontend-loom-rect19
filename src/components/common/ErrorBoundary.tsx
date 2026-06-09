import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text)' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
          <h2 style={{ fontSize: 20, marginBottom: 8, color: 'var(--danger)' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 24px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            TRY AGAIN
          </button>
        </div>
      )
    }
    return this.props.children
  }
}