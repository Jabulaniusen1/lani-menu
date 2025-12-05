"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { createPortal } from "react-dom"

interface TourStep {
  target: string
  title: string
  content: string
  placement: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
  run: boolean
  onComplete: () => void
  onSkip: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="sidebar-menu"]',
    title: 'Welcome to Lanimenu! 👋',
    content: 'This is your dashboard. Let\'s take a quick tour to help you get started.',
    placement: 'right'
  },
  {
    target: '[data-tour="menu-tab"]',
    title: 'Menu Tab',
    content: 'This is where you\'ll manage all your menu items. Add, edit, and organize your dishes here.',
    placement: 'right'
  },
  {
    target: '[data-tour="add-item-button"]',
    title: 'Add Menu Items',
    content: 'Click this button to add your first menu item. You can add up to 5 items on the free plan.',
    placement: 'top'
  },
  {
    target: '[data-tour="qr-code-section"]',
    title: 'QR Code & Menu URL',
    content: 'Generate a QR code for your menu URL. Share this with customers to let them view your menu on their phones!',
    placement: 'top'
  },
  {
    target: '[data-tour="designs-tab"]',
    title: 'Designs Tab',
    content: 'Customize how your menu looks! Choose layouts, themes, and fonts to match your restaurant\'s style.',
    placement: 'right'
  },
  {
    target: '[data-tour="restaurants-tab"]',
    title: 'Restaurants Tab',
    content: 'Manage multiple restaurant locations from one account. Add new locations or switch between them here.',
    placement: 'right'
  },
  {
    target: '[data-tour="billing-tab"]',
    title: 'Billing Tab',
    content: 'Upgrade to Pro or Business to unlock unlimited menu items, custom themes, and more features!',
    placement: 'right'
  },
]

export function OnboardingTour({ 
  run, 
  onComplete, 
  onSkip,
  activeTab,
  onTabChange 
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!run) {
      setCurrentStep(0)
      setTargetElement(null)
      return
    }

    const step = tourSteps[currentStep]
    if (!step) {
      onComplete()
      return
    }

    // Find target element
    const element = document.querySelector(step.target) as HTMLElement
    if (!element) {
      // If element not found, try to navigate to correct tab
      if (step.target === '[data-tour="add-item-button"]' && activeTab !== 'menu' && onTabChange) {
        onTabChange('menu')
        setTimeout(() => updatePosition(), 500)
        return
      }
      // Skip to next step if element not found
      if (currentStep < tourSteps.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300)
      } else {
        onComplete()
      }
      return
    }

    setTargetElement(element)
    updatePosition()

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })

    function updatePosition() {
      const el = document.querySelector(step.target) as HTMLElement
      if (!el) return

      const rect = el.getBoundingClientRect()
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      })
    }

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [run, currentStep, activeTab, onTabChange, onComplete])

  if (!run || !targetElement) return null

  const step = tourSteps[currentStep]
  if (!step) return null

  const getTooltipPosition = () => {
    const gap = 20
    const tooltipWidth = 320
    const tooltipHeight = 180
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = 0
    let left = 0

    switch (step.placement) {
      case 'right':
        top = position.top + position.height / 2 - tooltipHeight / 2
        left = position.left + position.width + gap
        // Adjust if goes off screen
        if (left + tooltipWidth > viewportWidth + scrollX) {
          left = position.left - tooltipWidth - gap // Switch to left
        }
        if (top + tooltipHeight > viewportHeight + scrollY) {
          top = viewportHeight + scrollY - tooltipHeight - 10
        }
        if (top < scrollY) {
          top = scrollY + 10
        }
        break
      case 'left':
        top = position.top + position.height / 2 - tooltipHeight / 2
        left = position.left - tooltipWidth - gap
        // Adjust if goes off screen
        if (left < scrollX) {
          left = position.left + position.width + gap // Switch to right
        }
        if (top + tooltipHeight > viewportHeight + scrollY) {
          top = viewportHeight + scrollY - tooltipHeight - 10
        }
        if (top < scrollY) {
          top = scrollY + 10
        }
        break
      case 'top':
        top = position.top - tooltipHeight - gap
        left = position.left + position.width / 2 - tooltipWidth / 2
        // Adjust if goes off screen
        if (top < scrollY) {
          top = position.top + position.height + gap // Switch to bottom
        }
        if (left + tooltipWidth > viewportWidth + scrollX) {
          left = viewportWidth + scrollX - tooltipWidth - 10
        }
        if (left < scrollX) {
          left = scrollX + 10
        }
        break
      case 'bottom':
        top = position.top + position.height + gap
        left = position.left + position.width / 2 - tooltipWidth / 2
        // Adjust if goes off screen
        if (top + tooltipHeight > viewportHeight + scrollY) {
          top = position.top - tooltipHeight - gap // Switch to top
        }
        if (left + tooltipWidth > viewportWidth + scrollX) {
          left = viewportWidth + scrollX - tooltipWidth - 10
        }
        if (left < scrollX) {
          left = scrollX + 10
        }
        break
      default:
        top = position.top + position.height + gap
        left = position.left
    }

    return { top, left }
  }

  const tooltipPos = getTooltipPosition()

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  // Ensure we're in the browser
  if (typeof window === 'undefined') return null

  return createPortal(
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/50"
      />

      {/* Highlight Box */}
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 4px #f97316',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[10000] bg-white rounded-lg shadow-2xl p-6 max-w-sm animate-in fade-in zoom-in-95 duration-300"
        style={{
          top: `${tooltipPos.top}px`,
          left: `${tooltipPos.left}px`
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.content}</p>
          </div>
          <button
            onClick={handleSkip}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

    </>,
    document.body
  )
}
