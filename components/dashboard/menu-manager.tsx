"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Plus, ExternalLink, QrCode, Crown, AlertCircle } from "lucide-react"
import { AddMenuItemDialog } from "./add-menu-item-dialog"
import { MenuItemCard } from "./menu-item-card"
import { QRCodeDialog } from "./qr-code-dialog"
import { useSubscription } from "@/contexts/subscription-context"
import { useNotification } from "@/hooks/use-notification"
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
  const { subscription, canAddMenuItem } = useSubscription()
  const { notify } = useNotification()

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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Your Digital Menu</CardTitle>
              <CardDescription className="text-sm">Manage your menu items and share with customers</CardDescription>
            </div>
            <div className="flex flex-row gap-2">
              <Button variant="outline" size="sm" onClick={() => setQrDialogOpen(true)} className="">
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
              <Link href={`/menu/${restaurant.slug}`} target="_blank" className=" ">
                <Button variant="outline" size="sm" className=" ">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Menu Items</h2>
          {subscription?.plan_id === 'free' && (
            <Badge variant="outline" className="text-xs">
              {menuItems.length}/5 items
            </Badge>
          )}
        </div>
        <Button 
          onClick={async () => {
            const canAdd = await canAddMenuItem(restaurant.id)
            if (canAdd) {
              setDialogOpen(true)
            } else {
              notify.error(
                'Menu item limit reached', 
                'Upgrade to Pro or Business plan to add more menu items'
              )
            }
          }}
          className="w-full sm:w-auto"
        >
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
            <Button 
              onClick={async () => {
                const canAdd = await canAddMenuItem(restaurant.id)
                if (canAdd) {
                  setDialogOpen(true)
                } else {
                  notify.error(
                    'Menu item limit reached', 
                    'Upgrade to Pro or Business plan to add more menu items'
                  )
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 capitalize">{category}</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={{ ...item, restaurant_id: restaurant.id }}
                    currency={currentCurrency}
                    onUpdate={fetchMenuItems}
                  />
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
