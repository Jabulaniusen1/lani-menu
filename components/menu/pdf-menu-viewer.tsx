"use client"

import { useEffect } from "react"

interface Restaurant {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  currency: string
  pdf_menu_url: string | null
  menu_type: string
}

interface PdfMenuViewerProps {
  restaurant: Restaurant
}

export function PdfMenuViewer({ restaurant }: PdfMenuViewerProps) {
  useEffect(() => {
    // Remove any existing scrollbars and set full screen
    document.body.style.overflow = 'hidden'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    
    return () => {
      // Restore scrollbars when component unmounts
      document.body.style.overflow = 'auto'
      document.body.style.margin = ''
      document.body.style.padding = ''
    }
  }, [])

  if (!restaurant.pdf_menu_url) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No PDF Menu Available</h2>
          <p className="text-muted-foreground">
            This restaurant hasn't uploaded a PDF menu yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* Full Screen PDF */}
      <iframe
        src={`${restaurant.pdf_menu_url}#toolbar=0&navpanes=0&scrollbar=1&zoom=FitH`}
        className="w-full h-full border-0"
        title={`${restaurant.name} Menu PDF`}
      />
      
      {/* Powered by Lanimenu - Fixed at bottom */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="https://lanimenu.live" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Powered by Lanimenu
        </a>
      </div>
    </div>
  )
}
