"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import QRCode from "qrcode"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuUrl: string
  restaurantName: string
}

export function QRCodeDialog({ open, onOpenChange, menuUrl, restaurantName }: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && menuUrl) {
      generateQRCode()
    }
  }, [open, menuUrl])

  const generateQRCode = async () => {
    if (!menuUrl) {
      console.error('No menu URL provided')
      return
    }

    setLoading(true)
    try {
      console.log('Generating QR code for URL:', menuUrl)
      console.log('URL length:', menuUrl.length)
      console.log('URL type:', typeof menuUrl)
      
      // Validate URL format
      try {
        new URL(menuUrl)
        console.log('URL is valid')
      } catch (urlError) {
        console.error('Invalid URL format:', urlError)
        throw new Error(`Invalid URL format: ${menuUrl}`)
      }
      
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000', // Black color
          light: '#ffffff' // White background
        },
        errorCorrectionLevel: 'H'
      })
      
      console.log('QR code data URL generated:', dataUrl.substring(0, 50) + '...')
      setQrDataUrl(dataUrl)
      console.log('QR code generated successfully')
    } catch (error) {
      console.error('Error generating QR code:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        menuUrl: menuUrl
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement('a')
      link.download = `${restaurantName.toLowerCase().replace(/\s+/g, "-")}-menu-qr.png`
      link.href = qrDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePrint = () => {
    if (!qrDataUrl) return
    
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${restaurantName}</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .container {
                text-align: center;
              }
              h1 {
                font-size: 32px;
                margin-bottom: 16px;
                color: #0a0a0a;
              }
              p {
                font-size: 18px;
                color: #737373;
                margin-bottom: 32px;
              }
              .qr-code {
                display: inline-block;
                padding: 20px;
                background: white;
                border: 2px solid #e5e5e5;
                border-radius: 16px;
              }
              .qr-code img {
                max-width: 300px;
                height: auto;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${restaurantName}</h1>
              <p>Scan to view our digital menu</p>
              <div class="qr-code">
                <img src="${qrDataUrl}" alt="QR Code" />
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader className="px-1 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">Menu QR Code</DialogTitle>
          <DialogDescription className="text-sm">Download or print this QR code to share your menu with customers</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-center bg-muted p-3 sm:p-6 rounded-lg">
            {loading ? (
              <div className="min-h-[200px] min-w-[200px] sm:min-h-[250px] sm:min-w-[250px] flex items-center justify-center">
                <div className="text-muted-foreground text-xs sm:text-sm">
                  Generating QR code...
                </div>
              </div>
            ) : qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="QR Code" 
                className="max-w-[200px] max-h-[200px] sm:max-w-[250px] sm:max-h-[250px]"
              />
            ) : (
              <div className="min-h-[200px] min-w-[200px] sm:min-h-[250px] sm:min-w-[250px] flex items-center justify-center">
                <div className="text-muted-foreground text-xs sm:text-sm">
                  Failed to generate QR code
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-medium">Scan this code to access:</p>
            <code className="text-xs bg-muted px-2 sm:px-3 py-1.5 sm:py-2 rounded border block break-all">{menuUrl}</code>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={handleDownload} 
                className="flex-1 h-9 sm:h-10 text-sm" 
                disabled={!qrDataUrl || loading}
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Download PNG
              </Button>
              <Button 
                onClick={handlePrint} 
                variant="outline" 
                className="flex-1 h-9 sm:h-10 text-sm bg-transparent"
                disabled={!qrDataUrl || loading}
              >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Print
              </Button>
            </div>
            
            {/* Debug button - remove this after fixing */}
            <Button 
              onClick={generateQRCode} 
              variant="outline" 
              className="w-full h-9 sm:h-10 text-sm"
              disabled={loading}
            >
              {loading ? "Generating..." : "Retry QR Generation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
