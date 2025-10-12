"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { SimpleCurrencySelector } from "@/components/ui/simple-currency-selector"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { Loader2, Save, Building2, Phone, MapPin, Globe } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  description: string | null
  phone: string | null
  address: string | null
  website: string | null
  currency: string
  logo_url: string | null
  slug: string
  created_at: string
  updated_at: string
  is_primary: boolean
  user_id: string
}

interface ProfileTabProps {
  restaurant: Restaurant
  onRestaurantUpdate: (updatedRestaurant: Restaurant) => void
}

export function ProfileTab({ restaurant, onRestaurantUpdate }: ProfileTabProps) {
  const { notify } = useNotification()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: restaurant.name || "",
    description: restaurant.description || "",
    phone: restaurant.phone || "",
    address: restaurant.address || "",
    website: restaurant.website || "",
    currency: restaurant.currency || "USD"
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Sync form data with restaurant prop changes
  useEffect(() => {
    console.log('Restaurant data updated:', {
      name: restaurant.name,
      currency: restaurant.currency,
      description: restaurant.description
    })
    setFormData({
      name: restaurant.name || "",
      description: restaurant.description || "",
      phone: restaurant.phone || "",
      address: restaurant.address || "",
      website: restaurant.website || "",
      currency: restaurant.currency || "USD"
    })
  }, [restaurant])

  useEffect(() => {
    const hasFormChanges = 
      formData.name !== restaurant.name ||
      formData.description !== (restaurant.description || "") ||
      formData.phone !== (restaurant.phone || "") ||
      formData.address !== (restaurant.address || "") ||
      formData.website !== (restaurant.website || "") ||
      formData.currency !== restaurant.currency ||
      logoFile !== null

    setHasChanges(hasFormChanges)
  }, [formData, restaurant, logoFile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      let logoUrl = restaurant.logo_url

      // Upload new logo if selected
      if (logoFile) {
        const filePath = generateFilePath(restaurant.id, "logo", logoFile.name)
        const { url, error: uploadError } = await uploadFile(logoFile, "restaurant-assets", filePath)
        
        if (uploadError) throw uploadError
        
        logoUrl = url
      }

      // Update restaurant data
      const { data, error } = await supabase
        .from("restaurants")
        .update({
          name: formData.name,
          description: formData.description || null,
          phone: formData.phone || null,
          address: formData.address || null,
          website: formData.website || null,
          currency: formData.currency,
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", restaurant.id)
        .select()
        .single()

      if (error) throw error

      onRestaurantUpdate(data)
      setLogoFile(null)
      notify.success("Profile updated successfully!", "Your restaurant information has been saved")
    } catch (error) {
      notify.error("Failed to update profile", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your restaurant's basic details and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter restaurant name"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <SimpleCurrencySelector
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
                placeholder="Select currency"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tell customers about your restaurant..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Restaurant Logo</Label>
            <FileUpload
              onFileSelect={setLogoFile}
              currentFile={logoFile || restaurant.logo_url}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Add contact details for your customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourrestaurant.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Restaurant Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your restaurant's full address..."
              rows={3}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading || !hasChanges}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
