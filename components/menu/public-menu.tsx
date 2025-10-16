"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, UtensilsCrossed, X, Filter, Star, Clock, DollarSign, Flame } from "lucide-react"
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
  preparation_time?: number
  is_popular?: boolean
  is_spicy?: boolean
  calories?: number
}

interface PublicMenuProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
}

export function PublicMenu({ restaurant, menuItems }: PublicMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setPriceFilter("all")
    setSortBy("name")
  }

  // Get unique categories
  const categories = Array.from(new Set(menuItems.map(item => item.category))).sort()

  // Filter and sort items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "low" && item.price < 15) ||
      (priceFilter === "medium" && item.price >= 15 && item.price < 30) ||
      (priceFilter === "high" && item.price >= 30)
    
    return matchesSearch && matchesCategory && matchesPrice
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "popular":
        return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0)
      default:
        return a.name.localeCompare(b.name)
    }
  })

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

  const displayCategories = selectedCategory === "all" ? Object.keys(groupedItems).sort() : [selectedCategory]

  return (
    <div className="min-h-screen bg-background relative">
      {/* Dotted Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(156_163_175)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
      
      {/* Header */}
      <header className="bg-background border-b top-0 z-10 backdrop-blur-sm bg-background/95 relative">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
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

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <div className="space-y-4">
          {/* Search Bar */}
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

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            
cl            {/* Clear Filters Button */}
            {(searchQuery || selectedCategory !== "all" || priceFilter !== "all" || sortBy !== "name") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
            
            {showFilters && (
              <div className="flex flex-wrap gap-2">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>

                {/* Price Filter */}
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-md bg-background"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under $15</option>
                  <option value="medium">$15 - $30</option>
                  <option value="high">Over $30</option>
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-md bg-background"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-4 pb-12 max-w-6xl relative z-10">
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
            {displayCategories.map((category) => (
              <section key={category} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold capitalize">{category}</h2>
                  <Badge variant="secondary">{groupedItems[category]?.length || 0}</Badge>
                </div>

                <div className="grid gap-6 grid-cols-2">
                  {groupedItems[category]?.map((item) => (
                    <Card 
                      key={item.id} 
                      className="group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative">
                        {item.image_url ? (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                            <UtensilsCrossed className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {item.is_popular && (
                            <Badge className="bg-orange-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          {item.is_spicy && (
                            <Badge className="bg-red-500 text-white">
                              <Flame className="w-3 h-3 mr-1" />
                              Spicy
                            </Badge>
                          )}
                        </div>

                        {/* Price */}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                            {formatPrice(item.price, restaurant.currency)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          {/* Additional Info */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {item.preparation_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.preparation_time}min
                              </div>
                            )}
                            {item.calories && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {item.calories} cal
                              </div>
                            )}
                          </div>
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

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.image_url && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(selectedItem.price, restaurant.currency)}
                  </div>
                  <div className="flex gap-2">
                    {selectedItem.is_popular && (
                      <Badge className="bg-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {selectedItem.is_spicy && (
                      <Badge className="bg-red-500 text-white">
                        <Flame className="w-3 h-3 mr-1" />
                        Spicy
                      </Badge>
                    )}
                  </div>
                </div>
                
                {selectedItem.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {selectedItem.preparation_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Prep: {selectedItem.preparation_time} min</span>
                    </div>
                  )}
                  {selectedItem.calories && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedItem.calories} calories</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-background py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Lanimenu</p>
        </div>
      </footer>
    </div>
  )
}
