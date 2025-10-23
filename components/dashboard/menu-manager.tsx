"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Plus, ExternalLink, QrCode, Crown, AlertCircle, Copy } from "lucide-react"
import { AddMenuItemDialog } from "./add-menu-item-dialog"
import { MenuItemCard } from "./menu-item-card"
import { QRCodeDialog } from "./qr-code-dialog"
import { MenuTypeSwitcher } from "./menu-type-switcher"
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
  pdf_menu_url: string | null
  menu_type: string
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
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant)
  const [displayMode, setDisplayMode] = useState<'items' | 'pdf'>('items')
  const { subscription, canAddMenuItem } = useSubscription()
  const { notify } = useNotification()

  const fetchMenuItems = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", currentRestaurant.id)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (data) {
      setMenuItems(data)
    }
    setLoading(false)
  }

  const refreshRestaurantData = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", currentRestaurant.id)
      .single()

    if (data) {
      setCurrentRestaurant(data)
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [currentRestaurant.id])

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
      {/* Menu Type Switcher */}
      <MenuTypeSwitcher 
        restaurant={currentRestaurant} 
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        onMenuTypeChange={async () => {
          await refreshRestaurantData()
          await fetchMenuItems()
        }}
      />

      {/* QR Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Menu URL</span>
              <Badge variant="outline">
                {displayMode === 'items' ? 'Individual Items' : 'PDF Menu'}
              </Badge>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-sm break-all">{menuUrl}</code>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(menuUrl)
                  notify.success('Copied to clipboard!', 'Menu URL copied successfully')
                }}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(menuUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <QrCode className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-800">Generate QR Code</span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Generate a QR code for this URL to place on tables, menus, or promotional materials.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQrDialogOpen(true)}
              className="w-full"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {displayMode === 'items' && (
        <>
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
                const canAdd = await canAddMenuItem(currentRestaurant.id)
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
        </>
      )}

      {displayMode === 'items' && (
        <>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading menu items...</div>
          ) : menuItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No menu items yet. Add your first item to get started!</p>
                <Button 
                  onClick={async () => {
                    const canAdd = await canAddMenuItem(currentRestaurant.id)
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
                        item={{ ...item, restaurant_id: currentRestaurant.id }}
                        currency={currentCurrency}
                        onUpdate={fetchMenuItems}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddMenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        restaurantId={currentRestaurant.id}
        onSuccess={fetchMenuItems}
      />

      <QRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        menuUrl={menuUrl}
        restaurantName={currentRestaurant.name}
      />
    </div>
  )
}
