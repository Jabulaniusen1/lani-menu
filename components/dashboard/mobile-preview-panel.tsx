"use client"

import { useEffect, useState, useRef } from "react"
import { Smartphone, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobilePreviewPanelProps {
  restaurant: {
    slug: string
    menu_layout?: string
    menu_theme?: string
    menu_font?: string
  }
}

export function MobilePreviewPanel({ restaurant }: MobilePreviewPanelProps) {
  const [previewKey, setPreviewKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate menu URL with cache-busting
  const menuUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/menu/${restaurant.slug}?preview=${Date.now()}&t=${previewKey}&layout=${restaurant.menu_layout || 'grid'}&theme=${restaurant.menu_theme || 'default'}&font=${restaurant.menu_font || 'inter'}`
    : ""

  // Update preview when restaurant settings change
  useEffect(() => {
    setIsLoading(true)
    
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    // Add a small delay to allow database to update
    refreshTimeoutRef.current = setTimeout(() => {
      setPreviewKey(prev => prev + 1)
    }, 500)

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [restaurant.menu_layout, restaurant.menu_theme, restaurant.menu_font, restaurant.slug])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Manual refresh function
  const handleRefresh = () => {
    setIsLoading(true)
    setPreviewKey(prev => prev + 1)
  }

  return (
    <div className="hidden xl:flex fixed right-0 top-0 h-screen w-[400px] bg-gray-50 border-l border-gray-200 flex-col z-30">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Live Preview</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-7 w-7 p-0"
            title="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Changes appear in real-time</p>
      </div>

      {/* Phone Preview */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="relative">
          {/* Phone Frame */}
          <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
            {/* Phone Screen */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden relative" style={{ width: '375px', height: '812px' }}>
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black rounded-t-[2.5rem] z-10 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <div className="absolute right-4 text-white text-[10px] font-medium">9:41</div>
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-20 rounded-[2.5rem]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              )}

              {/* Iframe */}
              <iframe
                ref={iframeRef}
                key={previewKey}
                src={menuUrl}
                className="w-full h-full border-0 rounded-[2.5rem] mt-8"
                style={{ 
                  width: '100%', 
                  height: 'calc(100% - 2rem)',
                }}
                onLoad={handleIframeLoad}
                title="Menu Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
              />
            </div>

            {/* Home Indicator (iPhone style) */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

