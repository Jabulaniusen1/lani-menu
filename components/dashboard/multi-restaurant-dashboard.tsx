"use client"

import { useState, useEffect } from "react"
import { DashboardTabs } from "./dashboard-tabs"
import { RestaurantSwitcher } from "./restaurant-switcher"
import { HeaderRestaurantSwitcher } from "./header-restaurant-switcher"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SimpleCurrencySelector } from "@/components/ui/simple-currency-selector"
import { FileUpload } from "@/components/ui/file-upload"
import { uploadFile, generateFilePath } from "@/lib/storage"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useNotification } from "@/hooks/use-notification"
import { Loader2, Building2, Plus } from "lucide-react"

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

interface MultiRestaurantDashboardProps {
  initialRestaurants: Restaurant[]
  userId: string
  onRestaurantsUpdate?: (restaurants: Restaurant[]) => void
  onRestaurantChange?: (restaurant: Restaurant) => void
}

export function MultiRestaurantDashboard({ initialRestaurants, userId, onRestaurantsUpdate, onRestaurantChange }: MultiRestaurantDashboardProps) {
  const { notify } = useNotification()
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(
    initialRestaurants.find(r => r.is_primary) || initialRestaurants[0] || null
  )
  const [loading, setLoading] = useState(false)
  const [showAddRestaurant, setShowAddRestaurant] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    website: "",
    currency: "USD"
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants()
  }, [])

  // Fetch restaurants from database
  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      const { data, error } = await supabase
        .rpc('get_user_restaurants', { user_uuid: userId })

      if (error) throw error

      setRestaurants(data || [])
      
      // Set current restaurant to primary or first available
      const primaryRestaurant = data?.find((r: Restaurant) => r.is_primary) || data?.[0]
      if (primaryRestaurant) {
        setCurrentRestaurant(primaryRestaurant)
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      notify.error("Failed to load restaurants", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleRestaurantChange = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant)
    // Call parent callback to reload page
    if (onRestaurantChange) {
      onRestaurantChange(restaurant)
    }
  }

  const handleRestaurantsUpdate = (updatedRestaurants: Restaurant[]) => {
    console.log('Updating restaurants:', updatedRestaurants)
    console.log('Current restaurants before update:', restaurants)
    setRestaurants(updatedRestaurants)
    
    // Notify parent component about the update
    if (onRestaurantsUpdate) {
      onRestaurantsUpdate(updatedRestaurants)
    }
    
    // If current restaurant is not in the updated list, switch to primary or first
    const currentExists = updatedRestaurants.find(r => r.id === currentRestaurant?.id)
    if (!currentExists) {
      const primaryRestaurant = updatedRestaurants.find(r => r.is_primary) || updatedRestaurants[0]
      if (primaryRestaurant) {
        console.log('Switching to restaurant:', primaryRestaurant)
        setCurrentRestaurant(primaryRestaurant)
      }
    } else {
      console.log('Current restaurant still exists, no need to switch')
    }
  }

  const handleRestaurantUpdate = (updatedRestaurant: Restaurant) => {
    // Update the restaurant in the restaurants list
    const updatedRestaurants = restaurants.map(r => 
      r.id === updatedRestaurant.id ? updatedRestaurant : r
    )
    setRestaurants(updatedRestaurants)
    
    // Update current restaurant if it's the one being updated
    if (currentRestaurant?.id === updatedRestaurant.id) {
      setCurrentRestaurant(updatedRestaurant)
    }
  }

  // If no restaurants, show empty state
  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Restaurants Found</h3>
        <p className="text-muted-foreground mb-4">
          You don't have any restaurants yet. Create your first restaurant to get started.
        </p>
        <RestaurantSwitcher
          restaurants={[]}
          currentRestaurant={null}
          onRestaurantChange={() => {}}
          onRestaurantsUpdate={handleRestaurantsUpdate}
        />
      </div>
    )
  }

  // If no current restaurant selected, select the first one
  if (!currentRestaurant && restaurants.length > 0) {
    setCurrentRestaurant(restaurants[0])
  }

  const handleCreateRestaurant = async () => {
    if (!newRestaurant.name.trim()) {
      notify.error("Restaurant name is required", "Please enter a name for your restaurant")
      return
    }

    setCreateLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      let logoUrl = null

      // Upload logo if selected
      if (logoFile) {
        const tempId = crypto.randomUUID()
        const filePath = generateFilePath(tempId, "logo", logoFile.name)
        const { url, error: uploadError } = await uploadFile(logoFile, "restaurant-assets", filePath)
        
        if (uploadError) throw uploadError
        logoUrl = url
      }

      // Create restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .insert({
          name: newRestaurant.name,
          description: newRestaurant.description || null,
          phone: newRestaurant.phone || null,
          address: newRestaurant.address || null,
          website: newRestaurant.website || null,
          currency: newRestaurant.currency,
          logo_url: logoUrl,
          slug: newRestaurant.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          user_id: user.id
        })
        .select()
        .single()

      if (restaurantError) throw restaurantError

      // Add to user_restaurants table
      const { error: userRestaurantError } = await supabase
        .from("user_restaurants")
        .insert({
          user_id: user.id,
          restaurant_id: restaurant.id,
          is_primary: restaurants.length === 0
        })

      if (userRestaurantError) throw userRestaurantError

      // Add to restaurants list
      const updatedRestaurants = [
        ...restaurants,
        { ...restaurant, is_primary: restaurants.length === 0 }
      ]

      onRestaurantsUpdate?.(updatedRestaurants)
      
      // If this is the first restaurant, switch to it
      if (restaurants.length === 0) {
        onRestaurantChange?.({ ...restaurant, is_primary: true })
      }
      
      // Reset form
      setNewRestaurant({
        name: "",
        description: "",
        phone: "",
        address: "",
        website: "",
        currency: "USD"
      })
      setLogoFile(null)
      setShowAddRestaurant(false)

      notify.success("Restaurant created successfully!", "Your new restaurant has been added")
    } catch (error) {
      notify.error("Failed to create restaurant", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <div className="h-screen">
      {/* Current Restaurant Dashboard */}
      {currentRestaurant ? (
        <DashboardTabs
          restaurant={currentRestaurant}
          onRestaurantUpdate={handleRestaurantUpdate}
          restaurants={restaurants}
          onRestaurantsUpdate={handleRestaurantsUpdate}
          onRestaurantChange={handleRestaurantChange}
          onAddRestaurant={() => setShowAddRestaurant(true)}
        />
      ) : (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Create Restaurant Dialog */}
      <Dialog open={showAddRestaurant} onOpenChange={setShowAddRestaurant}>
        <DialogContent className="max-w-sm sm:max-w-md overflow-visible">
          <DialogHeader>
            <DialogTitle>Create New Restaurant</DialogTitle>
            <DialogDescription>
              Add another restaurant to your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter restaurant name"
                disabled={createLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRestaurant.description}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell customers about your restaurant..."
                rows={3}
                disabled={createLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newRestaurant.phone}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  disabled={createLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <SimpleCurrencySelector
                  value={newRestaurant.currency}
                  onValueChange={(value) => setNewRestaurant(prev => ({ ...prev, currency: value }))}
                  placeholder="Select currency"
                  disabled={createLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Restaurant Logo (Optional)</Label>
              <FileUpload
                onFileSelect={setLogoFile}
                currentFile={logoFile}
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                disabled={createLoading}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddRestaurant(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRestaurant}
                disabled={createLoading || !newRestaurant.name.trim()}
              >
                {createLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Restaurant"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
