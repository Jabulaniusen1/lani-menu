"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateFilePath, generateMenuFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { Loader2 } from "lucide-react"

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantId: string
  onSuccess: () => void
}

const CATEGORIES = ["appetizers", "mains", "desserts", "drinks", "sides", "specials"]

export function AddMenuItemDialog({ open, onOpenChange, restaurantId, onSuccess }: AddMenuItemDialogProps) {
  const { notify } = useNotification()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      let imageUrl: string | null = null

      // Upload image if provided
      if (imageFile) {
        const filePath = generateMenuFilePath(restaurantId, imageFile.name)
        const { url, error: uploadError } = await uploadFile(imageFile, "menu-assets", filePath)
        
        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError}`)
        }
        
        imageUrl = url
      }

      const { error: insertError } = await supabase.from("menu_items").insert({
        restaurant_id: restaurantId,
        name,
        description: description || null,
        price: Number.parseFloat(price),
        category,
        image_url: imageUrl,
        available: true,
      })

      if (insertError) throw insertError

      // Reset form
      setName("")
      setDescription("")
      setPrice("")
      setCategory("")
      setImageFile(null)
      onOpenChange(false)
      onSuccess()
      notify.success("Menu item added successfully!", `${name} has been added to your menu`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add menu item"
      setError(errorMessage)
      notify.error("Failed to add menu item", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-1 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">Add Menu Item</DialogTitle>
          <DialogDescription className="text-sm">Add a new item to your restaurant menu</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="item-name" className="text-sm">Item Name</Label>
            <Input
              id="item-name"
              type="text"
              placeholder="e.g., Margherita Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="category" className="text-sm">Category</Label>
            <Select value={category} onValueChange={setCategory} required disabled={loading}>
              <SelectTrigger id="category" className="h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize text-sm">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="price" className="text-sm">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={loading}
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="item-description" className="text-sm">Description (Optional)</Label>
            <Textarea
              id="item-description"
              placeholder="Describe your dish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          <FileUpload
            label="Food Image (Optional)"
            onFileSelect={setImageFile}
            currentFile={imageFile}
            disabled={loading}
            maxSize={5}
          />

          {error && (
            <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-2 sm:p-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 h-9 sm:h-10 text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 h-9 sm:h-10 text-sm">
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
