"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Grid3x3, List, LayoutGrid, Columns, Check, Loader2, Type } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useNotification } from "@/hooks/use-notification"
import { LayoutPreview } from "./layout-preview"
import { ThemePreview } from "./theme-preview"

interface MenuDesignsTabProps {
  restaurantId?: string
  currentLayout?: string
  currentTheme?: string
  currentFont?: string
  onLayoutUpdate?: () => void
}

export function MenuDesignsTab({ 
  restaurantId, 
  currentLayout = 'grid',
  currentTheme = 'default',
  currentFont = 'inter',
  onLayoutUpdate 
}: MenuDesignsTabProps) {
  const { notify } = useNotification()
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedLayout, setSelectedLayout] = useState(currentLayout)
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [selectedFont, setSelectedFont] = useState(currentFont)

  useEffect(() => {
    setSelectedLayout(currentLayout)
    setSelectedTheme(currentTheme)
    setSelectedFont(currentFont)
  }, [currentLayout, currentTheme, currentFont])

  const handleUpdate = async (field: 'layout' | 'theme' | 'font', value: string) => {
    if (!restaurantId) {
      notify.error("Error", "Restaurant ID is required")
      return
    }

    setLoading(field)
    try {
      const supabase = getSupabaseBrowserClient()
      const updateData: any = { updated_at: new Date().toISOString() }
      
      if (field === 'layout') {
        updateData.menu_layout = value
        setSelectedLayout(value)
      } else if (field === 'theme') {
        updateData.menu_theme = value
        setSelectedTheme(value)
      } else if (field === 'font') {
        updateData.menu_font = value
        setSelectedFont(value)
      }

      const { error } = await supabase
        .from('restaurants')
        .update(updateData)
        .eq('id', restaurantId)

      if (error) throw error

      const fieldName = field === 'layout' ? 'Layout' : field === 'theme' ? 'Theme' : 'Font'
      notify.success(`${fieldName} updated!`, `Your menu ${fieldName.toLowerCase()} has been changed`)
      onLayoutUpdate?.()
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      notify.error(`Failed to update ${field}`, error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(null)
    }
  }

  const layouts = [
    {
      id: 'grid',
      name: 'Grid',
      description: 'Classic grid layout with large images',
      icon: Grid3x3,
      popular: true
    },
    {
      id: 'list',
      name: 'List',
      description: 'Compact list view, perfect for quick browsing',
      icon: List
    }
  ]

  const themes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean white background with primary colors',
      colors: ['#ffffff', '#3b82f6', '#1e40af']
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Modern dark theme with light text',
      colors: ['#1f2937', '#fbbf24', '#f59e0b']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant with subtle colors',
      colors: ['#f9fafb', '#6b7280', '#374151']
    },
    {
      id: 'warm',
      name: 'Warm',
      description: 'Cozy warm tones perfect for comfort food',
      colors: ['#fef3c7', '#f59e0b', '#d97706']
    },
    {
      id: 'cool',
      name: 'Cool',
      description: 'Fresh cool colors for modern restaurants',
      colors: ['#e0f2fe', '#0ea5e9', '#0284c7']
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated black and gold theme',
      colors: ['#ffffff', '#000000', '#d4af37']
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Vibrant colors for energetic restaurants',
      colors: ['#fef2f2', '#ef4444', '#dc2626']
    }
  ]

  const fonts = [
    {
      id: 'inter',
      name: 'Inter',
      description: 'Modern, clean sans-serif',
      preview: 'The quick brown fox'
    },
    {
      id: 'roboto',
      name: 'Roboto',
      description: 'Friendly and approachable',
      preview: 'The quick brown fox'
    },
    {
      id: 'playfair',
      name: 'Playfair Display',
      description: 'Elegant serif for fine dining',
      preview: 'The quick brown fox'
    },
    {
      id: 'montserrat',
      name: 'Montserrat',
      description: 'Geometric and modern',
      preview: 'The quick brown fox'
    },
    {
      id: 'lora',
      name: 'Lora',
      description: 'Classic serif with character',
      preview: 'The quick brown fox'
    },
    {
      id: 'opensans',
      name: 'Open Sans',
      description: 'Highly readable and versatile',
      preview: 'The quick brown fox'
    },
    {
      id: 'raleway',
      name: 'Raleway',
      description: 'Elegant and sophisticated',
      preview: 'The quick brown fox'
    },
    {
      id: 'fredoka',
      name: 'Fredoka One',
      description: 'Bold and rounded, super friendly',
      preview: 'The quick brown fox'
    },
    {
      id: 'comfortaa',
      name: 'Comfortaa',
      description: 'Soft and rounded, very approachable',
      preview: 'The quick brown fox'
    },
    {
      id: 'quicksand',
      name: 'Quicksand',
      description: 'Friendly and modern, easy to read',
      preview: 'The quick brown fox'
    },
    {
      id: 'nunito',
      name: 'Nunito',
      description: 'Rounded and warm, very welcoming',
      preview: 'The quick brown fox'
    },
    {
      id: 'poppins',
      name: 'Poppins',
      description: 'Geometric and friendly, versatile',
      preview: 'The quick brown fox'
    },
    {
      id: 'dancingscript',
      name: 'Dancing Script',
      description: 'Elegant handwritten style',
      preview: 'The quick brown fox'
    },
    {
      id: 'pacifico',
      name: 'Pacifico',
      description: 'Casual script, fun and relaxed',
      preview: 'The quick brown fox'
    },
    {
      id: 'caveat',
      name: 'Caveat',
      description: 'Natural handwritten feel',
      preview: 'The quick brown fox'
    },
    {
      id: 'kalam',
      name: 'Kalam',
      description: 'Casual handwritten, friendly',
      preview: 'The quick brown fox'
    },
    {
      id: 'permanentmarker',
      name: 'Permanent Marker',
      description: 'Bold marker style, energetic',
      preview: 'The quick brown fox'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Layout & Typography Selection - Combined */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b p-3 sm:p-4 lg:p-5">
          <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
            <Grid3x3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Choose Your Menu Layout & Typography
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1">
            Select how your menu items are displayed and choose a font style.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-5 space-y-4 sm:space-y-5">
          {/* Layout Selection */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Layout
            </h3>
            <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
            {layouts.map((layout) => {
              const Icon = layout.icon
              const isSelected = selectedLayout === layout.id
              
              return (
                <Card
                  key={layout.id}
                  className={`cursor-pointer transition-all duration-300 active:scale-[0.98] sm:hover:shadow-lg sm:hover:scale-[1.02] border-2 touch-manipulation ${
                    isSelected 
                      ? 'ring-2 ring-orange-500 border-orange-500 shadow-md' 
                      : 'border-gray-200 sm:hover:border-gray-300'
                  }`}
                  onClick={() => !loading && handleUpdate('layout', layout.id)}
                >
                  <CardContent className="p-2.5 sm:p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`p-1.5 sm:p-2 rounded-md transition-all flex-shrink-0 ${
                            isSelected 
                              ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-sm' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-xs sm:text-sm truncate">{layout.name}</h3>
                            {layout.popular && (
                              <Badge className="bg-orange-500 text-white text-[9px] sm:text-[10px] mt-0.5 px-1 py-0">
                                ⭐ Popular
                              </Badge>
                            )}
          </div>
        </div>
                        {isSelected && (
                          <div className="bg-orange-500 text-white rounded-full p-0.5 sm:p-1 shadow-sm flex-shrink-0">
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                        {layout.description}
                      </p>
                      {/* Layout Preview - Compact */}
                      <div className="border rounded-md p-1 bg-gradient-to-br from-gray-50 to-white">
                        <LayoutPreview layout={layout.id as any} className="opacity-90" />
                      </div>
                      {loading === 'layout' && isSelected && (
                        <div className="flex items-center justify-center pt-1">
                          <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin text-orange-500" />
            </div>
                      )}
      </div>
                  </CardContent>
                </Card>
              )
            })}
            </div>
          </div>

          {/* Typography Selection */}
          <div className="border-t pt-4 sm:pt-5">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Typography
            </h3>
            <div className="grid gap-2 sm:gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {fonts.map((font) => {
                const isSelected = selectedFont === font.id
                const fontFamily = font.id === 'playfair' ? 'Playfair Display' :
                                  font.id === 'opensans' ? 'Open Sans' :
                                  font.id === 'dancingscript' ? 'Dancing Script' :
                                  font.id === 'permanentmarker' ? 'Permanent Marker' :
                                  font.id.charAt(0).toUpperCase() + font.id.slice(1)
                
                return (
                  <Card
                    key={font.id}
                    className={`cursor-pointer transition-all duration-300 active:scale-[0.98] sm:hover:shadow-lg sm:hover:scale-[1.02] border-2 touch-manipulation ${
                      isSelected 
                        ? 'ring-2 ring-orange-500 border-orange-500 shadow-md' 
                        : 'border-gray-200 sm:hover:border-gray-300'
                    }`}
                    onClick={() => !loading && handleUpdate('font', font.id)}
                  >
                    <CardContent className="p-2 sm:p-2.5">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between gap-1">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-[10px] sm:text-xs truncate">{font.name}</h3>
                          </div>
                          {isSelected && (
                            <div className="bg-orange-500 text-white rounded-full p-0.5 shadow-sm flex-shrink-0">
                              <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                            </div>
                          )}
                        </div>
                        
                        {/* Font Preview - Compact */}
                        <div className="space-y-1">
                          <div 
                            className="text-xs sm:text-sm font-semibold border rounded-md p-1.5 sm:p-2 bg-gradient-to-br from-gray-50 to-white text-center"
                            style={{ fontFamily: fontFamily }}
                          >
                            {font.preview}
                          </div>
                        </div>

                        {loading === 'font' && isSelected && (
                          <div className="flex items-center justify-center pt-0.5">
                            <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin text-orange-500" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50 border-b p-4 sm:p-5 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex-shrink-0">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span>Color Theme</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
            Choose a color scheme that matches your restaurant's vibe. See how it looks with a live preview.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((theme) => {
              const isSelected = selectedTheme === theme.id
              
              return (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all duration-300 active:scale-[0.98] sm:hover:shadow-xl sm:hover:scale-105 border-2 touch-manipulation ${
                    isSelected 
                      ? 'ring-2 ring-orange-500 border-orange-500 shadow-lg sm:scale-105' 
                      : 'border-gray-200 sm:hover:border-gray-300'
                  }`}
                  onClick={() => !loading && handleUpdate('theme', theme.id)}
                >
                  <CardContent className="p-3 sm:p-4 lg:p-5">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Header with name and check */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm sm:text-base lg:text-lg truncate">{theme.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {theme.description}
                          </p>
                </div>
                        {isSelected && (
                          <div className="bg-orange-500 text-white rounded-full p-1 sm:p-1.5 shadow-md flex-shrink-0">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
                        )}
      </div>

                      {/* Theme Preview */}
                      <ThemePreview theme={theme} />
                      
                      {loading === 'theme' && isSelected && (
                        <div className="flex items-center justify-center pt-1 sm:pt-2">
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-orange-500" />
                  </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
                </div>
              </CardContent>
            </Card>

    </div>
  )
}
