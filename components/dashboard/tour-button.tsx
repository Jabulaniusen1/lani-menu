"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface TourButtonProps {
  onClick: () => void
  className?: string
}

export function TourButton({ onClick, className }: TourButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={className}
    >
      <Sparkles className="h-4 w-4 mr-2" />
      Take a Tour
    </Button>
  )
}

