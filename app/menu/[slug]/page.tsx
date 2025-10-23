import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PublicMenu } from "@/components/menu/public-menu"
import { PdfMenuViewer } from "@/components/menu/pdf-menu-viewer"

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

  // Check if restaurant uses PDF menu
  if (restaurant.menu_type === 'pdf' && restaurant.pdf_menu_url) {
    return <PdfMenuViewer restaurant={restaurant} />
  }

  // Fetch available menu items for regular menu
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("available", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  return <PublicMenu restaurant={restaurant} menuItems={menuItems || []} />
}
