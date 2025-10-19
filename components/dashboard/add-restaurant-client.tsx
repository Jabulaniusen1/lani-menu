"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useSubscription } from "@/contexts/subscription-context"
import { Loader2, Store, AlertCircle } from "lucide-react"

interface AddRestaurantClientProps {
  userId: string
}

export function AddRestaurantClient({ userId }: AddRestaurantClientProps) {
  const router = useRouter()
  const { notify } = useNotification()
  const { canAddRestaurant } = useSubscription()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check if user can add more restaurants
      const canAdd = await canAddRestaurant()
      if (!canAdd) {
        notify.error(
          'Restaurant limit reached',
          'Upgrade to Pro or Business plan to add more restaurants'
        )
        setLoading(false)
        return
      }
      
      const supabase = getSupabaseBrowserClient()
      const slug = generateSlug(name)
      let logoUrl: string | null = null

      // Upload logo if provided
      if (logoFile) {
        const filePath = generateFilePath(userId, "logo", logoFile.name)
        const { url, error: uploadError } = await uploadFile(logoFile, "restaurant-assets", filePath)
        
        if (uploadError) {
          throw new Error(`Failed to upload logo: ${uploadError}`)
        }
        
        logoUrl = url
      }

      // First, insert the restaurant
      const { data: insertData, error: insertError } = await supabase.from("restaurants").insert({
        user_id: userId,
        name,
        description,
        currency,
        logo_url: logoUrl,
        slug,
      }).select()

      if (insertError) throw insertError

      const restaurantId = insertData[0].id

      // Then, create the user_restaurants relationship
      const { error: userRestaurantError } = await supabase.from("user_restaurants").insert({
        user_id: userId,
        restaurant_id: restaurantId,
        is_primary: true // First restaurant is always primary
      })

      if (userRestaurantError) throw userRestaurantError

      console.log('Restaurant created successfully:', insertData)
      notify.success("Restaurant created successfully!", "Redirecting to dashboard...")
      
      // Add a small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to dashboard after successful creation
      router.push("/dashboard")
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create restaurant"
      setError(errorMessage)
      notify.error("Failed to create restaurant", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Welcome to Lani Menu!</CardTitle>
            <CardDescription className="text-sm sm:text-base">Let's set up your restaurant profile to get started</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., The Golden Spoon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell customers about your restaurant..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <SimpleCurrencySelector
                  value={currency}
                  onValueChange={setCurrency}
                  placeholder="Select currency"
                  disabled={loading}
                />
              </div>

              <FileUpload
                label="Restaurant Logo (Optional)"
                onFileSelect={setLogoFile}
                currentFile={logoFile}
                disabled={loading}
                maxSize={5}
              />

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-10 sm:h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm sm:text-base">Creating restaurant...</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base">Create Restaurant</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
