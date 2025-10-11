import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PublicMenu } from "@/components/menu/public-menu"

interface MenuPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  // Fetch restaurant by slug
  const { data: restaurant } = await supabase.from("restaurants").select("*").eq("slug", slug).single()

  if (!restaurant) {
    notFound()
  }

  // Fetch available menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("available", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  return <PublicMenu restaurant={restaurant} menuItems={menuItems || []} />
}
