import { createClient } from './client'

export const BUCKETS = {
  AVATARS: 'avatars',
  RESUMES: 'resumes'
}

/**
 * Compresses an image file in the browser using canvas before uploading.
 * Reduces file size significantly for faster loads.
 */
export async function compressImage(file: File, maxWidth = 800, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context unavailable'))
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression failed'))
          resolve(blob)
        },
        'image/webp',
        quality
      )
    }
    img.onerror = reject
    img.src = url
  })
}

/**
 * Uploads a file to Supabase storage and returns the public URL.
 * Automatically compresses image files before upload.
 */
export async function uploadAsset(bucket: string, file: File, path: string) {
  const supabase = createClient()
  if (!supabase) throw new Error('Supabase client not initialized')

  let uploadFile: File | Blob = file

  // Compress images automatically
  if (bucket === BUCKETS.AVATARS && file.type.startsWith('image/')) {
    try {
      const compressed = await compressImage(file, 512, 0.85)
      // Force .webp extension for best performance
      path = path.replace(/\.[^.]+$/, '.webp')
      uploadFile = compressed
    } catch (e) {
      console.warn('Image compression failed, uploading original:', e)
    }
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, uploadFile, {
      upsert: true,
      cacheControl: '31536000', // 1 year cache for assets
      contentType: bucket === BUCKETS.AVATARS ? 'image/webp' : undefined
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

/**
 * Deletes an asset from storage given its public URL or path.
 * Handles both full URLs and relative paths robustly.
 */
export async function deleteAsset(bucket: string, urlOrPath: string) {
  const supabase = createClient()
  if (!supabase) return

  // Extract path from public URL - handles full URL format
  let path = urlOrPath
  if (urlOrPath.includes('/storage/v1/object/public/')) {
    // Format: .../storage/v1/object/public/bucket-name/path/to/file
    const afterBucket = urlOrPath.split(`/public/${bucket}/`)[1]
    if (afterBucket) path = afterBucket
  } else if (urlOrPath.includes('/')) {
    path = urlOrPath.split('/').pop() || urlOrPath
  }

  if (!path) return

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) console.warn('Storage delete warning:', error.message)
}

/**
 * Extracts the file path from a Supabase public URL.
 */
export function getPathFromUrl(url: string, bucket: string): string | null {
  try {
    const after = url.split(`/public/${bucket}/`)[1]
    return after || null
  } catch {
    return null
  }
}
