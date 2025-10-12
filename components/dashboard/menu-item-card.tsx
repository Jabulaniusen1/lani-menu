"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { EditMenuItemDialog } from "./edit-menu-item-dialog"
import { formatPrice } from "@/lib/currency"
import { useNotification } from "@/hooks/use-notification"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  available: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  currency: string
  onUpdate: () => void
}

export function MenuItemCard({ item, currency, onUpdate }: MenuItemCardProps) {
  const { notify } = useNotification()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const toggleAvailability = async () => {
    setLoading(true)
    const supabase = getSupabaseBrowserClient()

    await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id)

    onUpdate()
    setLoading(false)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("menu_items").delete().eq("id", item.id)

      if (error) throw error

      setDeleteDialogOpen(false)
      onUpdate()
      notify.success("Menu item deleted", "The item has been removed from your menu")
    } catch (error) {
      notify.error("Failed to delete item", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <Card className={!item.available ? "opacity-60" : ""}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {item.image_url && (
                <div className="w-16 h-16 shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg leading-tight">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <Badge variant={item.available ? "default" : "secondary"} className="shrink-0">
                    {item.available ? "Available" : "Hidden"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">{formatPrice(item.price, currency)}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={toggleAvailability} disabled={loading}>
                  {item.available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} disabled={loading}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDeleteClick} disabled={loading || deleteLoading}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditMenuItemDialog open={editOpen} onOpenChange={setEditOpen} item={item} onSuccess={onUpdate} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${item.name}"? This action cannot be undone and will permanently remove the item from your menu.`}
        confirmText="Delete Item"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
