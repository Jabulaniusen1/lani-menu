"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PdfUpload } from "@/components/ui/pdf-upload"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadFile, generateFilePath } from "@/lib/storage"
import { useNotification } from "@/hooks/use-notification"
import { 
  FileText, 
  Utensils, 
  Upload, 
  Check, 
  AlertCircle,
  QrCode,
  Copy,
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
  const [menuType, setMenuType] = useState<'items' | 'pdf'>('items')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingMenuType, setPendingMenuType] = useState<'items' | 'pdf' | null>(null)
  const { notify } = useNotification()

  const handleMenuTypeChange = (newType: 'items' | 'pdf') => {
    if (newType === menuType) return
    
    // Show confirmation dialog
    setPendingMenuType(newType)
    setShowConfirmDialog(true)
  }

  const confirmMenuTypeChange = async () => {
    if (!pendingMenuType) return

    setMenuType(pendingMenuType)
    onDisplayModeChange(pendingMenuType)
    
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Update restaurant menu type
      const { error } = await supabase
        .from('restaurants')
        .update({ menu_type: pendingMenuType })
        .eq('id', restaurant.id)

      if (error) throw error

      notify.success(
        'Menu type updated',
        `Switched to ${pendingMenuType === 'items' ? 'individual menu items' : 'PDF menu'}`
      )

      onMenuTypeChange()
    } catch (error) {
      console.error('Error updating menu type:', error)
      notify.error('Failed to update menu type', 'Please try again')
      // Revert the state
      setMenuType('items')
      onDisplayModeChange('items')
    } finally {
      setShowConfirmDialog(false)
      setPendingMenuType(null)
    }
  }

  const cancelMenuTypeChange = () => {
    setShowConfirmDialog(false)
    setPendingMenuType(null)
  }

  const handlePdfUpload = async () => {
    if (!pdfFile) return

    setUploading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Upload PDF file
      const filePath = generateFilePath(restaurant.id, "pdf-menu", pdfFile.name)
      const { url, error: uploadError } = await uploadFile(pdfFile, "restaurant-assets", filePath)
      
      if (uploadError) {
        throw new Error(`Failed to upload PDF: ${uploadError}`)
      }

      // Update restaurant with PDF URL
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
      
      notify.success('PDF menu uploaded successfully!', 'Your menu is now live')
      onMenuTypeChange()
    } catch (error) {
      console.error('Error uploading PDF:', error)
      notify.error('Failed to upload PDF', 'Please try again')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleMenuTypeChange('items')}
              className={`p-4 rounded-lg border text-left transition-colors ${
                menuType === 'items'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              disabled={uploading}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Utensils className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Individual Items</div>
                  <div className="text-sm text-muted-foreground">
                    Add menu items one by one
                  </div>
                </div>
                {menuType === 'items' && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>

            <button
              onClick={() => handleMenuTypeChange('pdf')}
              className={`p-4 rounded-lg border text-left transition-colors ${
                menuType === 'pdf'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              disabled={uploading}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">PDF Menu</div>
                  <div className="text-sm text-muted-foreground">
                    Upload your existing menu PDF
                  </div>
                </div>
                {menuType === 'pdf' && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>
          </div>

          {menuType === 'pdf' && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                <span className="font-medium text-sm">PDF Menu</span>
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
                      Preview
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
                      {restaurant.pdf_menu_url ? 'Replace PDF' : 'Upload PDF'}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold">Switch Menu Type?</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to switch menu types? Your menu is live and this might affect your customers.
              </p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Switching to: {pendingMenuType === 'items' ? 'Individual Menu Items' : 'PDF Menu'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This will change how your menu appears to customers
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelMenuTypeChange}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmMenuTypeChange}
                className="flex-1"
              >
                Yes, Switch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
