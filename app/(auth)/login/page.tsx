'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login, loading, error, isAuthenticated } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('提交登入表單:', { username, hasPassword: !!password })
    
    // 表單驗證
    if (!username.trim() || !password) {
      setFormError('請輸入帳號和密碼')
      return
    }
    
    setFormError(null)
    const success = await login(username, password)
    
    console.log('登入結果:', { success, error, isAuthenticated })
    
    if (!success) {
      setFormError('登入失敗，請檢查帳號密碼')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">登入</h1>
        <div>
          <label className="block mb-1 text-sm font-medium">帳號</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">密碼</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {(formError || error) && <div className="text-red-500 text-sm text-center">{formError || error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? '登入中...' : '登入'}
        </button>
      </form>
    </div>
  )
} 