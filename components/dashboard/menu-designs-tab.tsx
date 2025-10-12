"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Sparkles, Clock, Star, Zap, Eye, Download } from "lucide-react"

export function MenuDesignsTab() {
  const comingSoonFeatures = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Custom Themes",
      description: "Choose from beautiful pre-designed themes or create your own custom color schemes",
      status: "Coming Soon",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Advanced Layouts",
      description: "Multiple layout options including grid, list, and card-based designs",
      status: "In Development",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Live Preview",
      description: "See your menu changes in real-time as you customize the design",
      status: "Coming Soon",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "PDF Export",
      description: "Download your menu as a high-quality PDF for printing",
      status: "Planned",
      color: "bg-orange-100 text-orange-800"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Animation Effects",
      description: "Add subtle animations and transitions to make your menu more engaging",
      status: "Planned",
      color: "bg-pink-100 text-pink-800"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Premium Templates",
      description: "Access to exclusive designer-created menu templates",
      status: "Coming Soon",
      color: "bg-yellow-100 text-yellow-800"
    }
  ]

  const designCategories = [
    {
      name: "Modern",
      description: "Clean, minimalist designs with bold typography",
      preview: "🖤",
      comingSoon: true
    },
    {
      name: "Classic",
      description: "Traditional restaurant menu layouts",
      preview: "📜",
      comingSoon: true
    },
    {
      name: "Creative",
      description: "Unique, artistic designs for standout menus",
      preview: "🎨",
      comingSoon: true
    },
    {
      name: "Minimalist",
      description: "Simple, elegant designs focused on content",
      preview: "⚪",
      comingSoon: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-full">
            <Palette className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold">Menu Designs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize your menu's appearance with beautiful themes, layouts, and styling options. 
          This feature is coming soon and will give you complete control over your menu's design.
        </p>
      </div>

      {/* Current Status */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Clock className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Design Customization Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                We're working hard to bring you powerful menu design tools. 
                For now, you can still create and manage your menu items.
              </p>
              <Badge variant="outline" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                In Development
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Categories Preview */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Design Categories</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {designCategories.map((category, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
              <CardContent className="relative p-6 text-center space-y-4">
                <div className="text-4xl">{category.preview}</div>
                <div>
                  <h4 className="font-semibold text-lg">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Badge variant="secondary" className="w-full">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Coming Soon */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Features Coming Soon</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {comingSoonFeatures.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{feature.title}</h4>
                      <Badge className={feature.color}>
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-orange-500 p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Want to be notified when menu designs are available? 
                We'll send you an email as soon as this feature is ready.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Zap className="h-4 w-4 mr-2" />
                Notify Me When Ready
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
