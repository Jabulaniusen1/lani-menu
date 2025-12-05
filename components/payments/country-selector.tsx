"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRY_CONFIG, SupportedCountry } from "@/lib/country-pricing"
import { Globe } from "lucide-react"

interface CountrySelectorProps {
  value: SupportedCountry
  onValueChange: (value: SupportedCountry) => void
  className?: string
}

export function CountrySelector({ value, onValueChange, className }: CountrySelectorProps) {
  const countries = Object.values(COUNTRY_CONFIG)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={value}
        onValueChange={(val) => onValueChange(val as SupportedCountry)}
      >
        <SelectTrigger className="w-[200px] sm:w-[250px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{COUNTRY_CONFIG[value].flag}</span>
              <span>{COUNTRY_CONFIG[value].name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{country.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{country.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {country.currency}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

