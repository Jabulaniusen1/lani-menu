"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleCurrencySelector } from "@/components/ui/simple-currency-selector"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useNotification } from "@/hooks/use-notification"
import { Loader2, Save } from "lucide-react"

interface CurrencySettingsProps {
  restaurantId: string
  currentCurrency: string
  onCurrencyChange: (currency: string) => void
}

export function CurrencySettings({ restaurantId, currentCurrency, onCurrencyChange }: CurrencySettingsProps) {
  const { notify } = useNotification()
  const [currency, setCurrency] = useState(currentCurrency)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (currency === currentCurrency) return

    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      const { error } = await supabase
        .from("restaurants")
        .update({ currency })
        .eq("id", restaurantId)

      if (error) throw error

      onCurrencyChange(currency)
      notify.success("Currency updated successfully!", "Your menu prices will now display in the new currency")
    } catch (error) {
      notify.error("Failed to update currency", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>
          Change the currency used for displaying prices in your menu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Currency</label>
          <SimpleCurrencySelector
            value={currency}
            onValueChange={setCurrency}
            placeholder="Choose a currency..."
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {currency !== currentCurrency && "You have unsaved changes"}
          </div>
          <Button 
            onClick={handleSave} 
            disabled={loading || currency === currentCurrency}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
