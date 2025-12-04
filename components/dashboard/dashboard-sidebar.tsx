"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/contexts/subscription-context"
import { 
  Building2, 
  Star, 
  ChevronDown, 
  LogOut,
  User,
  CreditCard,
  Palette,
  Utensils,
  Settings,
  Plus
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

interface DashboardSidebarProps {
  restaurants: Restaurant[]
  currentRestaurant: Restaurant | null
  activeTab: string
  onTabChange: (tab: string) => void
  onRestaurantChange: (restaurant: Restaurant) => void
  onRestaurantsUpdate: (restaurants: Restaurant[]) => void
  onAddRestaurant: () => void
}

export function DashboardSidebar({
  restaurants,
  currentRestaurant,
  activeTab,
  onTabChange,
  onRestaurantChange,
  onRestaurantsUpdate,
  onAddRestaurant
}: DashboardSidebarProps) {
  const router = useRouter()
  const { subscription } = useSubscription()
  const isPro = subscription?.plan_id === 'pro' || subscription?.plan_id === 'business'

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/sign-in")
  }

  const tabs = [
    { id: "menu", label: "Menu", icon: Utensils },
    { id: "restaurants", label: "Restaurants", icon: Building2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "designs", label: "Designs", icon: Palette }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40 hidden lg:flex">
      {/* Header Section */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 lg:gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
            </div>
            {isPro && (
              <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5">
                PRO
              </Badge>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate">Lani Menu</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>

        {/* Restaurant Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Current Restaurant
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between h-9 lg:h-10 px-2 lg:px-3 text-left"
              >
                <div className="flex items-center gap-1.5 lg:gap-2 flex-1 min-w-0">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    {currentRestaurant?.logo_url ? (
                      <img 
                        src={currentRestaurant.logo_url} 
                        alt={currentRestaurant.name}
                        className="w-4 h-4 lg:w-5 lg:h-5 rounded object-cover"
                      />
                    ) : (
                      <Building2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs lg:text-sm truncate">
                      {currentRestaurant?.name || "Select Restaurant"}
                    </div>
                    {currentRestaurant?.is_primary && (
                      <div className="text-xs text-gray-500">Primary</div>
                    )}
                  </div>
                  {currentRestaurant?.is_primary && (
                    <Star className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>
                <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Switch Restaurant</span>
                <span className="text-xs text-muted-foreground">
                  {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {restaurants.map((restaurant) => (
                <DropdownMenuItem
                  key={restaurant.id}
                  onClick={() => onRestaurantChange(restaurant)}
                  className="flex items-center justify-between p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {restaurant.logo_url ? (
                        <img 
                          src={restaurant.logo_url} 
                          alt={restaurant.name}
                          className="w-6 h-6 rounded object-cover"
                        />
                      ) : (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">{restaurant.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {restaurant.description || "No description"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {restaurant.is_primary && (
                      <Badge variant="secondary" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAddRestaurant} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add New Restaurant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-3 lg:p-4">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                <span className="font-medium text-sm lg:text-base truncate">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer with Logout */}
      <div className="p-3 lg:p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2 lg:gap-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 h-9 lg:h-10"
        >
          <LogOut className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
          <span className="font-medium text-sm lg:text-base">Logout</span>
        </Button>
      </div>
    </div>
  )
}
