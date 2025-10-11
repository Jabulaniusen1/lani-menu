"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { EditMenuItemDialog } from "./edit-menu-item-dialog"

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
  onUpdate: () => void
}

export function MenuItemCard({ item, onUpdate }: MenuItemCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleAvailability = async () => {
    setLoading(true)
    const supabase = getSupabaseBrowserClient()

    await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id)

    onUpdate()
    setLoading(false)
  }

  const deleteItem = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return

    setLoading(true)
    const supabase = getSupabaseBrowserClient()

    await supabase.from("menu_items").delete().eq("id", item.id)

    onUpdate()
    setLoading(false)
  }

  return (
    <>
      <Card className={!item.available ? "opacity-60" : ""}>
        <CardContent className="p-4">
          <div className="space-y-3">
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

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={toggleAvailability} disabled={loading}>
                  {item.available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} disabled={loading}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={deleteItem} disabled={loading}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditMenuItemDialog open={editOpen} onOpenChange={setEditOpen} item={item} onSuccess={onUpdate} />
    </>
  )
}
