"use client"

import { Button } from "@/components/ui/button"
import { BillingPeriod } from "@/lib/country-pricing"
import { getYearlyDiscount } from "@/lib/country-pricing"

interface BillingPeriodToggleProps {
  period: BillingPeriod
  onPeriodChange: (period: BillingPeriod) => void
  className?: string
}

export function BillingPeriodToggle({ period, onPeriodChange, className }: BillingPeriodToggleProps) {
  const discount = getYearlyDiscount()

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        type="button"
        variant={period === 'monthly' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onPeriodChange('monthly')}
        className="min-w-[80px]"
      >
        Monthly
      </Button>
      <Button
        type="button"
        variant={period === 'yearly' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onPeriodChange('yearly')}
        className="min-w-[80px] relative"
      >
        Yearly
        {discount > 0 && (
          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-green-500 text-white rounded">
            Save {discount}%
          </span>
        )}
      </Button>
    </div>
  )
}

