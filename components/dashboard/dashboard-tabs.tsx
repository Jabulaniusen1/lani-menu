"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProfileTab } from "./profile-tab"
import { BillingTab } from "./billing-tab"
import { MenuDesignsTab } from "./menu-designs-tab"
import { RestaurantsOverview } from "./restaurants-overview"
import { MenuManager } from "./menu-manager"
import { DashboardSidebar } from "./dashboard-sidebar"
import { 
  Menu, 
  X, 
  Utensils, 
  Building2, 
  User, 
  CreditCard, 
  Palette 
} from "lucide-react"

interface Restaurant {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  address: string | null
  website: string | null
  currency: string
  logo_url: string | null
  created_at: string
  updated_at: string
  is_primary: boolean
  user_id: string
}

interface DashboardTabsProps {
  restaurant: Restaurant
  onRestaurantUpdate: (updatedRestaurant: Restaurant) => void
  restaurants?: Restaurant[]
  onRestaurantsUpdate?: (restaurants: Restaurant[]) => void
  onRestaurantChange?: (restaurant: Restaurant) => void
  onAddRestaurant?: () => void
}

export function DashboardTabs({ 
  restaurant, 
  onRestaurantUpdate, 
  restaurants = [], 
  onRestaurantsUpdate = () => {}, 
  onRestaurantChange = () => {},
  onAddRestaurant = () => {}
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("menu")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: "menu", label: "Menu", icon: Utensils },
    { id: "restaurants", label: "Restaurants", icon: Building2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "designs", label: "Designs", icon: Palette }
  ]

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar - Desktop Only */}
      <DashboardSidebar
        restaurants={restaurants}
        currentRestaurant={restaurant}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRestaurantChange={onRestaurantChange}
        onRestaurantsUpdate={onRestaurantsUpdate}
        onAddRestaurant={onAddRestaurant}
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-3 w-3 text-white" />
                  </div>
                  <h1 className="text-base font-semibold text-gray-900">Lani Menu</h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden border-b bg-background sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{restaurant.name}</h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="menu" className="mt-0">
              <MenuManager restaurant={restaurant} />
            </TabsContent>

            <TabsContent value="restaurants" className="mt-0">
              <RestaurantsOverview
                restaurants={restaurants}
                currentRestaurant={restaurant}
                onRestaurantChange={onRestaurantChange}
                onRestaurantsUpdate={onRestaurantsUpdate}
              />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <ProfileTab 
                restaurant={restaurant} 
                onRestaurantUpdate={onRestaurantUpdate}
              />
            </TabsContent>

            <TabsContent value="billing" className="mt-0">
              <BillingTab currentPlan="free" />
            </TabsContent>

            <TabsContent value="designs" className="mt-0">
              <MenuDesignsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
