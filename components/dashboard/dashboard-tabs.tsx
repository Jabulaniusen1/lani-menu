"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ProfileTab } from "./profile-tab"
import { BillingTab } from "./billing-tab"
import { MenuDesignsTab } from "./menu-designs-tab"
import { RestaurantsOverview } from "./restaurants-overview"
import { MenuManager } from "./menu-manager"
import { DashboardSidebar } from "./dashboard-sidebar"

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

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <DashboardSidebar
        restaurants={restaurants}
        currentRestaurant={restaurant}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRestaurantChange={onRestaurantChange}
        onRestaurantsUpdate={onRestaurantsUpdate}
        onAddRestaurant={onAddRestaurant}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6">
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
