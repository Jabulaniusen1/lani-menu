"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, UtensilsCrossed, X, Star, Clock, DollarSign, Flame, ChefHat, Phone, Globe } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { GridLayout, ListLayout } from "./menu-layouts"
import { menuThemes, menuFonts } from "@/lib/menu-themes"

interface Restaurant {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  currency: string
  menu_layout?: string
  menu_theme?: string
  menu_font?: string
  address?: string | null
  phone?: string | null
  website?: string | null
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
  const [priceFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
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
    
    return matchesSearch && matchesCategory
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
  const layout = restaurant.menu_layout || 'grid'
  const theme = restaurant.menu_theme || 'default'
  const font = restaurant.menu_font || 'inter'

  const themeConfig = menuThemes[theme] || menuThemes.default
  const fontConfig = menuFonts[font] || menuFonts.inter

  // Scroll detection for grid layout logo shrinking
  useEffect(() => {
    if (layout !== 'grid') return

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [layout])

  const renderLayout = (items: typeof filteredItems) => {
    const LayoutComponent = 
      layout === 'list' ? ListLayout :
      GridLayout

    return (
      <LayoutComponent 
        items={items} 
        currency={restaurant.currency} 
        onItemClick={setSelectedItem}
        themeConfig={{
          card: themeConfig.card,
          cardHover: themeConfig.cardHover,
          text: themeConfig.text,
          primary: themeConfig.primary,
          badge: themeConfig.badge,
          badgeText: themeConfig.badgeText,
          border: themeConfig.border,
          accent: themeConfig.accent
        }}
      />
    )
  }

  return (
    <div 
      className={`min-h-screen ${themeConfig.background} relative transition-colors duration-300`}
      style={fontConfig.style}
    >
      {/* Subtle gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"></div>
      
      {/* Dotted Pattern Background - Theme Aware */}
      <div 
        className="absolute inset-0 bg-[length:20px_20px] opacity-10 transition-opacity duration-300"
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, ${themeConfig.pattern} 1px, transparent 0)`
        } as React.CSSProperties}
      ></div>
      
      {/* Header - Premium styling with glass effect */}
      <header className={`sticky top-0 z-50 ${themeConfig.card} ${themeConfig.border} border-b backdrop-blur-lg bg-opacity-90 transition-all duration-300 ${layout === 'grid' && isScrolled ? 'py-2' : ''}`}>
        <div className={`container mx-auto ${layout === 'list' ? 'px-3 sm:px-4 py-3 sm:py-4' : isScrolled ? 'px-4 py-2' : 'px-4 py-6'} max-w-6xl transition-all duration-300`}>
          {layout === 'list' ? (
            // Compact header for list layout - horizontal layout
            <div className="flex items-center gap-3">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={`${restaurant.name} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl flex-shrink-0 ring-2 ring-white/50"
                />
              ) : (
                <div className="bg-gradient-to-br from-primary to-primary/80 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                  <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className={`text-lg sm:text-xl md:text-2xl font-bold truncate ${themeConfig.text} tracking-tight`}>{restaurant.name}</h1>
                {restaurant.description && (
                  <p className={`text-xs sm:text-sm ${themeConfig.text} opacity-70 truncate font-medium`}>{restaurant.description}</p>
                )}
              </div>
            </div>
          ) : (
            // Centered header for grid layout - shrinks on scroll
          <div className={`text-center transition-all duration-300 ${isScrolled ? 'space-y-1' : 'space-y-2'}`}>
            <div className={`flex items-center justify-center gap-3 transition-all duration-300 ${isScrolled ? 'mb-1' : 'mb-3'}`}>
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={`${restaurant.name} logo`}
                  className={`object-contain rounded-2xl ring-2 ring-white/50 transition-all duration-300 ${
                    isScrolled 
                      ? 'w-8 h-8 sm:w-10 sm:h-10' 
                      : 'w-14 h-14 sm:w-16 sm:h-16'
                  }`}
                />
              ) : (
                <div className={`bg-gradient-to-br from-primary to-primary/80 rounded-2xl transition-all duration-300 ${
                  isScrolled 
                    ? 'p-1.5 sm:p-2' 
                    : 'p-2.5 sm:p-3'
                }`}>
                  <UtensilsCrossed className={`text-primary-foreground transition-all duration-300 ${
                    isScrolled 
                      ? 'w-4 h-4 sm:w-5 sm:h-5' 
                      : 'w-6 h-6 sm:w-7 sm:h-7'
                  }`} />
                </div>
              )}
            </div>
              <h1 className={`font-bold text-balance ${themeConfig.text} tracking-tight transition-all duration-300 ${
                isScrolled 
                  ? 'text-lg sm:text-xl lg:text-2xl' 
                  : 'text-2xl sm:text-3xl lg:text-4xl'
              }`}>{restaurant.name}</h1>
            {restaurant.description && !isScrolled && (
                <p className={`text-sm sm:text-base ${themeConfig.text} opacity-75 leading-relaxed font-medium max-w-2xl mx-auto mt-2 transition-all duration-300`}>{restaurant.description}</p>
            )}
          </div>
          )}
        </div>
      </header>

      {/* Search and Filters - Sticky with glass effect */}
      <div 
        className={`sticky z-40 backdrop-blur-lg bg-opacity-90 ${themeConfig.card} border-b ${themeConfig.border} transition-all duration-300`} 
        style={{ 
          top: layout === 'list' 
            ? '73px' 
            : layout === 'grid' && isScrolled 
              ? '60px' 
              : '120px' 
        }}
      >
        <div className={`container mx-auto ${layout === 'list' ? 'px-3 sm:px-4 py-3 sm:py-4' : 'px-4 py-6'} max-w-6xl`}>
          <div className={layout === 'list' ? 'space-y-2 sm:space-y-3' : 'space-y-4'}>
          {/* Search Bar - Premium styling */}
          <div className="relative">
            <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${layout === 'list' ? 'w-4 h-4' : 'w-5 h-5'} ${themeConfig.text} opacity-50 z-10`} />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${layout === 'list' ? 'pl-9 h-9 sm:h-10 text-sm' : 'pl-11 h-12 text-base'} ${themeConfig.input} ${themeConfig.inputBorder} ${themeConfig.text} placeholder:opacity-50 border-2 rounded-xl transition-all duration-200`}
            />
          </div>

          {/* Category Filter Buttons - Compact for list layout */}
          <div className={layout === 'list' ? 'space-y-2' : 'space-y-4'}>
            <div className={`flex flex-wrap ${layout === 'list' ? 'gap-1.5' : 'gap-2'}`}>
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size={layout === 'list' ? "sm" : "sm"}
                onClick={() => setSelectedCategory("all")}
                className={`capitalize font-semibold transition-all duration-200 ${layout === 'list' ? 'text-xs h-7 px-2.5' : 'px-4'} ${
                  selectedCategory === "all" 
                    ? `${themeConfig.button} ${themeConfig.buttonText}` 
                    : `${themeConfig.border} ${theme === 'dark' ? 'text-gray-900 bg-white' : themeConfig.text}`
                } rounded-lg`}
              >
                All Items
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`capitalize font-semibold transition-all duration-200 ${layout === 'list' ? 'text-xs h-7 px-2.5' : 'px-4'} ${
                    selectedCategory === category 
                      ? `${themeConfig.button} ${themeConfig.buttonText} shadow-md hover:shadow-lg` 
                      : `${themeConfig.border} ${theme === 'dark' ? 'text-gray-900 bg-white' : themeConfig.text} hover:shadow-sm`
                  } rounded-lg`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Additional Filter Controls - Compact for list layout */}
            {(searchQuery || selectedCategory !== "all") && (
              <div className={`flex flex-wrap ${layout === 'list' ? 'gap-1.5' : 'gap-2'} items-center`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className={`gap-1.5 sm:gap-2 ${themeConfig.text} opacity-70 hover:opacity-100 ${layout === 'list' ? 'text-xs h-7 px-2' : ''}`}
                >
                  <X className={layout === 'list' ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span className={layout === 'list' ? 'hidden sm:inline' : ''}>Clear</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-3 sm:px-4 pb-8 sm:pb-12 max-w-6xl relative z-10">
        {filteredItems.length === 0 ? (
          <Card className={`${themeConfig.card} ${themeConfig.border}`}>
            <CardContent className="py-12 text-center">
              <p className={`${themeConfig.text} opacity-70`}>
                {searchQuery ? "No items match your search." : "No menu items available at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={layout === 'list' ? 'space-y-4' : 'space-y-8'}>
            {displayCategories.map((category) => (
              <section key={category} className={layout === 'list' ? 'space-y-3' : 'space-y-6'}>
                {layout !== 'list' && (
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold capitalize ${themeConfig.text} tracking-tight`}>{category}</h2>
                    <Badge className={`${themeConfig.primary} text-white px-2.5 py-0.5 text-xs sm:text-sm font-semibold`}>{groupedItems[category]?.length || 0}</Badge>
                          </div>
                        )}
                        
                {renderLayout(groupedItems[category] || [])}
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Item Detail Modal - Premium styling */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className={`max-w-2xl ${themeConfig.modal} ${themeConfig.modalBorder} ${themeConfig.text} rounded-2xl border-2`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl sm:text-3xl font-bold ${themeConfig.text} tracking-tight`}>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.image_url && (
                <div className="aspect-video overflow-hidden rounded-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`text-3xl sm:text-4xl font-bold ${themeConfig.accent} tracking-tight`}>
                    {formatPrice(selectedItem.price, restaurant.currency)}
                  </div>
                  <div className="flex gap-2">
                    {selectedItem.is_popular && (
                      <Badge className={`${themeConfig.badge} ${themeConfig.badgeText} font-semibold`}>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    )}
                    {selectedItem.is_spicy && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold">
                        <Flame className="w-3 h-3 mr-1 fill-current" />
                        Spicy
                      </Badge>
                    )}
                  </div>
                </div>
                
                {selectedItem.description && (
                  <p className={`${themeConfig.text} opacity-75 leading-relaxed text-base sm:text-lg`}>
                    {selectedItem.description}
                  </p>
                )}
                
                <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${themeConfig.border} mt-4`}>
                  {selectedItem.preparation_time && (
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${themeConfig.text} opacity-50`} />
                      <span className={`text-sm ${themeConfig.text} opacity-70`}>Prep: {selectedItem.preparation_time} min</span>
                    </div>
                  )}
                  {selectedItem.calories && (
                    <div className="flex items-center gap-2">
                      <DollarSign className={`w-4 h-4 ${themeConfig.text} opacity-50`} />
                      <span className={`text-sm ${themeConfig.text} opacity-70`}>{selectedItem.calories} calories</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className={`border-t ${themeConfig.border} ${themeConfig.card} py-6 sm:py-8 mt-12`}>
        <div className={`container mx-auto ${layout === 'list' ? 'px-3 sm:px-4' : 'px-4'} max-w-6xl`}>
          {/* Restaurant Contact Information */}
          {(restaurant.address || restaurant.phone || restaurant.website) && (
            <div className={`grid ${layout === 'list' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-4 sm:gap-6 mb-6`}>
              {restaurant.address && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <ChefHat className={`w-4 h-4 sm:w-5 sm:h-5 ${themeConfig.accent} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${themeConfig.text} mb-1`}>Address</p>
                    <p className={`text-xs sm:text-sm ${themeConfig.text} opacity-80`}>{restaurant.address}</p>
                  </div>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <Phone className={`w-4 h-4 sm:w-5 sm:h-5 ${themeConfig.accent} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${themeConfig.text} mb-1`}>Phone</p>
                    <a 
                      href={`tel:${restaurant.phone}`}
                      className={`text-xs sm:text-sm ${themeConfig.accent} hover:opacity-80 transition-opacity`}
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <Globe className={`w-4 h-4 sm:w-5 sm:h-5 ${themeConfig.accent} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-medium ${themeConfig.text} mb-1`}>Website</p>
                    <a 
                      href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs sm:text-sm ${themeConfig.accent} hover:opacity-80 transition-opacity break-all`}
                    >
                      {restaurant.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Powered by Lanimenu */}
          <div className={`text-center ${restaurant.address || restaurant.phone || restaurant.website ? 'border-t pt-4 sm:pt-6' : ''}`}>
            <p className={`text-xs sm:text-sm ${themeConfig.text} opacity-60`}>
              Powered by{' '}
          <a 
            href="https://lanimenu.live" 
            target="_blank" 
            rel="noopener noreferrer"
                className={`${themeConfig.accent} hover:opacity-80 transition-opacity`}
          >
                Lanimenu
          </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
