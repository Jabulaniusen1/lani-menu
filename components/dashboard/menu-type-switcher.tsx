"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PdfUpload } from "@/components/ui/pdf-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadPdfFile, generateFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { 
  FileText, 
  Utensils, 
  Upload, 
  ExternalLink,
  Download
} from "lucide-react"

interface MenuTypeSwitcherProps {
  restaurant: {
    id: string
    name: string
    slug: string
    menu_type: string
    pdf_menu_url: string | null
  }
  onMenuTypeChange: () => void
  displayMode: 'items' | 'pdf'
  onDisplayModeChange: (mode: 'items' | 'pdf') => void
}

export function MenuTypeSwitcher({ restaurant, onMenuTypeChange, displayMode, onDisplayModeChange }: MenuTypeSwitcherProps) {
  // Default to 'items' if menu_type is null/undefined, otherwise use restaurant's menu_type
  const getDefaultMenuType = (): 'items' | 'pdf' => {
    // Trust menu_type as source of truth
    if (restaurant.menu_type === 'pdf') {
      return 'pdf'
    }
    if (restaurant.menu_type === 'items') {
      return 'items'
    }
    // Fallback: if menu_type is null but PDF exists, default to 'pdf'
    if (restaurant.pdf_menu_url) {
      return 'pdf'
    }
    // Default to 'items'
    return 'items'
  }

  const [menuType, setMenuType] = useState<'items' | 'pdf'>(getDefaultMenuType())
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { notify } = useNotification()

  // Initialize and sync menu type from restaurant data
  // Trust menu_type as the source of truth, only use pdf_menu_url as fallback if menu_type is null
  useEffect(() => {
    const currentType = restaurant.menu_type as 'items' | 'pdf' | null | undefined
    
    // Use menu_type from database as primary source of truth
    // Only fallback to 'pdf' if menu_type is null/undefined AND pdf_menu_url exists
    let newType: 'items' | 'pdf'
    if (currentType === 'pdf' || currentType === 'items') {
      // Explicit menu_type in database takes precedence
      newType = currentType
    } else if (restaurant.pdf_menu_url) {
      // Fallback: if menu_type is null but PDF exists, default to 'pdf'
      newType = 'pdf'
    } else {
      // Default to 'items'
      newType = 'items'
    }
    
    // Only update if it's different to avoid unnecessary re-renders
    if (newType !== menuType) {
      setMenuType(newType)
      onDisplayModeChange(newType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.menu_type, restaurant.pdf_menu_url, restaurant.id])

  const handleMenuTypeChange = async (newType: 'items' | 'pdf') => {
    if (newType === menuType) return
    
    // If switching to PDF but no PDF is uploaded, don't allow
    if (newType === 'pdf' && !restaurant.pdf_menu_url && !pdfFile) {
      notify.error('No PDF uploaded', 'Please upload a PDF menu first')
      return
    }

    // Update local state immediately for responsive UI
    setMenuType(newType)
    onDisplayModeChange(newType)
    
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Update restaurant menu type in database
      // This change will be reflected on the preview page immediately
      const { error } = await supabase
        .from('restaurants')
        .update({ menu_type: newType })
        .eq('id', restaurant.id)

      if (error) throw error

      notify.success(
        'Menu type updated',
        `Switched to ${newType === 'items' ? 'individual menu items' : 'uploaded menu'}. The preview page will now show ${newType === 'items' ? 'your individual menu items' : 'your uploaded PDF menu'}.`
      )

      // Refresh restaurant data to ensure UI is in sync
      onMenuTypeChange()
    } catch (error) {
      console.error('Error updating menu type:', error)
      notify.error('Failed to update menu type', 'Please try again')
      // Revert the state - trust menu_type from database
      const revertType = restaurant.menu_type === 'pdf' ? 'pdf' : 'items'
      setMenuType(revertType)
      onDisplayModeChange(revertType)
    }
  }

  const handlePdfUpload = async () => {
    if (!pdfFile) return

    setUploading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Upload PDF to Supabase Storage "pdfs" bucket
      const filePath = generateFilePath(restaurant.id, "pdf-menu", pdfFile.name)
      const { url, error: uploadError } = await uploadPdfFile(pdfFile, filePath)
      
      if (uploadError) {
        throw new Error(`Failed to upload PDF: ${uploadError}`)
      }

      // Update restaurant with PDF URL and menu_type
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ 
          pdf_menu_url: url,
          menu_type: 'pdf'
        })
        .eq('id', restaurant.id)

      if (updateError) throw updateError

      setMenuType('pdf')
      setPdfFile(null)
      
      notify.success('Uploaded menu uploaded successfully!', 'Your menu is now live')
      onMenuTypeChange()
    } catch (error) {
      console.error('Error uploading PDF:', error)
      notify.error('Failed to upload menu', 'Please try again')
    } finally {
      setUploading(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* Menu Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Menu Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Menu Type</label>
            <Select
              value={menuType}
              onValueChange={(value) => handleMenuTypeChange(value as 'items' | 'pdf')}
              disabled={uploading}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {menuType === 'items' ? 'Individual Items' : 'Uploaded Menu'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="items">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Individual Items</div>
                      <div className="text-xs text-muted-foreground">Add menu items one by one</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium">Uploaded Menu</div>
                      <div className="text-xs text-muted-foreground">Upload your existing menu PDF</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {menuType === 'pdf' && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                <span className="font-medium text-sm">Uploaded Menu</span>
                {restaurant.pdf_menu_url && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </div>
              
              {restaurant.pdf_menu_url && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 mb-2">Current PDF is live</p>
                  <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(restaurant.pdf_menu_url!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Menu
                        </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = restaurant.pdf_menu_url!
                        link.download = `${restaurant.name}-menu.pdf`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              <PdfUpload
                onFileSelect={setPdfFile}
                selectedFile={pdfFile}
                disabled={uploading}
              />
              
              {pdfFile && (
                <Button
                  onClick={handlePdfUpload}
                  disabled={uploading}
                  className="w-full mt-3"
                >
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                          {restaurant.pdf_menu_url ? 'Replace Menu' : 'Upload Menu'}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
