import api from "@/lib/api"

// Types
export interface Notification {
  id: number
  title: string
  message: string
  related_to: string
  related_id: number
  is_read: boolean
  created_at: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  pagination: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface NotificationsParams {
  page?: number
  per_page?: number
  unread_only?: boolean
}

/**
 * Get notifications for the current user
 */
export async function getNotifications(params?: NotificationsParams): Promise<NotificationsResponse> {
  const response = await api.get<NotificationsResponse>('/notifications', { params })
  return response.data
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`)
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch('/notifications/read-all')
} 