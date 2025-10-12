"use client"

import { useEffect, useRef } from "react"

interface SimpleQRCodeProps {
  url: string
  size?: number
}

export function SimpleQRCode({ url, size = 200 }: SimpleQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && url) {
      // Simple QR code generation using canvas
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, size, size)
      
      // Draw a simple placeholder QR code pattern
      ctx.fillStyle = '#f97316'
      ctx.fillRect(0, 0, size, size)
      
      // Draw white squares to simulate QR code
      ctx.fillStyle = '#ffffff'
      const squareSize = size / 25
      
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          if ((i + j) % 3 === 0) {
            ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
          }
        }
      }
      
      // Add text
      ctx.fillStyle = '#000000'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('QR Code', size / 2, size / 2)
      ctx.fillText('Placeholder', size / 2, size / 2 + 15)
    }
  }, [url, size])

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border rounded"
      />
      <p className="text-xs text-muted-foreground text-center max-w-[200px] break-all">
        {url}
      </p>
    </div>
  )
}
