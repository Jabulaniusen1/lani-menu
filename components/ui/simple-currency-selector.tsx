"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Currency, searchCurrencies, getCurrencyByCode } from "@/lib/currencies"

interface SimpleCurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SimpleCurrencySelector({ 
  value, 
  onValueChange, 
  placeholder = "Select currency...",
  disabled = false,
  className 
}: SimpleCurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedCurrency = getCurrencyByCode(value)
  const filteredCurrencies = useMemo(() => searchCurrencies(searchQuery), [searchQuery])

  // Debug logging
  console.log('CurrencySelector - value:', value, 'selectedCurrency:', selectedCurrency)

  const groupedCurrencies = useMemo(() => {
    const groups: Record<string, Currency[]> = {}
    filteredCurrencies.forEach(currency => {
      if (!groups[currency.region]) {
        groups[currency.region] = []
      }
      groups[currency.region].push(currency)
    })
    return groups
  }, [filteredCurrencies])

  const handleSelect = (currencyCode: string) => {
    console.log('Selecting currency:', currencyCode)
    onValueChange(currencyCode)
    setOpen(false)
    setSearchQuery("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    console.log('Currency selector open state changing:', newOpen)
    setOpen(newOpen)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          onClick={() => {
            console.log('Currency selector button clicked, current open state:', open)
            if (!disabled) {
              setOpen(!open)
            }
          }}
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCurrency.flag}</span>
              <span className="font-medium">{selectedCurrency.symbol}</span>
              <span className="text-muted-foreground">{selectedCurrency.code}</span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {selectedCurrency.name}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-[60]" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCurrencies.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No currency found.
            </div>
          ) : (
            <div className="p-1">
              {Object.entries(groupedCurrencies).map(([region, currencies]) => (
                <div key={region} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {region}
                  </div>
                  {currencies.map((currency) => (
                    <div
                      key={currency.code}
                      onClick={() => handleSelect(currency.code)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                        value === currency.code && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === currency.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-lg">{currency.flag}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-muted-foreground">{currency.code}</span>
                      </div>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {currency.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
