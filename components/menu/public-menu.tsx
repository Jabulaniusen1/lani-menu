"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UtensilsCrossed } from "lucide-react"
import { formatPrice } from "@/lib/currency"

interface Restaurant {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  currency: string
}

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
}

interface PublicMenuProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
}

export function PublicMenu({ restaurant, menuItems }: PublicMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  const categories = Object.keys(groupedItems).sort()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={`${restaurant.name} logo`}
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                <div className="bg-primary p-2 rounded-lg">
                  <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-balance">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-4 pb-12 max-w-4xl">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No items match your search." : "No menu items available at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <section key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold capitalize">{category}</h2>
                  <Badge variant="secondary">{groupedItems[category].length}</Badge>
                </div>

                <div className="grid gap-4">
                  {groupedItems[category].map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {item.image_url && (
                            <div className="w-20 h-20 shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <h3 className="text-lg font-semibold leading-tight">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                            )}
                          </div>
                          <div className="text-xl font-bold text-primary shrink-0">{formatPrice(item.price, restaurant.currency)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by QR Menu</p>
        </div>
      </footer>
    </div>
  )
}
