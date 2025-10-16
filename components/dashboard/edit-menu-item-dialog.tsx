"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateMenuFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { Loader2 } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  available: boolean
  image_url: string | null
  restaurant_id: string
}

interface EditMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem
  onSuccess: () => void
}

const CATEGORIES = ["appetizers", "mains", "desserts", "drinks", "sides", "specials"]

export function EditMenuItemDialog({ open, onOpenChange, item, onSuccess }: EditMenuItemDialogProps) {
  const { notify } = useNotification()
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || "")
  const [price, setPrice] = useState(item.price.toString())
  const [category, setCategory] = useState(item.category)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(item.name)
    setDescription(item.description || "")
    setPrice(item.price.toString())
    setCategory(item.category)
    setImageFile(null) // Reset image file when dialog opens
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      let imageUrl = item.image_url // Keep existing image if no new one uploaded

      // Upload new image if provided
      if (imageFile) {
        const filePath = generateMenuFilePath(item.restaurant_id, imageFile.name)
        const { url, error: uploadError } = await uploadFile(imageFile, "menu-assets", filePath)
        
        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError}`)
        }
        
        imageUrl = url
      }

      const { error: updateError } = await supabase
        .from("menu_items")
        .update({
          name,
          description: description || null,
          price: Number.parseFloat(price),
          category,
          image_url: imageUrl,
        })
        .eq("id", item.id)

      if (updateError) throw updateError

      onOpenChange(false)
      onSuccess()
      notify.success("Menu item updated successfully!", `${name} has been updated`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update menu item"
      setError(errorMessage)
      notify.error("Failed to update menu item", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>Update the details of your menu item</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Item Name</Label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required disabled={loading}>
              <SelectTrigger id="edit-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (Optional)</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
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
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
