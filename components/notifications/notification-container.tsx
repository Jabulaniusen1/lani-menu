"use client"

import React from "react"
import { Notification } from "./notification"
import { useNotifications } from "./notification-context"

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 bottom-4 sm:bottom-auto z-50 space-y-2 sm:space-y-3 w-full sm:w-auto max-w-[calc(100vw-2rem)] sm:max-w-sm px-4 sm:px-0">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}
