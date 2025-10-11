"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Store } from "lucide-react"

interface RestaurantSetupProps {
  userId: string
}

export function RestaurantSetup({ userId }: RestaurantSetupProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const slug = generateSlug(name)

      const { error: insertError } = await supabase.from("restaurants").insert({
        user_id: userId,
        name,
        description,
        slug,
      })

      if (insertError) throw insertError

      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create restaurant")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to QR Menu!</CardTitle>
          <CardDescription>Let's set up your restaurant profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., The Golden Spoon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your restaurant..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating restaurant...
                </>
              ) : (
                "Create Restaurant"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
