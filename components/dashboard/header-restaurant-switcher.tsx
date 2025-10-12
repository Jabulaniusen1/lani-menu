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
import { useNotification } from "@/hooks/use-notification"
import { 
  ChevronDown, 
  Building2, 
  Star, 
  Check,
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

interface HeaderRestaurantSwitcherProps {
  restaurants: Restaurant[]
  currentRestaurant: Restaurant | null
  onRestaurantChange: (restaurant: Restaurant) => void
  onRestaurantsUpdate: (restaurants: Restaurant[]) => void
  onAddRestaurant: () => void
}

export function HeaderRestaurantSwitcher({ 
  restaurants, 
  currentRestaurant, 
  onRestaurantChange, 
  onRestaurantsUpdate,
  onAddRestaurant
}: HeaderRestaurantSwitcherProps) {
  const { notify } = useNotification()

  const handleSetPrimary = async (restaurantId: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Update all restaurants to not primary
      const { error: unsetError } = await supabase
        .from("user_restaurants")
        .update({ is_primary: false })
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)

      if (unsetError) throw unsetError

      // Set selected restaurant as primary
      const { error: setError } = await supabase
        .from("user_restaurants")
        .update({ is_primary: true })
        .eq("restaurant_id", restaurantId)

      if (setError) throw setError

      // Update local state
      const updatedRestaurants = restaurants.map(r => ({
        ...r,
        is_primary: r.id === restaurantId
      }))

      onRestaurantsUpdate(updatedRestaurants)
      notify.success("Primary restaurant updated", "Your primary restaurant has been changed")
    } catch (error) {
      notify.error("Failed to update primary restaurant", error instanceof Error ? error.message : "Unknown error")
    }
  }

  if (restaurants.length === 0) {
    return (
      <Button variant="outline" onClick={onAddRestaurant}>
        <Plus className="h-4 w-4 mr-2" />
        Add Restaurant
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[180px] justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium truncate">
                {currentRestaurant?.name || "Select Restaurant"}
              </div>
            </div>
            {currentRestaurant?.is_primary && (
              <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
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
                <div className="font-medium truncate">{restaurant.name}</div>
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
              {restaurant.id === currentRestaurant?.id && (
                <Check className="h-4 w-4 text-green-500" />
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
  )
}
