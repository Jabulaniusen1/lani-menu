"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Currency, searchCurrencies, getCurrencyByCode } from "@/lib/currencies"

interface CurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CurrencySelector({ 
  value, 
  onValueChange, 
  placeholder = "Select currency...",
  disabled = false,
  className 
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedCurrency = getCurrencyByCode(value)
  const filteredCurrencies = useMemo(() => searchCurrencies(searchQuery), [searchQuery])

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
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
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search currencies..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            {Object.entries(groupedCurrencies).map(([region, currencies]) => (
              <CommandGroup key={region} heading={region}>
                {currencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={`${currency.code} ${currency.name} ${currency.symbol}`}
                    onSelect={() => {
                      onValueChange(currency.code)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                    className="flex items-center gap-3 px-3 py-2"
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
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
