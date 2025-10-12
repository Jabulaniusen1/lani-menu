"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Plus, ExternalLink, QrCode } from "lucide-react"
import { AddMenuItemDialog } from "./add-menu-item-dialog"
import { MenuItemCard } from "./menu-item-card"
import { QRCodeDialog } from "./qr-code-dialog"
// import { CurrencySettings } from "./currency-settings"
import Link from "next/link"

interface Restaurant {
  id: string
  name: string
  slug: string
  description: string | null
  currency: string
}

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  available: boolean
}

interface MenuManagerProps {
  restaurant: Restaurant
}

export function MenuManager({ restaurant }: MenuManagerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState(restaurant.currency)

  const fetchMenuItems = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (data) {
      setMenuItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMenuItems()
  }, [restaurant.id])

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  const menuUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${restaurant.slug}`

  return (
    <div className="space-y-6">
      {/* <CurrencySettings
        restaurantId={restaurant.id}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
      /> */}
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Your Digital Menu</CardTitle>
              <CardDescription>Manage your menu items and share with customers</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setQrDialogOpen(true)}>
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
              <Link href={`/menu/${restaurant.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Your menu URL:</p>
            <code className="text-sm bg-background px-3 py-2 rounded border block break-all">{menuUrl}</code>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading menu items...</div>
      ) : menuItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No menu items yet. Add your first item to get started!</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} currency={currentCurrency} onUpdate={fetchMenuItems} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        restaurantId={restaurant.id}
        onSuccess={fetchMenuItems}
      />

      <QRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        menuUrl={menuUrl}
        restaurantName={restaurant.name}
      />
    </div>
  )
}
