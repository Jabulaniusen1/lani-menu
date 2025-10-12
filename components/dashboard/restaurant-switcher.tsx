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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SimpleCurrencySelector } from "@/components/ui/simple-currency-selector"
import { FileUpload } from "@/components/ui/file-upload"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { 
  ChevronDown, 
  Plus, 
  Building2, 
  Star, 
  Check,
  Loader2,
  Settings,
  ExternalLink
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

interface RestaurantSwitcherProps {
  restaurants: Restaurant[]
  currentRestaurant: Restaurant | null
  onRestaurantChange: (restaurant: Restaurant) => void
  onRestaurantsUpdate: (restaurants: Restaurant[]) => void
  className?: string
}

export function RestaurantSwitcher({ 
  restaurants, 
  currentRestaurant, 
  onRestaurantChange, 
  onRestaurantsUpdate,
  className 
}: RestaurantSwitcherProps) {
  const { notify } = useNotification()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    website: "",
    currency: "USD"
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleCreateRestaurant = async () => {
    if (!newRestaurant.name.trim()) {
      notify.error("Restaurant name is required", "Please enter a name for your restaurant")
      return
    }

    setLoading(true)
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
          is_primary: restaurants.length === 0 // First restaurant is primary
        })

      if (userRestaurantError) throw userRestaurantError

      // Add to restaurants list
      const updatedRestaurants = [
        ...restaurants,
        { ...restaurant, is_primary: restaurants.length === 0 }
      ]

      console.log('Restaurant created successfully:', restaurant)
      console.log('Updated restaurants list:', updatedRestaurants)
      console.log('Is first restaurant:', restaurants.length === 0)

      onRestaurantsUpdate(updatedRestaurants)
      
      // If this is the first restaurant, switch to it
      if (restaurants.length === 0) {
        console.log('Switching to first restaurant:', { ...restaurant, is_primary: true })
        onRestaurantChange({ ...restaurant, is_primary: true })
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
      setCreateDialogOpen(false)

      notify.success("Restaurant created successfully!", "Your new restaurant has been added")
    } catch (error) {
      notify.error("Failed to create restaurant", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

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

  const handleDeleteClick = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return

    setDeleteLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Delete from user_restaurants first
      const { error: userRestaurantError } = await supabase
        .from("user_restaurants")
        .delete()
        .eq("restaurant_id", restaurantToDelete.id)

      if (userRestaurantError) throw userRestaurantError

      // Delete the restaurant
      const { error: restaurantError } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurantToDelete.id)

      if (restaurantError) throw restaurantError

      // Update local state
      const updatedRestaurants = restaurants.filter(r => r.id !== restaurantToDelete.id)
      onRestaurantsUpdate(updatedRestaurants)

      // If we deleted the current restaurant, switch to another one
      if (currentRestaurant?.id === restaurantToDelete.id) {
        const newCurrent = updatedRestaurants.find(r => r.is_primary) || updatedRestaurants[0]
        if (newCurrent) {
          onRestaurantChange(newCurrent)
        }
      }

      setDeleteDialogOpen(false)
      setRestaurantToDelete(null)
      notify.success("Restaurant deleted", "The restaurant has been removed from your account")
    } catch (error) {
      notify.error("Failed to delete restaurant", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Restaurant Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 min-w-[200px] justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium truncate">
                  {currentRestaurant?.name || "Select Restaurant"}
                </div>
                {currentRestaurant && (
                  <div className="text-xs text-muted-foreground truncate">
                    {currentRestaurant.description || "No description"}
                  </div>
                )}
              </div>
              {currentRestaurant?.is_primary && (
                <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Your Restaurants</span>
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
                  <div className="text-xs text-muted-foreground">
                    {restaurant.currency} • {new Date(restaurant.created_at).toLocaleDateString()}
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
          
          {restaurants.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Right-click to set as primary
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Restaurant Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md overflow-visible">
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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <SimpleCurrencySelector
                  value={newRestaurant.currency}
                  onValueChange={(value) => {
                    console.log('Currency changed in restaurant switcher:', value)
                    setNewRestaurant(prev => ({ ...prev, currency: value }))
                  }}
                  placeholder="Select currency"
                  disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRestaurant}
                disabled={loading || !newRestaurant.name.trim()}
              >
                {loading ? (
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Restaurant"
        description={`Are you sure you want to delete "${restaurantToDelete?.name}"? This action cannot be undone and will permanently remove the restaurant and all its data.`}
        confirmText="Delete Restaurant"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
