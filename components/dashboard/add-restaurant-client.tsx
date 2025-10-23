"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { PdfUpload } from "@/components/ui/pdf-upload"
import { SimpleCurrencySelector } from "@/components/ui/simple-currency-selector"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { Loader2, Store, AlertCircle } from "lucide-react"

interface AddRestaurantClientProps {
  userId: string
}

export function AddRestaurantClient({ userId }: AddRestaurantClientProps) {
  const router = useRouter()
  const { notify } = useNotification()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [menuType, setMenuType] = useState<'items' | 'pdf'>('items')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36)
    return `${baseSlug}-${timestamp}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const slug = generateSlug(name)
      let logoUrl: string | null = null
      let pdfUrl: string | null = null

      // Upload logo if provided
      if (logoFile) {
        const filePath = generateFilePath(userId, "logo", logoFile.name)
        const { url, error: uploadError } = await uploadFile(logoFile, "restaurant-assets", filePath)
        
        if (uploadError) {
          throw new Error(`Failed to upload logo: ${uploadError}`)
        }
        
        logoUrl = url
      }

      // Upload PDF menu if provided
      if (menuType === 'pdf' && pdfFile) {
        const filePath = generateFilePath(userId, "pdf-menu", pdfFile.name)
        const { url, error: uploadError } = await uploadFile(pdfFile, "restaurant-assets", filePath)
        
        if (uploadError) {
          throw new Error(`Failed to upload PDF menu: ${uploadError}`)
        }
        
        pdfUrl = url
      }

      // First, insert the restaurant
      const { data: insertData, error: insertError } = await supabase.from("restaurants").insert({
        user_id: userId,
        name,
        description,
        currency,
        logo_url: logoUrl,
        pdf_menu_url: pdfUrl,
        menu_type: menuType,
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
      let errorMessage = "A restaurant with this exact name already exists. Please try a different name."
      
      if (err instanceof Error) {
        // Check for specific constraint violations
        if (err.message.includes("duplicate key value violates unique constraint")) {
          if (err.message.includes("restaurants_slug_key")) {
            errorMessage = "A restaurant with this exact name already exists. Please try a different name."
          } else if (err.message.includes("restaurants_name_key")) {
            errorMessage = "A restaurant with this exact name already exists. Please try a different name."
          } else {
            errorMessage = "A restaurant with this name already exists. Please try a different name."
          }
        } else if (err.message.includes("duplicate") || err.message.includes("unique") || err.message.includes("constraint")) {
          errorMessage = "A restaurant with this exact name already exists. Please try a different name."
        } else {
          // For any other error, still show the user-friendly message
          errorMessage = "A restaurant with this exact name already exists. Please try a different name."
        }
      }
      
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

              <div className="space-y-2">
                <Label>Menu Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMenuType('items')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      menuType === 'items'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-medium text-sm">Individual Items</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Add menu items one by one
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuType('pdf')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      menuType === 'pdf'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-medium text-sm">PDF Menu</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Upload your existing menu PDF
                    </div>
                  </button>
                </div>
              </div>

              {menuType === 'pdf' && (
                <div className="space-y-2">
                  <Label>PDF Menu</Label>
                  <PdfUpload
                    onFileSelect={setPdfFile}
                    selectedFile={pdfFile}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your restaurant's menu as a PDF file. Max size: 10MB
                  </p>
                </div>
              )}

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
