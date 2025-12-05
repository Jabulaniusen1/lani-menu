"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useNotification } from "@/hooks/use-notification"

export function SignUpForm() {
  const router = useRouter()
  const { notify } = useNotification()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [restaurantName, setRestaurantName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      notify.error("Passwords do not match", "Please make sure both passwords are identical")
      setLoading(false)
      return
    }

    // Validate restaurant name
    if (!restaurantName.trim()) {
      setError("Restaurant name is required")
      notify.error("Restaurant name required", "Please enter your restaurant name")
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()

      // Sign up the user (email confirmation is disabled)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            restaurant_name: restaurantName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (!data.user) {
        throw new Error("Failed to create user account")
      }

      // Create restaurant immediately after signup
      // Generate unique slug
      const baseSlug = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      const timestamp = Date.now().toString(36)
      const slug = `${baseSlug}-${timestamp}`
      
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .insert({
          name: restaurantName,
          user_id: data.user.id,
          slug: slug,
          currency: "NGN", // Default currency, user can change later
        })
        .select()
        .single()

      if (restaurantError) {
        console.error("Restaurant creation error:", restaurantError)
        // If restaurant creation fails, still redirect to dashboard
        // The dashboard will handle redirecting to add-restaurant if needed
      } else {
        // Create user_restaurants relationship
        const { error: userRestaurantError } = await supabase
          .from("user_restaurants")
          .insert({
            user_id: data.user.id,
            restaurant_id: restaurant.id,
            is_primary: true,
          })

        if (userRestaurantError) {
          console.error("User restaurant relationship error:", userRestaurantError)
        }
      }

      notify.success("Account created successfully!", "Welcome to Lanimenu!")
      router.push("/dashboard")
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during sign up"
      setError(errorMessage)
      notify.error("Sign up failed", errorMessage)
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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
