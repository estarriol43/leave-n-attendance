import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">頁面不存在</h2>
        <p className="text-gray-600 mb-6">
          您嘗試訪問的頁面不存在或已被移除。
        </p>
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          返回首頁
        </Link>
      </div>
    </div>
  )
} 