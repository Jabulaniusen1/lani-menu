import { useNotifications } from "@/components/notifications/notification-context"

export function useNotification() {
  const { addNotification, removeNotification, clearAll } = useNotifications()

  const notify = {
    success: (title: string, message?: string, duration?: number) => {
      addNotification({
        title,
        message,
        variant: "success",
        duration,
      })
    },
    error: (title: string, message?: string, duration?: number) => {
      addNotification({
        title,
        message,
        variant: "error",
        duration,
      })
    },
    warning: (title: string, message?: string, duration?: number) => {
      addNotification({
        title,
        message,
        variant: "warning",
        duration,
      })
    },
    info: (title: string, message?: string, duration?: number) => {
      addNotification({
        title,
        message,
        variant: "info",
        duration,
      })
    },
  }

  return {
    notify,
    removeNotification,
    clearAll,
  }
}
