export interface GeneratedImage {
  id: string
  prompt: string
  image_url: string
  created_at: string
  user_id?: string
}

export interface GenerateImageRequest {
  prompt: string
  width?: number
  height?: number
}

export interface GenerateImageResponse {
  success: boolean
  image?: GeneratedImage
  error?: string
}

