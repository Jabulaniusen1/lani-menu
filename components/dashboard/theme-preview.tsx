"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ThemePreviewProps {
  theme: {
    id: string
    name: string
    colors: string[]
  }
  className?: string
}

export function ThemePreview({ theme, className = "" }: ThemePreviewProps) {
  return (
    <div className={`space-y-1.5 sm:space-y-2 ${className}`}>
      {/* Mini menu preview with theme colors */}
      <Card className="overflow-hidden border-2" style={{ 
        backgroundColor: theme.colors[0],
        borderColor: theme.colors[1] 
      }}>
        <CardContent className="p-2 sm:p-2.5 lg:p-3 space-y-1.5 sm:space-y-2">
          {/* Header preview */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div 
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded flex-shrink-0"
              style={{ backgroundColor: theme.colors[1] }}
            />
            <div 
              className="h-1.5 sm:h-2 rounded flex-1"
              style={{ backgroundColor: theme.colors[2] || theme.colors[1], opacity: 0.3 }}
            />
          </div>
          
          {/* Menu item preview */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between gap-1.5">
              <div 
                className="h-1.5 sm:h-2 rounded flex-1"
                style={{ backgroundColor: theme.colors[2] || theme.colors[1], opacity: 0.4 }}
              />
              <div 
                className="h-1.5 sm:h-2 rounded w-1/4 flex-shrink-0"
                style={{ backgroundColor: theme.colors[1] }}
              />
            </div>
            <div 
              className="h-1 sm:h-1.5 rounded w-full"
              style={{ backgroundColor: theme.colors[2] || theme.colors[1], opacity: 0.2 }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Color palette */}
      <div className="flex gap-0.5 sm:gap-1">
        {theme.colors.map((color, idx) => (
          <div
            key={idx}
            className="flex-1 h-6 sm:h-7 lg:h-8 rounded-md border border-gray-200 shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}

