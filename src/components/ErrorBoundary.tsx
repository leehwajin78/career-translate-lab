import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{ padding: '3rem', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0123B4', marginBottom: '1rem' }}>
            오류가 발생했습니다
          </h2>
          <p style={{ color: '#6B7080', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            일시적인 문제가 발생했습니다. 페이지를 새로고침해 주세요.<br />
            문제가 지속되면 070-4090-2161로 연락해 주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#0123B4', color: '#fff', border: 'none',
              borderRadius: '9999px', padding: '.7rem 1.8rem',
              fontWeight: 700, cursor: 'pointer', fontSize: '1rem'
            }}
          >
            새로고침
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
