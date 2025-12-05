"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, AlertCircle } from "lucide-react"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpgrade: () => void
  featureType?: 'menu-items' | 'theme' | 'font' | 'general'
  featureName?: string
}

export function UpgradeModal({ 
  open, 
  onOpenChange, 
  onUpgrade, 
  featureType = 'general',
  featureName 
}: UpgradeModalProps) {
  const getTitle = () => {
    switch (featureType) {
      case 'menu-items':
        return 'Menu Item Limit Reached'
      case 'theme':
        return 'Premium Theme Locked'
      case 'font':
        return 'Premium Font Locked'
      default:
        return 'Premium Feature Locked'
    }
  }

  const getDescription = () => {
    switch (featureType) {
      case 'menu-items':
        return "You've reached the maximum number of menu items allowed on the Free plan."
      case 'theme':
        return featureName 
          ? `The "${featureName}" theme is a premium feature available on Pro and Business plans.`
          : 'This theme is a premium feature available on Pro and Business plans.'
      case 'font':
        return featureName 
          ? `The "${featureName}" font is a premium feature available on Pro and Business plans.`
          : 'This font is a premium feature available on Pro and Business plans.'
      default:
        return 'This feature is available on Pro and Business plans.'
    }
  }

  const getUpgradeMessage = () => {
    switch (featureType) {
      case 'menu-items':
        return 'Upgrade to Pro or Business plan to add unlimited menu items and unlock more features.'
      case 'theme':
        return 'Upgrade to Pro or Business plan to unlock all premium themes and customization options.'
      case 'font':
        return 'Upgrade to Pro or Business plan to unlock all premium fonts and customization options.'
      default:
        return 'Upgrade to Pro or Business plan to unlock all premium features.'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-xl font-bold">{getTitle()}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {getUpgradeMessage()}
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900">Premium Features Include:</p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Unlimited menu items</li>
                  <li>Unlimited restaurant locations</li>
                  <li>All premium themes and fonts</li>
                  <li>Advanced customization options</li>
                  <li>Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onUpgrade()
              onOpenChange(false)
            }}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

