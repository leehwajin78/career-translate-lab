'use client'

import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'

export default function AdminAuth() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        // 쿠키 설정 후 전체 네비게이션으로 이동 (미들웨어가 세션을 인식)
        window.location.assign('/admin')
        return
      }
      if (res.status === 503) {
        setError('서버에 관리자 비밀번호(ADMIN_PASSWORD_HASH)가 설정되지 않았습니다.')
      } else {
        setError('비밀번호가 올바르지 않습니다.')
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="text-primary" size={22} />
          </div>
          <h1 className="text-lg font-bold text-[#0D1A3E]">관리자 로그인</h1>
          <p className="text-xs text-gray-500 mt-1">한끗프로젝트 운영 콘솔</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="admin-pw" className="block text-xs font-semibold text-gray-600 mb-1">
              관리자 비밀번호
            </label>
            <input
              id="admin-pw"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-2.5 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '확인 중…' : '로그인'}
          </button>
        </form>

        <p className="mt-5 text-[10px] text-gray-400 leading-relaxed text-center">
          MVP 단일 관리자 게이트. 비밀번호는 해시(ADMIN_PASSWORD_HASH)로만 저장되며 세션은 서명 쿠키로 7일 유지됩니다.
        </p>
      </div>
    </div>
  )
}
