'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 可以在此處紀錄錯誤到監控系統，如 Sentry 等
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">發生錯誤</h1>
        <h2 className="text-2xl font-semibold mb-2">系統暫時無法提供服務</h2>
        <p className="text-gray-600 mb-6">
          請稍後再試。您可以重設頁面或返回首頁。
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            重試
          </button>
          <Link
            href="/dashboard"
            className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  )
} 