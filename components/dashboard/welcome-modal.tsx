"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, Star, Check, Sparkles } from "lucide-react"

interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planName: string
  planId: string
  features: string[]
}

export function WelcomeModal({ 
  open, 
  onOpenChange, 
  planName, 
  planId,
  features 
}: WelcomeModalProps) {
  const getPlanIcon = () => {
    switch (planId) {
      case "pro":
        return <Crown className="h-8 w-8 text-orange-600" />
      case "business":
        return <Star className="h-8 w-8 text-purple-600" />
      default:
        return <Sparkles className="h-8 w-8 text-blue-600" />
    }
  }

  const getPlanColor = () => {
    switch (planId) {
      case "pro":
        return "bg-orange-50 border-orange-200"
      case "business":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getTitleColor = () => {
    switch (planId) {
      case "pro":
        return "text-orange-600"
      case "business":
        return "text-purple-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4 pb-4">
            <div className={`p-4 rounded-full ${getPlanColor()}`}>
              {getPlanIcon()}
            </div>
            <div>
              <DialogTitle className={`text-3xl font-bold ${getTitleColor()}`}>
                Welcome to {planName}!
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Your subscription is now active. Here's what you can do:
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className={`${getPlanColor()} border rounded-lg p-4`}>
            <h3 className="font-semibold text-lg mb-3">Your Benefits:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>🎉 Congratulations!</strong> You now have access to all premium features. 
              Start exploring your dashboard to make the most of your subscription.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

