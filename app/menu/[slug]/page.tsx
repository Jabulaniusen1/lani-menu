import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PublicMenu } from "@/components/menu/public-menu"

interface MenuPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getRestaurant(slug: string) {
  const supabase = await getSupabaseServerClient()
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single()
  return restaurant
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)

  if (!restaurant) {
    return {
      title: "Menu Not Found",
      description: "The restaurant menu you're looking for doesn't exist.",
    }
  }

  const title = `${restaurant.name} - Digital Menu`
  const description = restaurant.description || `View ${restaurant.name}'s menu online. Browse our delicious offerings and place your order.`
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://lanimenu.live'
  const menuUrl = `${siteUrl}/menu/${slug}`
  
  // Use restaurant logo if available, otherwise use a default image
  // Handle both absolute URLs and Supabase storage URLs
  let imageUrl = `${siteUrl}/og-image.png` // Default fallback
  if (restaurant.logo_url) {
    // If it's already a full URL (http/https), use it directly
    if (restaurant.logo_url.startsWith('http://') || restaurant.logo_url.startsWith('https://')) {
      imageUrl = restaurant.logo_url
    } else {
      // For relative paths or Supabase storage paths, construct full URL
      // Supabase storage URLs typically include the full domain
      imageUrl = restaurant.logo_url.includes('supabase.co') 
        ? restaurant.logo_url 
        : `${siteUrl}${restaurant.logo_url.startsWith('/') ? '' : '/'}${restaurant.logo_url}`
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: menuUrl,
      siteName: "Lanimenu",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${restaurant.name} Menu`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: menuUrl,
    },
    other: {
      "restaurant:name": restaurant.name,
      "restaurant:address": restaurant.address || "",
      "restaurant:phone": restaurant.phone || "",
    },
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  // Fetch restaurant by slug
  const restaurant = await getRestaurant(slug)

  if (!restaurant) {
    notFound()
  }

  // Check menu type and handle accordingly
  // Trust menu_type as the source of truth
  const menuType = restaurant.menu_type || 'items'
  
  // If restaurant uses uploaded menu (PDF), redirect to the PDF URL
  // Only redirect if menu_type is explicitly 'pdf' AND pdf_menu_url exists
  if (menuType === 'pdf' && restaurant.pdf_menu_url) {
    redirect(restaurant.pdf_menu_url)
  }
  
  // If menu_type is 'items' (or null/undefined), show individual items menu
  // Even if pdf_menu_url exists, respect the menu_type setting

  // For 'items' menu type (default), fetch and display individual menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("available", true)
    .order("category", { ascending: true })
    .order("name", { ascending: true })

  return <PublicMenu restaurant={restaurant} menuItems={menuItems || []} />
}
