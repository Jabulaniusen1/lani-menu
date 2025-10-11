"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            restaurant_name: restaurantName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="restaurant-name">Restaurant Name</Label>
          <Input
            id="restaurant-name"
            type="text"
            placeholder="Your Restaurant"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
            disabled={loading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@restaurant.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground leading-relaxed">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
