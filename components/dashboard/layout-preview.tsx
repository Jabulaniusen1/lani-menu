"use client"

import { Card, CardContent } from "@/components/ui/card"

interface LayoutPreviewProps {
  layout: 'grid' | 'list'
  className?: string
}

export function LayoutPreview({ layout, className = "" }: LayoutPreviewProps) {
  // Mock menu items for preview
  const previewItems = [
    { id: 1, name: "Item 1", price: "$12" },
    { id: 2, name: "Item 2", price: "$15" },
    { id: 3, name: "Item 3", price: "$18" },
    { id: 4, name: "Item 4", price: "$20" },
  ]

  if (layout === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-0.5 ${className}`}>
        {previewItems.slice(0, 4).map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-8 sm:h-10 bg-gradient-to-br from-gray-200 to-gray-300" />
            <CardContent className="p-0.5">
              <div className="h-0.5 bg-gray-200 rounded mb-0.5 w-3/4" />
              <div className="h-0.5 bg-gray-100 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className={`space-y-0.5 ${className}`}>
        {previewItems.slice(0, 2).map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="flex gap-0.5 items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 rounded" />
              <CardContent className="p-0.5 flex-1 flex flex-col justify-center gap-0.5">
                <div className="h-0.5 bg-gray-200 rounded w-2/3" />
                <div className="h-0.5 bg-gray-100 rounded w-1/2" />
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return null
}

