"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  available: boolean
}

interface EditMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem
  onSuccess: () => void
}

const CATEGORIES = ["appetizers", "mains", "desserts", "drinks", "sides", "specials"]

export function EditMenuItemDialog({ open, onOpenChange, item, onSuccess }: EditMenuItemDialogProps) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || "")
  const [price, setPrice] = useState(item.price.toString())
  const [category, setCategory] = useState(item.category)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(item.name)
    setDescription(item.description || "")
    setPrice(item.price.toString())
    setCategory(item.category)
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error: updateError } = await supabase
        .from("menu_items")
        .update({
          name,
          description: description || null,
          price: Number.parseFloat(price),
          category,
        })
        .eq("id", item.id)

      if (updateError) throw updateError

      onOpenChange(false)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update menu item")
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
