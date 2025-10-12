"use client"

import React, { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Notification as NotificationType } from "./notification-context"

interface NotificationProps {
  notification: NotificationType
  onRemove: (id: string) => void
}

const variantStyles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-600",
    iconComponent: CheckCircle,
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600",
    iconComponent: AlertCircle,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-600",
    iconComponent: AlertTriangle,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    iconComponent: Info,
  },
}

export function Notification({ notification, onRemove }: NotificationProps) {
  const { id, title, message, variant, duration = 5000 } = notification
  const { container, icon, iconComponent: Icon } = variantStyles[variant]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onRemove])

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm",
        "transform transition-all duration-300 ease-out",
        "animate-in slide-in-from-right-full fade-in-0",
        container
      )}
      style={{
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", icon)} />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold leading-5">{title}</h4>
        {message && (
          <p className="mt-1 text-sm opacity-90 leading-5">{message}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(id)}
        className={cn(
          "flex-shrink-0 p-1 rounded-md transition-colors",
          "hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2",
          icon
        )}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Add CSS animations only on client side
if (typeof window !== 'undefined') {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .notification-exit {
      animation: slideOutRight 0.3s ease-in forwards;
    }
  `
  document.head.appendChild(style)
}
