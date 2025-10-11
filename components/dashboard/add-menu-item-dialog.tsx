"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantId: string
  onSuccess: () => void
}

const CATEGORIES = ["appetizers", "mains", "desserts", "drinks", "sides", "specials"]

export function AddMenuItemDialog({ open, onOpenChange, restaurantId, onSuccess }: AddMenuItemDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error: insertError } = await supabase.from("menu_items").insert({
        restaurant_id: restaurantId,
        name,
        description: description || null,
        price: Number.parseFloat(price),
        category,
        available: true,
      })

      if (insertError) throw insertError

      // Reset form
      setName("")
      setDescription("")
      setPrice("")
      setCategory("")
      onOpenChange(false)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add menu item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>Add a new item to your restaurant menu</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              type="text"
              placeholder="e.g., Margherita Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required disabled={loading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
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
            <Label htmlFor="price">Price</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-description">Description (Optional)</Label>
            <Textarea
              id="item-description"
              placeholder="Describe your dish..."
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
