"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import QRCodeStyling from "qr-code-styling"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuUrl: string
  restaurantName: string
}

export function QRCodeDialog({ open, onOpenChange, menuUrl, restaurantName }: QRCodeDialogProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const qrCodeInstance = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (open && qrCodeRef.current && !qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 300,
        height: 300,
        data: menuUrl,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 8,
        },
        dotsOptions: {
          color: "#f97316",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        cornersSquareOptions: {
          color: "#f97316",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#f97316",
          type: "dot",
        },
      })

      qrCodeInstance.current.append(qrCodeRef.current)
    }
  }, [open, menuUrl])

  const handleDownload = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({
        name: `${restaurantName.toLowerCase().replace(/\s+/g, "-")}-menu-qr`,
        extension: "png",
      })
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow && qrCodeRef.current) {
      const qrCodeHtml = qrCodeRef.current.innerHTML
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
                ${qrCodeHtml}
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Menu QR Code</DialogTitle>
          <DialogDescription>Download or print this QR code to share your menu with customers</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center bg-muted p-6 rounded-lg">
            <div ref={qrCodeRef} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Scan this code to access:</p>
            <code className="text-xs bg-muted px-3 py-2 rounded border block break-all">{menuUrl}</code>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1 bg-transparent">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
