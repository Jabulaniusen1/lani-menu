"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown, Check, Star, Zap, Users, QrCode, Palette } from "lucide-react"

interface BillingTabProps {
  currentPlan?: string
}

export function BillingTab({ currentPlan = "free" }: BillingTabProps) {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 10 menu items",
        "Basic QR code generation",
        "Standard menu design",
        "Email support"
      ],
      limitations: [
        "Limited customization",
        "Basic analytics"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Best for growing restaurants",
      features: [
        "Unlimited menu items",
        "Advanced QR code customization",
        "Premium menu designs",
        "Priority support",
        "Basic analytics",
        "Custom branding"
      ],
      limitations: [],
      popular: true
    },
    {
      id: "business",
      name: "Business",
      price: "$49",
      period: "per month",
      description: "For multiple locations",
      features: [
        "Everything in Pro",
        "Multiple restaurant locations",
        "Advanced analytics",
        "API access",
        "White-label options",
        "Dedicated support",
        "Custom integrations"
      ],
      limitations: [],
      popular: false
    }
  ]

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <QrCode className="h-6 w-6" />
      case "pro":
        return <Crown className="h-6 w-6" />
      case "business":
        return <Star className="h-6 w-6" />
      default:
        return <QrCode className="h-6 w-6" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free":
        return "bg-gray-100 text-gray-800"
      case "pro":
        return "bg-orange-100 text-orange-800"
      case "business":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getPlanIcon(currentPlan)}
              <div>
                <h3 className="font-semibold capitalize">{currentPlan} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {plans.find(p => p.id === currentPlan)?.description}
                </p>
              </div>
            </div>
            <Badge className={getPlanColor(currentPlan)}>
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'ring-2 ring-orange-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.id === currentPlan ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={plan.id === currentPlan}
                >
                  {plan.id === currentPlan ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Exciting features we're working on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Team Management</h4>
                <p className="text-sm text-muted-foreground">
                  Invite team members and manage permissions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Palette className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Advanced Customization</h4>
                <p className="text-sm text-muted-foreground">
                  More design options and themes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
