import axios from 'axios'

// 可根據實際 API base url 調整
// 注意：API 伺服器需要運行在這個位址，或者配置好正確的代理
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// 開發時輸出完整錯誤日誌以便調試
const DEBUG = process.env.NODE_ENV !== 'production'

// 輸出 API 設置供調試
if (DEBUG) {
  console.log('🌐 API 設置:', {
    baseURL,
    environment: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  })
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器：自動帶上 token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        if (DEBUG) {
          console.log(`🔐 Adding Auth token to request:`, {
            url: config.url,
            tokenFirstChars: token.substring(0, 15) + '...',
            fullHeader: `Bearer ${token}`
          })
        }
      } else if (DEBUG) {
        console.log(`⚠️ No token found for request:`, config.url)
      }
    }
    if (DEBUG) {
      console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, config)
    }
    return config
  },
  (error) => {
    if (DEBUG) {
      console.error('❌ Request Error:', error)
    }
    return Promise.reject(error)
  }
)

// 回應攔截器：可統一錯誤處理
api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    // 可根據需求自訂錯誤處理
    if (DEBUG) {
      console.error('❌ Response Error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
    }
    return Promise.reject(error)
  }
)

export default api 