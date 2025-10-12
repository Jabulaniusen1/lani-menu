"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SimpleCurrencySelector } from "@/components/ui/currency-selector"
import { FileUpload } from "@/components/ui/file-upload"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { 
  Building2, 
  Star, 
  Settings, 
  Trash2, 
  Plus, 
  Loader2,
  Edit,
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

interface RestaurantsTabProps {
  restaurants: Restaurant[]
  currentRestaurant: Restaurant | null
  onRestaurantChange: (restaurant: Restaurant) => void
  onRestaurantsUpdate: (restaurants: Restaurant[]) => void
}

export function RestaurantsTab({ 
  restaurants, 
  currentRestaurant, 
  onRestaurantChange, 
  onRestaurantsUpdate 
}: RestaurantsTabProps) {
  const { notify } = useNotification()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(false)
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

      onRestaurantsUpdate(updatedRestaurants)
      
      // If this is the first restaurant, switch to it
      if (restaurants.length === 0) {
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

  const handleDeleteRestaurant = async (restaurantId: string) => {
    if (!confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) {
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      
      // Delete from user_restaurants first
      const { error: userRestaurantError } = await supabase
        .from("user_restaurants")
        .delete()
        .eq("restaurant_id", restaurantId)

      if (userRestaurantError) throw userRestaurantError

      // Delete the restaurant
      const { error: restaurantError } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurantId)

      if (restaurantError) throw restaurantError

      // Update local state
      const updatedRestaurants = restaurants.filter(r => r.id !== restaurantId)
      onRestaurantsUpdate(updatedRestaurants)

      // If we deleted the current restaurant, switch to another one
      if (currentRestaurant?.id === restaurantId) {
        const newCurrent = updatedRestaurants.find(r => r.is_primary) || updatedRestaurants[0]
        if (newCurrent) {
          onRestaurantChange(newCurrent)
        }
      }

      notify.success("Restaurant deleted", "The restaurant has been removed from your account")
    } catch (error) {
      notify.error("Failed to delete restaurant", error instanceof Error ? error.message : "Unknown error")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Restaurants</h2>
          <p className="text-muted-foreground">
            Manage your restaurants and switch between them
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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
                    onValueChange={(value) => setNewRestaurant(prev => ({ ...prev, currency: value }))}
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
      </div>

      {/* Restaurants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className={`${restaurant.id === currentRestaurant?.id ? 'ring-2 ring-orange-500' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  {restaurant.is_primary && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {restaurant.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Currency:</span>
                  <span>{restaurant.currency}</span>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(restaurant.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestaurantChange(restaurant)}
                  className="flex-1"
                >
                  {restaurant.id === currentRestaurant?.id ? "Current" : "Switch To"}
                </Button>
                
                {!restaurant.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPrimary(restaurant.id)}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRestaurant(restaurant.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Restaurants Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first restaurant to get started with managing your menus.
          </p>
        </div>
      )}
    </div>
  )
}
