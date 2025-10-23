import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    const supabase = getSupabaseBrowserClient()

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : "Failed to upload file",
    }
  }
}

// New function specifically for PDF uploads
export async function uploadPdfFile(
  file: File,
  path: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    const supabase = getSupabaseBrowserClient()

    // Upload PDF to "pdfs" bucket
    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL from "pdfs" bucket
    const { data: urlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    return {
      url: null,
      error: error instanceof Error ? error.message : "Failed to upload PDF",
    }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete file",
    }
  }
}

// Generate unique file path
export function generateFilePath(userId: string, type: "logo" | "menu-item" | "pdf-menu", filename: string): string {
  const timestamp = Date.now()
  const extension = filename.split(".").pop()
  return `${userId}/${type}/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`
}

// Generate file path for menu items (uses restaurant ID instead of user ID)
export function generateMenuFilePath(restaurantId: string, filename: string): string {
  const timestamp = Date.now()
  const extension = filename.split(".").pop()
  return `${restaurantId}/menu-item/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`
}
