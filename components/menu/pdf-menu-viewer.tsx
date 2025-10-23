"use client"

import { useState, useEffect } from "react"

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
  const [isLaptopScreen, setIsLaptopScreen] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      // Check if it's a laptop screen (typically 1024px+ width and not mobile)
      const isLaptop = width >= 1024 && width <= 1440 && height >= 600
      setIsLaptopScreen(isLaptop)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    // Set a timeout to show error if PDF doesn't load within 10 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        setPdfError(true)
        setIsLoading(false)
      }
    }, 10000)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
      clearTimeout(timeout)
    }
  }, [isLoading])

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

  // Show laptop restriction message
  if (isLaptopScreen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Mobile Menu</h2>
              <p className="text-gray-600">
                This menu is optimized for mobile devices. Please scan the QR code with your phone to view the menu.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                For the best experience, use your mobile device to view this digital menu.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Slim Bezel Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* PDF Container with slim bezel */}
          <div className="p-2 bg-gray-200">
            <div className="bg-white rounded shadow-sm overflow-hidden">
              {pdfError ? (
                <div className="h-[90vh] flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Cannot Load</h3>
                  <p className="text-gray-600 mb-4">The PDF menu couldn't be displayed in the browser.</p>
                  <div className="space-y-2">
                    <a
                      href={restaurant.pdf_menu_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open PDF in New Tab
                    </a>
                    <p className="text-sm text-gray-500">
                      Tap the button above to view the menu in a new tab
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="h-[90vh] flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading PDF menu...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={`${restaurant.pdf_menu_url}#toolbar=0&navpanes=0&scrollbar=1&zoom=FitH`}
                    className={`w-full h-[90vh] border-0 ${isLoading ? 'hidden' : 'block'}`}
                    title={`${restaurant.name} Menu PDF`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setPdfError(true)
                      setIsLoading(false)
                    }}
                    sandbox="allow-same-origin allow-scripts allow-popups"
                    allow="fullscreen"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Powered by Lanimenu */}
      <footer className="mt-4 text-center">
        <a 
          href="https://lanimenu.live" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-orange-600 transition-colors"
        >
          Powered by <span className="text-orange-600 font-medium">Lanimenu</span>
        </a>
      </footer>
    </div>
  )
}
