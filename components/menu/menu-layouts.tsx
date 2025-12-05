"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, DollarSign, Flame, ChefHat, Calendar } from "lucide-react"
import { formatPrice } from "@/lib/currency"

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

interface MenuLayoutProps {
  items: MenuItem[]
  currency: string
  onItemClick: (item: MenuItem) => void
  themeConfig?: {
    card: string
    cardHover: string
    text: string
    primary: string
    badge: string
    badgeText: string
    border: string
    accent: string
  }
}

// Grid Layout (Default) - Responsive: 1 column mobile, 2 columns tablet+
export function GridLayout({ items, currency, onItemClick, themeConfig }: MenuLayoutProps) {
  return (
    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={`group transition-all duration-300 cursor-pointer overflow-hidden ${themeConfig?.card || 'bg-white'} ${themeConfig?.cardHover || ''} ${themeConfig?.border || 'border-gray-200'} rounded-2xl border`}
          onClick={() => onItemClick(item)}
        >
          {item.image_url && (
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Badges - top left */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                {item.is_popular && (
                  <Badge className="bg-white/95 backdrop-blur-sm text-orange-600 border-0 px-2.5 py-1 text-xs font-semibold">
                    <Star className="w-3 h-3 mr-1 fill-orange-600" />
                    Popular
                  </Badge>
                )}
                {item.is_spicy && (
                  <Badge className="bg-white/95 backdrop-blur-sm text-red-600 border-0 px-2.5 py-1 text-xs font-semibold">
                    <Flame className="w-3 h-3 mr-1 fill-red-600" />
                    Spicy
                  </Badge>
                )}
              </div>
            </div>
          )}

          <CardContent className="p-5 sm:p-6">
            <div className="space-y-3">
              {/* Title and Price Row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className={`text-lg sm:text-xl font-bold leading-tight flex-1 ${themeConfig?.text || 'text-gray-900'} tracking-tight`}>
                  {item.name}
                </h3>
                <div className={`${themeConfig?.accent || 'text-orange-500'} font-bold text-lg sm:text-xl flex-shrink-0`}>
                  {formatPrice(item.price, currency)}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className={`text-sm ${themeConfig?.text || 'text-gray-600'} opacity-80 line-clamp-2 leading-relaxed`}>
                  {item.description}
                </p>
              )}

              {/* Metadata Row */}
              {(item.preparation_time || item.calories) && (
                <div className={`flex items-center gap-4 pt-2 border-t ${themeConfig?.border || 'border-gray-200'}`}>
                  {item.preparation_time && (
                    <div className={`flex items-center gap-1.5 text-xs ${themeConfig?.text || 'text-gray-500'} opacity-70`}>
                      <Clock className={`w-3.5 h-3.5 ${themeConfig?.text || 'text-gray-400'}`} />
                      <span>{item.preparation_time} min</span>
                    </div>
                  )}
                  {item.calories && (
                    <div className={`flex items-center gap-1.5 text-xs ${themeConfig?.text || 'text-gray-500'} opacity-70`}>
                      <DollarSign className={`w-3.5 h-3.5 ${themeConfig?.text || 'text-gray-400'}`} />
                      <span>{item.calories} cal</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// List Layout - Always horizontal, exactly like event cards (mobile and desktop)
export function ListLayout({ items, currency, onItemClick, themeConfig }: MenuLayoutProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={`group transition-all duration-500 cursor-pointer overflow-hidden rounded-xl ${themeConfig?.card || 'bg-white'} ${themeConfig?.cardHover || ''} ${themeConfig?.border || 'border-gray-200'} border-2`}
          onClick={() => onItemClick(item)}
        >
          {/* Always horizontal layout - image left, content right */}
          <div className="flex">
            {/* Square Image on Left - fixed size on all screens */}
            {item.image_url && (
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0 ml-5 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-[5px] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Popular/Spicy Badges - top left */}
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 z-10">
                  {item.is_popular && (
                    <Badge className="bg-orange-500 text-white text-[10px] sm:text-xs border-0 px-1 py-0">
                      <Star className="w-2 h-2" />
                    </Badge>
                  )}
                  {item.is_spicy && (
                    <Badge className="bg-red-500 text-white text-[10px] sm:text-xs border-0 px-1 py-0">
                      <Flame className="w-2 h-2" />
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Content on Right - matching event card style exactly */}
            <CardContent className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-center min-w-0">
              {/* Title and Price on same line */}
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-2.5">
                <h3 className={`text-base sm:text-lg md:text-xl font-bold ${themeConfig?.text || 'text-gray-800'} leading-tight flex-1 min-w-0 tracking-tight`}>
                  {item.name}
                </h3>
                {/* Price with theme accent color */}
                <div className={`${themeConfig?.accent || 'text-orange-500'} font-bold text-base sm:text-lg md:text-xl flex-shrink-0`}>
                  {formatPrice(item.price, currency)}
                </div>
              </div>
              
              {/* Description if available */}
              {item.description && (
                <p className={`text-xs sm:text-sm ${themeConfig?.text || 'text-gray-600'} opacity-70 mb-2 line-clamp-2`}>
                  {item.description}
                </p>
              )}
              
              {/* Preparation Time with clock icon (like date in event cards) */}
              {item.preparation_time && (
                <div className={`flex items-center gap-1.5 sm:gap-2 mb-1.5 text-xs sm:text-sm ${themeConfig?.text || 'text-gray-600'} opacity-70`}>
                  <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${themeConfig?.text || 'text-gray-500'} opacity-50 flex-shrink-0`} />
                  <span>{item.preparation_time} minutes</span>
                </div>
              )}
              
              {/* Category with food icon */}
              {item.category && (
                <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${themeConfig?.text || 'text-gray-600'} opacity-70`}>
                  <ChefHat className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${themeConfig?.text || 'text-gray-500'} opacity-50 flex-shrink-0`} />
                  <span className="truncate capitalize">{item.category}</span>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Compact Layout - Responsive: 1 column mobile, 2 tablet, 3 desktop
export function CompactLayout({ items, currency, onItemClick, themeConfig }: MenuLayoutProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={`group sm:hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden rounded-xl ${themeConfig?.card || 'bg-white'} ${themeConfig?.cardHover || ''} ${themeConfig?.border || 'border-gray-200'} border-2`}
          onClick={() => onItemClick(item)}
        >
          {item.image_url && (
            <div className="relative">
              <div className="aspect-square overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                {item.is_popular && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs border-0">
                    <Star className="w-2 h-2 fill-white" />
                  </Badge>
                )}
                {item.is_spicy && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs border-0">
                    <Flame className="w-2 h-2 fill-white" />
                  </Badge>
                )}
              </div>

              <div className="absolute top-2 right-2 z-20">
                <Badge className={`${themeConfig?.badge || 'bg-primary'} ${themeConfig?.badgeText || 'text-primary-foreground'} text-xs sm:text-sm px-2 sm:px-2.5 py-0.5 font-bold rounded-lg`}>
                  {formatPrice(item.price, currency)}
                </Badge>
              </div>
            </div>
          )}

          <CardContent className="p-3 sm:p-3.5">
            <h3 className={`font-bold text-xs sm:text-sm leading-tight transition-colors mb-1 ${themeConfig?.text || 'text-gray-900'} tracking-tight`}>
              {item.name}
            </h3>
            {item.description && (
              <p className={`text-xs ${themeConfig?.text || 'text-muted-foreground'} opacity-75 line-clamp-1`}>
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Masonry Layout - Responsive: 1 column mobile, 2 tablet, 3 desktop
export function MasonryLayout({ items, currency, onItemClick, themeConfig }: MenuLayoutProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={`group sm:hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden break-inside-avoid mb-3 sm:mb-4 rounded-xl ${themeConfig?.card || 'bg-white'} ${themeConfig?.cardHover || ''} ${themeConfig?.border || 'border-gray-200'} border-2`}
          onClick={() => onItemClick(item)}
        >
          {item.image_url && (
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 rounded-t-xl"></div>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out rounded-t-xl"
                />
              </div>
              
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                {item.is_popular && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm border-0 font-semibold">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 fill-white" />
                    <span className="hidden sm:inline">Popular</span>
                  </Badge>
                )}
                {item.is_spicy && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm border-0 font-semibold">
                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 fill-white" />
                    <span className="hidden sm:inline">Spicy</span>
                  </Badge>
                )}
              </div>

              <div className="absolute top-3 right-3 z-20">
                <Badge className={`${themeConfig?.badge || 'bg-primary'} ${themeConfig?.badgeText || 'text-primary-foreground'} text-xs sm:text-base px-2.5 sm:px-3 py-1 sm:py-1.5 font-bold rounded-lg`}>
                  {formatPrice(item.price, currency)}
                </Badge>
              </div>
            </div>
          )}

          <CardContent className="p-4 sm:p-5">
            <h3 className={`font-bold text-sm sm:text-base lg:text-lg leading-tight transition-colors mb-2 ${themeConfig?.text || 'text-gray-900'} tracking-tight`}>
              {item.name}
            </h3>
            {item.description && (
              <p className={`text-xs sm:text-sm ${themeConfig?.text || 'text-muted-foreground'} opacity-75 line-clamp-2 sm:line-clamp-3 mb-2 leading-relaxed`}>
                {item.description}
              </p>
            )}
            <div className={`flex items-center gap-2 sm:gap-3 text-xs ${themeConfig?.text || 'text-muted-foreground'} opacity-70`}>
              {item.preparation_time && (
                <div className="flex items-center gap-1">
                  <Clock className={`w-3 h-3 ${themeConfig?.text || 'text-muted-foreground'} opacity-50`} />
                  <span>{item.preparation_time}min</span>
                </div>
              )}
              {item.calories && (
                <div className="flex items-center gap-1">
                  <DollarSign className={`w-3 h-3 ${themeConfig?.text || 'text-muted-foreground'} opacity-50`} />
                  <span>{item.calories} cal</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

